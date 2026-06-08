/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/api/conversation.api.js
import api from './api';

/**
 * Conversation API wrapper for AI Doctor conversational endpoints
 */

// ============================================
// CONVERSATION ENDPOINTS
// ============================================

/**
 * Send a message in conversation
 * @param {Object} payload
 * @returns {Promise}
 */
export const sendConversationMessage = async (payload) => {
  try {
    console.log('📤 API Call Payload:', payload);
    
    const response = await api.post(
      '/agentic/conversation/chat',
      {
        message: payload.message,
        session_id: payload.session_id || null,
        patient_location: payload.patient_location || 'Bangalore, India',
        patient_age: payload.patient_age || null,
        patient_gender: payload.patient_gender || null,
        medical_history: Array.isArray(payload.medical_history) ? payload.medical_history : []
      }
    );
    
    console.log('📥 API Response:', response.data);
    
    // ✅ NEW: Process enhanced doctor data if present
    if (response.data.doctors_found && Array.isArray(response.data.doctors_found)) {
      response.data.doctors_found = response.data.doctors_found.map(doctor => ({
        ...doctor,
        // ✅ Ensure enhanced fields are accessible
        address_components: doctor.address_components || {},
        action_links: doctor.action_links || {},
        distance_text: doctor.distance_text || (doctor.distance_km ? `${doctor.distance_km.toFixed(1)} km away` : null),
        reviews: doctor.reviews || [],
        // ✅ Fallback for backward compatibility
        whatsapp: doctor.whatsapp || doctor.action_links?.whatsapp,
        phone: doctor.phone || doctor.action_links?.call?.replace('tel:', ''),
      }));
      
      console.log('✅ Processed', response.data.doctors_found.length, 'doctors with enhanced fields');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

/**
 * Request doctor recommendations
 * @param {string} sessionId - Conversation session ID
 * @param {string} patientLocation - Patient location
 * @returns {Promise}
 */
export const requestDoctorRecommendations = async (sessionId, patientLocation = 'Bangalore, India') => {
  try {
    const response = await api.post(
      '/agentic/conversation/request-doctors',
      {
        session_id: sessionId,
        patient_location: patientLocation
      }
    );
    
    // ✅ NEW: Process enhanced doctor data
    if (response.data.doctors_found && Array.isArray(response.data.doctors_found)) {
      response.data.doctors_found = response.data.doctors_found.map(doctor => ({
        ...doctor,
        address_components: doctor.address_components || {},
        action_links: doctor.action_links || {},
        distance_text: doctor.distance_text || (doctor.distance_km ? `${doctor.distance_km.toFixed(1)} km away` : null),
        reviews: doctor.reviews || [],
        whatsapp: doctor.whatsapp || doctor.action_links?.whatsapp,
        phone: doctor.phone || doctor.action_links?.call?.replace('tel:', ''),
      }));
      
      console.log('✅ Processed', response.data.doctors_found.length, 'doctors from /request-doctors');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error requesting doctors:', error);
    throw error;
  }
};

/**
 * Get conversation status
 * @param {string} sessionId - Conversation session ID
 * @returns {Promise}
 */
export const getConversationStatus = async (sessionId) => {
  try {
    const response = await api.get(
      `/agentic/conversation/conversation-status/${sessionId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error getting conversation status:', error);
    throw error;
  }
};

/**
 * End conversation
 * @param {string} sessionId - Conversation session ID
 * @returns {Promise}
 */
export const endConversation = async (sessionId) => {
  try {
    const response = await api.post(
      `/agentic/conversation/end-conversation/${sessionId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error ending conversation:', error);
    throw error;
  }
};




// ============================================
// TRADITIONAL ENDPOINTS (Fallback)
// ============================================

/**
 * Analyze consultation (traditional flow - fallback)
 * @param {Object} payload
 * @returns {Promise}
 */
export const analyzeConsultation = async (payload) => {
  try {
    const response = await api.post(
      '/agentic/analyze-consultation',
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error analyzing consultation:', error);
    throw error;
  }
};
