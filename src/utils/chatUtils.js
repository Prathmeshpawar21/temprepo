/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/utils/chatUtils.js

/**
 * Chat Utility Functions
 * Helper functions for chat formatting, validation, and processing
 */

// ============================================
// MESSAGE FORMATTING
// ============================================

/**
 * Format timestamp to readable string
 * @param {Date|string} timestamp
 * @returns {string}
 */
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    return diffInMinutes <= 0 ? 'just now' : `${diffInMinutes}m ago`;
  }

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

/**
 * Format file size to readable string
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// ============================================
// MESSAGE VALIDATION
// ============================================

/**
 * Validate message content
 * @param {string} message
 * @returns {Object} { isValid, error }
 */
export const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return { isValid: false, error: 'Message must be a string' };
  }

  if (message.trim().length === 0) {
    return { isValid: false, error: 'Message cannot be empty' };
  }

  if (message.length > 5000) {
    return { isValid: false, error: 'Message too long (max 5000 characters)' };
  }

  return { isValid: true };
};

/**
 * Validate file upload
 * @param {File} file
 * @param {Object} options
 * @returns {Object} { isValid, error }
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['image/*', 'application/pdf', 'text/plain']
  } = options;

  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: `File too large (max ${formatFileSize(maxSize)})` 
    };
  }

  return { isValid: true };
};

// ============================================
// SYMPTOM ANALYSIS
// ============================================

/**
 * Extract symptoms from text
 * @param {string} text
 * @returns {Array}
 */
export const extractSymptoms = (text) => {
  const commonSymptoms = [
    'headache', 'fever', 'cough', 'cold', 'flu', 'sore throat', 'nausea',
    'dizziness', 'fatigue', 'body ache', 'chest pain', 'difficulty breathing',
    'rash', 'vomiting', 'diarrhea', 'constipation', 'abdominal pain',
    'anxiety', 'depression', 'insomnia', 'muscle pain', 'joint pain'
  ];

  const foundSymptoms = [];
  const lowerText = text.toLowerCase();

  commonSymptoms.forEach(symptom => {
    if (lowerText.includes(symptom)) {
      foundSymptoms.push(symptom);
    }
  });

  return [...new Set(foundSymptoms)]; // Remove duplicates
};

/**
 * Detect urgency level from symptoms
 * @param {Array} symptoms
 * @returns {string} 'low' | 'medium' | 'high' | 'critical'
 */
export const detectUrgency = (symptoms) => {
  const criticalSymptoms = [
    'chest pain', 'difficulty breathing', 'severe bleeding',
    'unconscious', 'stroke', 'heart attack', 'severe allergic'
  ];

  const highUrgencySymptoms = [
    'severe fever', 'severe pain', 'difficulty swallowing',
    'confusion', 'severe headache', 'persistent vomiting'
  ];

  const lowerSymptoms = symptoms.map(s => s.toLowerCase());

  if (lowerSymptoms.some(s => criticalSymptoms.some(cs => s.includes(cs)))) {
    return 'critical';
  }

  if (lowerSymptoms.some(s => highUrgencySymptoms.some(hs => s.includes(hs)))) {
    return 'high';
  }

  if (symptoms.length > 3) {
    return 'medium';
  }

  return 'low';
};

// ============================================
// CHAT STATE MANAGEMENT
// ============================================

/**
 * Create new message object
 * @param {string} content
 * @param {string} role - 'user' or 'assistant'
 * @param {Object} metadata
 * @returns {Object}
 */
export const createMessage = (content, role = 'user', metadata = {}) => {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    content,
    role,
    timestamp: new Date().toISOString(),
    ...metadata
  };
};

/**
 * Format chat history for API
 * @param {Array} messages
 * @returns {Array}
 */
export const formatChatHistory = (messages) => {
  return messages
    .filter(msg => msg.role && msg.content)
    .map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp
    }));
};

// ============================================
// CONVERSATION STATE
// ============================================

/**
 * Parse conversation stage string
 * @param {string} stage
 * @returns {Object}
 */
export const parseConversationStage = (stage) => {
  const stageConfig = {
    initial_greeting: {
      label: 'Initial Greeting',
      description: 'Starting consultation',
      icon: '👋',
      progress: 10
    },
    information_gathering: {
      label: 'Information Gathering',
      description: 'Collecting symptoms and medical history',
      icon: '📋',
      progress: 40
    },
    symptom_analysis: {
      label: 'Symptom Analysis',
      description: 'AI analyzing your symptoms',
      icon: '🔍',
      progress: 60
    },
    ready_for_recommendations: {
      label: 'Recommendations Ready',
      description: 'Preparing doctor recommendations',
      icon: '✅',
      progress: 80
    },
    doctor_search_completed: {
      label: 'Doctor Search Complete',
      description: 'Doctors found and presented',
      icon: '🏥',
      progress: 100
    }
  };

  return stageConfig[stage] || {
    label: stage?.split('_').join(' '),
    description: 'Processing',
    icon: '⏳',
    progress: 50
  };
};

// ============================================
// DOCTOR FILTERING & SORTING
// ============================================

/**
 * Filter doctors by criteria
 * @param {Array} doctors
 * @param {Object} filters
 * @returns {Array}
 */
export const filterDoctors = (doctors, filters = {}) => {
  return doctors.filter(doctor => {
    const { 
      maxDistance, 
      minRating, 
      specialty, 
      maxFee 
    } = filters;

    if (maxDistance && doctor.distance_km > maxDistance) return false;
    if (minRating && (!doctor.rating || doctor.rating < minRating)) return false;
    if (specialty && doctor.specialty?.toLowerCase() !== specialty.toLowerCase()) return false;
    if (maxFee && doctor.consultation_fee > maxFee) return false;

    return true;
  });
};

/**
 * Sort doctors by criteria
 * @param {Array} doctors
 * @param {string} sortBy
 * @returns {Array}
 */
export const sortDoctors = (doctors, sortBy = 'rating') => {
  const sorted = [...doctors];

  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    case 'distance':
      return sorted.sort((a, b) => (a.distance_km || 999) - (b.distance_km || 999));

    case 'fee':
      return sorted.sort((a, b) => (a.consultation_fee || 999) - (b.consultation_fee || 999));

    case 'match':
      return sorted.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

    case 'experience':
      return sorted.sort((a, b) => (b.experience_years || 0) - (a.experience_years || 0));

    default:
      return sorted;
  }
};

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Parse API error response
 * @param {Object} error
 * @returns {Object} { message, code, details }
 */
export const parseError = (error) => {
  if (!error) {
    return { message: 'An unknown error occurred', code: 'UNKNOWN_ERROR' };
  }

  const response = error.response?.data;
  const status = error.response?.status;

  // Handle specific error codes
  switch (status) {
    case 429:
      return {
        message: 'Rate limit exceeded. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
        details: response?.usage_info
      };

    case 401:
      return {
        message: 'Session expired. Please log in again.',
        code: 'UNAUTHORIZED'
      };

    case 403:
      return {
        message: 'You do not have permission to perform this action.',
        code: 'FORBIDDEN'
      };

    case 422:
      return {
        message: 'Invalid data provided.',
        code: 'VALIDATION_ERROR',
        details: response?.detail
      };

    case 500:
      return {
        message: 'Server error. Please try again later.',
        code: 'SERVER_ERROR'
      };

    default:
      return {
        message: response?.error || error.message || 'An error occurred',
        code: response?.error_code || 'UNKNOWN_ERROR'
      };
  }
};

// ============================================
// LOCAL STORAGE
// ============================================

/**
 * Save chat to local storage
 * @param {string} key
 * @param {Array} messages
 */
export const saveChatToStorage = (key, messages) => {
  try {
    localStorage.setItem(key, JSON.stringify({
      messages,
      savedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error saving chat to storage:', error);
  }
};

/**
 * Load chat from local storage
 * @param {string} key
 * @returns {Object} { messages, savedAt } or null
 */
export const loadChatFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading chat from storage:', error);
    return null;
  }
};

/**
 * Clear chat from storage
 * @param {string} key
 */
export const clearChatFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing chat from storage:', error);
  }
};

// ============================================
// SPEECH & TEXT
// ============================================

/**
 * Check if browser supports speech synthesis
 * @returns {boolean}
 */
export const isSpeechSynthesisSupported = () => {
  return 'speechSynthesis' in window;
};

/**
 * Speak text using browser TTS
 * @param {string} text
 * @param {Object} options
 */
export const speakText = (text, options = {}) => {
  if (!isSpeechSynthesisSupported()) {
    console.warn('Speech synthesis not supported');
    return;
  }

  const {
    lang = 'en-US',
    rate = 0.9,
    pitch = 1,
    volume = 1
  } = options;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

/**
 * Stop speech synthesis
 */
export const stopSpeech = () => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};
