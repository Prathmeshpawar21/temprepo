/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/utils/tokenRefresh.js
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://doctor.allcognix.com/api';
const REFRESH_BEFORE_EXPIRY = 1 * 60 * 1000; // 1 minute before expiry

let refreshTimer = null;

// ── Decode JWT expiry ────────────────────────────────────────────────────────
function getTokenExpiry(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64    = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload   = JSON.parse(
      decodeURIComponent(
        atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      )
    );
    return payload.exp * 1000; // ms
  } catch {
    return null;
  }
}

// ── Core refresh — calls YOUR backend, not Keycloak directly ────────────────
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  const portal       = localStorage.getItem('portal') || 'patient';

  if (!refreshToken) {
    console.warn('⚠️ No refresh token — skipping refresh');
    return false;
  }

  try {
    console.log('🔄 Refreshing token via backend...');

    const response = await axios.post(
      `${API_BASE_URL}/authentication/refresh`,
      { refresh_token: refreshToken, portal },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const { access_token, refresh_token: newRefreshToken } = response.data;

    if (!access_token) return false;

    localStorage.setItem('access_token', access_token);
    if (newRefreshToken) localStorage.setItem('refresh_token', newRefreshToken);

    console.log('✅ Token refreshed successfully');
    scheduleTokenRefresh(access_token); // reschedule with new token
    return true;

  } catch (error) {
    console.error('❌ Token refresh failed:', error);

    if (error.response?.status === 400 || error.response?.status === 401) {
      console.error('🚪 Refresh token expired — logging out');
      handleSessionExpired();
    }
    return false;
  }
}

// ── Schedule next refresh ────────────────────────────────────────────────────
function scheduleTokenRefresh(accessToken) {
  if (refreshTimer) clearTimeout(refreshTimer);

  const expiryTime = getTokenExpiry(accessToken);
  if (!expiryTime) return;

  const timeUntilRefresh = (expiryTime - Date.now()) - REFRESH_BEFORE_EXPIRY;

  if (timeUntilRefresh > 0) {
    console.log(`🔄 Auto-refresh in ${Math.round(timeUntilRefresh / 1000 / 60)} min`);
    refreshTimer = setTimeout(() => {
      console.log('⏰ Auto-refresh triggered');
      refreshAccessToken();
    }, timeUntilRefresh);
  } else {
    // Already expired or about to — refresh immediately
    console.warn('⚠️ Token near expiry — refreshing now');
    refreshAccessToken();
  }
}

// ── Session expired handler ──────────────────────────────────────────────────
function handleSessionExpired() {
  stopTokenRefresh();
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('keycloak_id');
  toast.error('Session expired. Please login again.');
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
}

// ── Public API ───────────────────────────────────────────────────────────────
export function initTokenRefresh() {
  const accessToken  = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  if (accessToken && refreshToken) {
    console.log('🚀 Token refresh system initialized');
    scheduleTokenRefresh(accessToken);
  } else {
    console.warn('⚠️ Cannot init token refresh — missing tokens');
  }
}

export function stopTokenRefresh() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
    console.log('🛑 Token refresh stopped');
  }
}

export async function manualRefreshToken() {
  return await refreshAccessToken();
}
