/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/api/users/user.js
import api from '../api';

const userAPI = {
  // ── Profile ──────────────────────────────────────────
  getUserProfile:    ()             => api.get('/authentication/me'),
  updateUserProfile: (profileData)  => api.put('/authentication/me', profileData),

  // ── Forgot Password (public) ─────────────────────────
  forgotPassword: (email) =>
    api.post('/authentication/forgot-password', { email }),

  // ── Logout ───────────────────────────────────────────
  logout: (refreshToken, portal) =>
    api.post('/authentication/logout', {
      refresh_token: refreshToken,
      portal,
    }),

  // ── Refresh Token ────────────────────────────────────
  refreshToken: (refreshToken, portal) =>
    api.post('/authentication/refresh', {
      refresh_token: refreshToken,
      portal,
    }),

  // ── Change Password (authenticated) ──────────────────
  changePassword: (currentPassword, newPassword, portal) =>
    api.post('/authentication/change-password', {
      current_password: currentPassword,
      new_password:     newPassword,
      portal,
    }),
};

export { userAPI };
export default userAPI;
