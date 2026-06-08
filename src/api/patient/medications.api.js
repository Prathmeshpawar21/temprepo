/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/api/patient/medications.api.js

import api from '../api';

/**
 * ✅ Patient Medications API Service
 * Connects to backend medication endpoints
 */

const medicationsAPI = {
  /**
   * Get paginated list of medications with filters
   * @param {Object} params - { page, page_size, status, query, sort_by, sort_order }
   * @returns {Promise} - { medications: [], total, page, page_size, total_pages, has_next, has_prev }
   */
  list: async (params = {}) => {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      page_size: params.page_size || 20,
      sort_by: params.sort_by || 'created_at',
      sort_order: params.sort_order || 'desc',
      ...(params.status && { status: params.status }),
      ...(params.query && { query: params.query }),
      ...(params.indication && { indication: params.indication }),
      ...(params.prescribing_doctor && { prescribing_doctor: params.prescribing_doctor }),
      ...(params.date_from && { date_from: params.date_from }),
      ...(params.date_to && { date_to: params.date_to })
    });
    
    return api.get(`/medications/list?${queryParams}`);
  },

  /**
   * Get single medication by ID
   * @param {number} medicationId
   * @returns {Promise} - Medication object
   */
  getById: async (medicationId) => {
    return api.get(`/medications/${medicationId}`);
  },

  /**
   * Get medication with source prescriptions
   * @param {number} medicationId
   * @returns {Promise} - { medication, sources: [] }
   */
  getWithSources: async (medicationId) => {
    return api.get(`/medications/${medicationId}/sources`);
  },

  /**
   * Create new medication manually
   * @param {Object} medicationData
   * @returns {Promise} - Created medication
   */
  create: async (medicationData) => {
    // Transform frontend data to backend format
    const payload = {
      brand_name: medicationData.name || null,
      generic_name: medicationData.genericName || null,
      dosage: medicationData.dosage || null,
      strength: medicationData.strength || null,
      frequency: medicationData.frequency || null,
      dosage_instructions: medicationData.instructions || null,
      duration_days: parseDurationToDays(medicationData.duration),
      start_date: medicationData.startDate || new Date().toISOString(),
      route: mapRouteToBackend(medicationData.route) || 'oral',
      indication: medicationData.indication || null,
      prescribing_doctor: medicationData.prescribedBy || null,
      prescribing_hospital: medicationData.prescribedByHospital || null,
      notes: medicationData.notes || null
    };
    
    return api.post('/medications/create', payload);
  },

  /**
   * Update medication
   * @param {number} medicationId
   * @param {Object} updateData
   * @returns {Promise} - Updated medication
   */
  update: async (medicationId, updateData) => {
    const payload = {
      ...(updateData.name && { brand_name: updateData.name }),
      ...(updateData.genericName && { generic_name: updateData.genericName }),
      ...(updateData.dosage && { dosage: updateData.dosage }),
      ...(updateData.frequency && { frequency: updateData.frequency }),
      ...(updateData.instructions && { dosage_instructions: updateData.instructions }),
      ...(updateData.notes && { notes: updateData.notes }),
      ...(updateData.status && { status: updateData.status })
    };
    
    return api.patch(`/medications/${medicationId}`, payload);
  },

  /**
   * Stop/discontinue medication
   * @param {number} medicationId
   * @param {string} reason
   * @returns {Promise} - Updated medication
   */
  stop: async (medicationId, reason) => {
    const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
    return api.post(`/medications/${medicationId}/stop${params}`);
  },

  /**
   * Delete medication (soft delete by default)
   * @param {number} medicationId
   * @param {boolean} permanent
   * @returns {Promise}
   */
  delete: async (medicationId, permanent = false) => {
    return api.delete(`/medications/${medicationId}?permanent=${permanent}`);
  },

  /**
   * Get medication statistics
   * @returns {Promise} - { total_medications, active_medications, stopped_medications, medications_with_warnings, recently_added }
   */
  getStats: async () => {
    return api.get('/medications/stats/overview');
  },





  /**
     * Mark a specific dose as taken
     * @param {number} medicationId
     * @param {Object} data - { dose_number, taken_at?, notes? }
     */
    markDoseTaken: async (medicationId, data = {}) => {
      return api.post(`/medications/${medicationId}/mark-taken`, {
        dose_number: data.dose_number || 1,
        taken_at:    data.taken_at   || null,
        notes:       data.notes      || null,
      });
    },
    /**
     * Mark a specific dose as skipped
     * @param {number} medicationId
     * @param {Object} data - { dose_number, notes? }
     */
    markDoseSkipped: async (medicationId, data = {}) => {
      return api.post(`/medications/${medicationId}/mark-skipped`, {
        dose_number: data.dose_number || 1,
        notes:       data.notes      || null,
      });
    },
    /**
     * Get today's full dose schedule for all active medications
     * @returns {Promise} - TodayScheduleResponse
     */
    getTodaySchedule: async () => {
      return api.get('/medications/today/schedule');
    },
    /**
     * Get dose history for a medication
     * @param {number} medicationId
     * @param {number} days - Look-back days (default 7)
     */
    getDoseHistory: async (medicationId, days = 7) => {
      return api.get(`/medications/${medicationId}/dose-history?days=${days}`);
    },






  /**
   * Trigger medication extraction from prescription
   * @param {number} documentId
   * @param {boolean} forceReextract
   * @returns {Promise} - { extraction_id, document_id, status, medications_extracted_count, medications_created }
   */
  extractFromPrescription: async (documentId, forceReextract = false) => {
    return api.post('/medications/extract', {
      document_id: documentId,
      force_reextract: forceReextract
    });
  },

  /**
   * Get extraction status
   * @param {number} documentId
   * @returns {Promise} - { extraction_id, document_id, status, progress_message, medications_extracted, error_message }
   */
  getExtractionStatus: async (documentId) => {
    return api.get(`/medications/extract/${documentId}/status`);
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Parse duration string to days
 * @param {string} duration - "7 days", "2 weeks", "3 months"
 * @returns {number} - Days
 */
function parseDurationToDays(duration) {
  if (!duration) return null;
  
  const lower = duration.toLowerCase();
  const match = lower.match(/(\d+)\s*(day|week|month|year)/);
  
  if (!match) return null;
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  const multipliers = {
    day: 1,
    week: 7,
    month: 30,
    year: 365
  };
  
  return value * (multipliers[unit] || 1);
}

/**
 * Map frontend route to backend enum
 * @param {string} route
 * @returns {string}
 */
function mapRouteToBackend(route) {
  const mapping = {
    'oral': 'oral',
    'injection': 'injection',
    'topical': 'topical',
    'inhalation': 'inhalation',
    'sublingual': 'sublingual',
    'rectal': 'rectal',
    'other': 'other'
  };
  
  return mapping[route?.toLowerCase()] || 'oral';
}

/**
 * Transform backend medication to frontend format
 * @param {Object} backendMed - Backend medication object
 * @returns {Object} - Frontend medication object
 */
export function transformMedicationFromBackend(backendMed) {
  
  return {
    id: backendMed.id,
    name: backendMed.brand_name || backendMed.generic_name,
    genericName: backendMed.generic_name,
    brandName: backendMed.brand_name,
    dosage: backendMed.dosage,
    strength: backendMed.strength,
    frequency: backendMed.frequency,
    frequencyTimesPerDay: backendMed.frequency_times_per_day,
    duration: formatDuration(backendMed.duration_days),
    durationDays: backendMed.duration_days,
    startDate: backendMed.start_date,
    endDate: backendMed.end_date,
    route: backendMed.route,
    indication: backendMed.indication,
    prescribedBy: backendMed.prescribing_doctor,
    prescribedByHospital: backendMed.prescribing_hospital,
    prescribedBySpecialty: null, // Not in backend yet
    prescriptionDate: backendMed.prescription_date,
    status: backendMed.status,
    extractionStatus: backendMed.extraction_status,
    extractionConfidence: backendMed.extraction_confidence,
    isActive: backendMed.is_active,
    isVerified: backendMed.is_verified,
    durationAssumed: backendMed.duration_assumed,
    instructions: backendMed.dosage_instructions,
    notes: backendMed.notes,
    sideEffects: backendMed.side_effects || [],
    warnings: backendMed.interaction_warnings || [],
    interactions: [], // Not in backend yet
    adherence: calculateAdherence(backendMed), // Calculate from backend data
    progress: calculateProgress(backendMed),
    nextDose: calculateNextDose(backendMed),
    createdAt: backendMed.created_at,
    updatedAt: backendMed.updated_at,
    lastTakenAt: backendMed.last_taken_at,
    sourceDocument: backendMed.source_document_filename,
    sourceDocumentDate: backendMed.source_document_date,

    takenToday: (() => {
      if (!backendMed.last_taken_at) return false;
      const lastTaken = new Date(backendMed.last_taken_at);
      const now = new Date();
      return (
        lastTaken.getDate()     === now.getDate()   &&
        lastTaken.getMonth()    === now.getMonth()  &&
        lastTaken.getFullYear() === now.getFullYear()
      );
    })(),
  };
}

/**
 * Format duration days to human readable
 * @param {number} days
 * @returns {string}
 */
function formatDuration(days) {
  if (!days) return 'Ongoing';
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  if (days === 7) return '1 week';
  if (days < 30) return `${Math.round(days / 7)} weeks`;
  if (days === 30) return '1 month';
  if (days < 365) return `${Math.round(days / 30)} months`;
  return `${Math.round(days / 365)} year${days >= 730 ? 's' : ''}`;
}

/**
 * Calculate adherence percentage (placeholder)
 * @param {Object} medication
 * @returns {number}
 */
function calculateAdherence(medication) {
  // TODO: Implement based on adherence tracking data
  // For now, return null if not available
  return medication.adherence_rate || null;
}

/**
 * Calculate progress percentage
 * @param {Object} medication
 * @returns {number}
 */
function calculateProgress(medication) {
  if (!medication.start_date || !medication.end_date) return null;
  
  const start = new Date(medication.start_date);
  const end = new Date(medication.end_date);
  const now = new Date();
  
  if (now >= end) return 100;
  if (now <= start) return 0;
  
  const total = end - start;
  const elapsed = now - start;
  
  return Math.round((elapsed / total) * 100);
}

/**
 * Calculate next dose time (placeholder)
 * @param {Object} medication
 * @returns {string|null}
 */
function calculateNextDose(medication) {
  // TODO: Implement based on frequency and last taken time
  // For now, return null
  return null;
}

export default medicationsAPI;
