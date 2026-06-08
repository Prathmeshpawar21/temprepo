/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// api.js
import axios from "axios";
import { manualRefreshToken } from '../utils/tokenRefresh';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://doctor.allcognix.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    
    const isAuthEndpoint = 
      config.url?.includes('/authentication/login') || 
      config.url?.includes('/authentication/register') ||
      config.url?.includes('/subscription/plans');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔑 [${config.method?.toUpperCase()}] ${config.url}`);
    } else if (!isAuthEndpoint) {
      console.warn(`⚠️ [${config.method?.toUpperCase()}] ${config.url} - No token`);
    } else {
      console.log(`🔓 [${config.method?.toUpperCase()}] ${config.url} - Public endpoint`);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// RESPONSE INTERCEPTOR (WITH ROLE HANDLING)
// ============================================


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const errorData = error.response?.data;
    
    const errorDetail = errorData?.detail || errorData?.error || errorData?.message || '';
    
    console.log('🔍 API Error:', { status, errorDetail, data: errorData });
    
    // ============================================
    // HANDLE 401 - TOKEN EXPIRATION
    // ============================================
    if (status === 403) {
      console.warn('🔐 403 Forbidden - Access Denied');
      
      // ✅ NEW: Show user-friendly error instead of crashing
      const isRoleMismatch = 
        errorDetail.includes('Required role') ||
        errorDetail.includes('Access denied');
      
      if (isRoleMismatch) {
        // Don't crash - let component handle it gracefully
        console.log('🚫 Role-based access denied - component will handle');
      }
      
      // Return error to component (don't throw unhandled error)
      return Promise.reject(error);
    }
    
    
    if (status === 401 && !originalRequest._retry) {
      console.log('⚠️ 401 Unauthorized received');
      
      // ✅ CHECK FOR ROLE MISMATCH - DON'T LOGOUT
      const isRoleMismatch = 
        errorDetail.includes('registered as a patient') ||
        errorDetail.includes('registered as a doctor') ||
        errorDetail.includes('Access denied');
      
      if (isRoleMismatch) {
        console.log('🚫 Role mismatch detected - passing error to component');
        return Promise.reject(error);
      }
      
      // Don't logout if user not found during OAuth flow
      if (errorDetail.includes("User not found")) {
        console.log('⏳ User not in database yet - OAuth flow in progress');
        return Promise.reject(error);
      }
      
      // Check if token expired
      const isTokenExpired = 
        errorDetail === 'token_expired' || 
        errorDetail.includes('expired') ||
        errorDetail.includes('Signature has expired');
      
      if (isTokenExpired) {
        console.log('⏰ Token expired - attempting auto-refresh...');
        
        originalRequest._retry = true;
        
        try {
          const refreshed = await manualRefreshToken();
          
          if (refreshed) {
            console.log('✅ Token refreshed - retrying original request');
            const newToken = localStorage.getItem('access_token');
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
          console.log('🚪 Auto-logout due to refresh failure');
          handleLogout();
          return Promise.reject(error);
        }
      } else {
        // Check for truly invalid token
        const isInvalidCredentials = 
          errorDetail.includes('Invalid credentials') ||
          errorDetail.includes('invalid_token') ||
          errorDetail.includes('Invalid token');
        
        if (isInvalidCredentials) {
          console.warn('🚪 Invalid token - logging out');
          handleLogout();
        } else {
          console.log('⚠️ 401 error - passing to component handler');
          return Promise.reject(error);
        }
      }
      
      return Promise.reject(error);
    }
    
    // ============================================
    // HANDLE 403 - FORBIDDEN (ROLE MISMATCH)
    // ============================================
    
    if (status === 403) {
      console.warn('🔐 403 Forbidden');
      console.log('🔍 Error detail:', errorDetail);
      
      // ✅ CHECK FOR ROLE MISMATCH
      const isRoleMismatch = 
        errorDetail.includes('registered as a patient') ||
        errorDetail.includes('registered as a doctor') ||
        errorDetail.includes('Access denied') ||
        errorDetail.includes('Required role');
      
      if (isRoleMismatch) {
        console.log('🚫 Role-based access denied - passing to component');
      }
      
      // Don't auto-logout on 403, just show error
      return Promise.reject(error);
    }
    
    // Return other errors as-is
    return Promise.reject(error);
  }
);

// ============================================
// HELPER: LOGOUT FUNCTION
// ============================================

function handleLogout() {
  console.log('🚪 Handling logout...');
  
  // Clear all auth data
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('keycloak_id');
  
  // Redirect to login (avoid redirect loop)
  // if (!window.location.pathname.includes('/authentication') && 
  //     !window.location.pathname.includes('/auth/success')) {
  //   window.location.href = '/authentication';
  // }
  if (!window.location.pathname.includes('/login') && 
      !window.location.pathname.includes('/auth/success')) {
    window.location.href = '/login';
  }
}

export default api;
