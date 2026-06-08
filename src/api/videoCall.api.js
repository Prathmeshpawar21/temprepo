/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/api/videoCall.api.js

import api from './api';

/**
 * Video Call API Client
 */
const videoCallAPI = {
  /**
   * ✅ NEW: Get video sessions for multiple appointments (BATCH)
   * Replaces N individual requests with 1 single batch request
   */
  async getBatchVideoSessions(appointmentIds) {
    try {
      console.log(`📦 Fetching video sessions for ${appointmentIds.length} appointments`);
      const response = await api.post('/video/sessions/batch-status', appointmentIds);
      console.log('✅ Batch video sessions received:', Object.keys(response.data).length);
      return response.data; // Returns { appointmentId: sessionData }
    } catch (error) {
      console.error('Batch video sessions error:', error);
      // Return empty object instead of throwing - graceful degradation
      return {};
    }
  },

  /**
   * Get video session by appointment ID
   */
  async getVideoSession(appointmentId) {
    try {
      const response = await api.get(`/video/sessions/appointment/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error('Get video session error:', error);
      throw error;
    }
  },

  /**
   * Create video session for appointment
   */
  async createVideoSession(appointmentId) {
    try {
      const response = await api.post('/video/sessions/create', {
        appointment_id: appointmentId,
        enable_recording: true
      });
      return response.data;
    } catch (error) {
      console.error('Create video session error:', error);
      throw error;
    }
  },

  /**
   * Check if user can join video call
   */
  async canJoinVideoCall(appointmentId) {
    try {
      const response = await api.get(`/video/sessions/${appointmentId}/can-join`);
      return response.data;
    } catch (error) {
      console.error('Can join check error:', error);
      throw error;
    }
  },

  /**
   * Join video call
   */
  async joinVideoCall(appointmentId, userType = 'patient') {
    try {
      const response = await api.post(`/video/sessions/${appointmentId}/join`, {
        user_type: userType
      });
      return response.data;
    } catch (error) {
      console.error('Join video call error:', error);
      throw error;
    }
  },

  /**
   * End video call
   */
  async endVideoCall(appointmentId, durationMinutes = null) {
    try {
      const response = await api.post(`/video/sessions/${appointmentId}/end`, {
        duration_minutes: durationMinutes
      });
      return response.data;
    } catch (error) {
      console.error('End video call error:', error);
      throw error;
    }
  },

  /**
   * Get recording
   */
  async getRecording(appointmentId) {
    try {
      const response = await api.get(`/video/sessions/${appointmentId}/recording`);
      return response.data;
    } catch (error) {
      console.error('Get recording error:', error);
      throw error;
    }
  }
};

export default videoCallAPI;
