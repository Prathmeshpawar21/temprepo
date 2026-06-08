/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/api/consultation_history.api.js
import api from './api';

// ── Specialist type → image filename map ─────────────────────────────────────
export const SPECIALIST_IMAGES = {
  general_physician:  '/doctors_images/General_Physician.png',
  cardiologist:       '/doctors_images/Cardiologist.png',
  dermatologist:      '/doctors_images/Dermatologist.png',
  orthopedic:         '/doctors_images/Orthopedic.png',
  pediatrician:       '/doctors_images/Pediatrician.png',
  gynecologist:       '/doctors_images/Gynecologist.png',
  ent:                '/doctors_images/ENT.png',
  dentist:            '/doctors_images/Dentist.png',
  ophthalmologist:    '/doctors_images/Ophthalmologist.png',
  psychiatrist:       '/doctors_images/Psychiatrist.png',
  neurologist:        '/doctors_images/Neurologist.png',
  gastroenterologist: '/doctors_images/Gastroenterologist.png',
  urologist:          '/doctors_images/Urologist.png',
  endocrinologist:    '/doctors_images/Endocrinologist.png',
  pulmonologist:      '/doctors_images/Pulmonologist.png',
  rheumatologist:     '/doctors_images/Rheumatologist.png',
  oncologist:         '/doctors_images/Oncologist.png',
  nephrologist:       '/doctors_images/Nephrologist.png',
  physiotherapist:    '/doctors_images/Physiotherapist.png',
  dietitian:          '/doctors_images/Dietitian.png',
};

// ── Severity color tokens ─────────────────────────────────────────────────────
export const SEVERITY_CONFIG = {
  LOW:      { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-500'  },
  MEDIUM:   { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500' },
  HIGH:     { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
  CRITICAL: { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-500'    },
};

// ── Status color tokens ───────────────────────────────────────────────────────
export const STATUS_CONFIG = {
  COMPLETED:   { bg: 'bg-teal-100',   text: 'text-teal-700',   label: 'Completed'   },
  IN_PROGRESS: { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'In Progress' },
  ABANDONED:   { bg: 'bg-gray-100',   text: 'text-gray-600',   label: 'Abandoned'   },
  CANCELLED:   { bg: 'bg-red-100',    text: 'text-red-600',    label: 'Cancelled'   },
};

// ── Intent display map ────────────────────────────────────────────────────────
export const INTENT_LABELS = {
  symptom_triage:   'Symptom Triage',
  medication_query: 'Medication Query',
  followup_check:   'Follow-up Check',
  mood_checkin:     'Mood Check-in',
  records_search:   'Records Search',
  booking_request:  'Booking Request',
  general_query:    'General Query',
  unknown:          'General',
};

// ─────────────────────────────────────────────────────────────────────────────
// API CLIENT
// ─────────────────────────────────────────────────────────────────────────────

const consultationHistoryAPI = {

  // ── List (paginated) ────────────────────────────────────────────────────────
  async getMyConsultations(params = {}) {
    const {
      page = 1,
      page_size = 20,
      status,
      severity,
      specialist_type,
    } = params;

    const query = new URLSearchParams({ page, page_size });
    if (status)          query.append('status', status);
    if (severity)        query.append('severity', severity);
    if (specialist_type) query.append('specialist_type', specialist_type);

    const response = await api.get(
      `/agentic/consultation-history/my-consultations?${query}`
    );
    return response.data;
  },

  // ── Single consultation detail ──────────────────────────────────────────────
  async getConsultationById(consultationId) {
    const response = await api.get(
      `/agentic/consultation-history/${consultationId}`
    );
    return response.data;
  },

  // ── Messages only ───────────────────────────────────────────────────────────
  async getConsultationMessages(consultationId) {
    const response = await api.get(
      `/agentic/consultation-history/${consultationId}/messages`
    );
    return response.data;
  },

  // ── Stats overview ──────────────────────────────────────────────────────────
  async getConsultationStats() {
    const response = await api.get(
      '/agentic/consultation-history/stats/overview'
    );
    return response.data;
  },

  // ── Recent (dashboard widget) ───────────────────────────────────────────────
  async getRecentConsultations(limit = 5) {
    const response = await api.get(
      `/agentic/consultation-history/quick/recent?limit=${limit}`
    );
    return response.data;
  },

  // ── Search ──────────────────────────────────────────────────────────────────
  async searchConsultations(query) {
    const response = await api.get(
      `/agentic/consultation-history/search/query?q=${encodeURIComponent(query)}`
    );
    return response.data;
  },


  // ── Delete ──────────────────────────────────────────────────────────────────
  async deleteConsultation(consultationId) {
    const response = await api.delete(
      `/agentic/consultation-history/${consultationId}`
    );
    return response.data;
  },


  // ── ✅ RESUME — single call returns everything needed ───────────────────────
  // Returns:
  //   specialist_type, resume_context (for voice session start)
  //   messages       (pre-populate transcript display)
  //   consultation   (card details)
  //   summary        (banner info)
  async resumeConsultation(consultationId) {
    const response = await api.post(
      `/agentic/consultation-history/resume/${consultationId}`
    );
    return response.data;
  },
};

export default consultationHistoryAPI;
