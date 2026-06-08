/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/api/doctor/doctor.appointments.api.js

import api from '../api';

/**
 * ✅ DOCTOR APPOINTMENTS API CLIENT
 * 
 * This file contains all appointment-related API calls for DOCTORS
 * All endpoints are documented and ready to use when backend is implemented
 * 
 * ⚠️ IMPORTANT: These endpoints are different from patient endpoints
 * Doctors can: view all appointments, confirm/reject, manage schedules
 */

const doctorAppointmentsAPI = {
  
  /**
   * Get all appointments for the current doctor
   * @param {Object} params - Filter parameters
   * @param {string} params.status - Filter by status (PENDING, CONFIRMED, COMPLETED, etc.)
   * @param {string} params.date - Filter by date (YYYY-MM-DD)
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.page_size - Items per page (default: 20)
   * @returns {Promise} - { appointments: [], total: 0, page: 1, page_size: 20, stats: {} }
   */
  async getMyAppointments(params = {}) {
    try {
      const { status, date, page = 1, page_size = 20 } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_size: page_size.toString(),
        ...(status && { status }),
        ...(date && { date })
      });
      
      const response = await api.get(`/doctor/appointments?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('❌ Get doctor appointments error:', error);
      throw error;
    }
  },

  /**
   * Get appointment by ID (doctor view)
   * @param {number} appointmentId - Appointment ID
   * @returns {Promise} - Full appointment details
   */
  async getAppointmentById(appointmentId) {
    try {
      const response = await api.get(`/doctor/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Get appointment error:', error);
      throw error;
    }
  },

  /**
   * Get appointment statistics for doctor dashboard
   * @returns {Promise} - Stats object with counts
   */
  async getAppointmentStats() {
    try {
      const response = await api.get('/doctor/appointments/stats');
      return response.data;
    } catch (error) {
      console.error('❌ Get appointment stats error:', error);
      throw error;
    }
  },

  /**
   * Confirm a pending appointment
   * @param {number} appointmentId - Appointment ID
   * @param {Object} confirmationData - Confirmation details
   * @param {string} confirmationData.confirmed_date - Confirmed date (YYYY-MM-DD)
   * @param {string} confirmationData.confirmed_time - Confirmed time (HH:MM)
   * @param {string} confirmationData.notes - Optional notes for patient
   * @returns {Promise} - { success: true, message: '', appointment: {} }
   */
  async confirmAppointment(appointmentId, confirmationData) {
    try {
      const response = await api.post(
        `/doctor/appointments/${appointmentId}/confirm`,
        confirmationData
      );
      return response.data;
    } catch (error) {
      console.error('❌ Confirm appointment error:', error);
      throw error;
    }
  },

  /**
   * Reject a pending appointment
   * @param {number} appointmentId - Appointment ID
   * @param {string} reason - Reason for rejection
   * @returns {Promise} - { success: true, message: '' }
   */
  async rejectAppointment(appointmentId, reason) {
    try {
      const response = await api.post(
        `/doctor/appointments/${appointmentId}/reject`,
        { reason }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Reject appointment error:', error);
      throw error;
    }
  },

  /**
   * Reschedule an appointment
   * @param {number} appointmentId - Appointment ID
   * @param {Object} rescheduleData - New date/time
   * @param {string} rescheduleData.new_date - New date (YYYY-MM-DD)
   * @param {string} rescheduleData.new_time - New time (HH:MM)
   * @param {string} rescheduleData.reason - Reason for rescheduling
   * @returns {Promise} - { success: true, message: '', appointment: {} }
   */
  async rescheduleAppointment(appointmentId, rescheduleData) {
    try {
      const response = await api.post(
        `/doctor/appointments/${appointmentId}/reschedule`,
        rescheduleData
      );
      return response.data;
    } catch (error) {
      console.error('❌ Reschedule appointment error:', error);
      throw error;
    }
  },

  /**
   * Mark appointment as completed
   * @param {number} appointmentId - Appointment ID
   * @param {Object} completionData - Completion details
   * @param {string} completionData.diagnosis - Diagnosis notes
   * @param {string} completionData.prescription - Prescription details
   * @param {string} completionData.follow_up_date - Optional follow-up date
   * @returns {Promise} - { success: true, message: '', appointment: {} }
   */
  async completeAppointment(appointmentId, completionData = {}) {
    try {
      const response = await api.post(
        `/doctor/appointments/${appointmentId}/complete`,
        completionData
      );
      return response.data;
    } catch (error) {
      console.error('❌ Complete appointment error:', error);
      throw error;
    }
  },

  /**
   * Cancel appointment (by doctor)
   * @param {number} appointmentId - Appointment ID
   * @param {string} reason - Reason for cancellation
   * @returns {Promise} - { success: true, message: '' }
   */
  async cancelAppointment(appointmentId, reason) {
    try {
      const response = await api.delete(
        `/doctor/appointments/${appointmentId}/cancel`,
        { params: { reason } }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Cancel appointment error:', error);
      throw error;
    }
  },

  /**
   * Get today's appointments
   * @returns {Promise} - Array of today's appointments
   */
  async getTodaysAppointments() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.get(`/doctor/appointments?date=${today}`);
      return response.data;
    } catch (error) {
      console.error('❌ Get today appointments error:', error);
      throw error;
    }
  },

  /**
   * Get upcoming appointments (next 7 days)
   * @returns {Promise} - Array of upcoming appointments
   */
  async getUpcomingAppointments() {
    try {
      const response = await api.get('/doctor/appointments/upcoming');
      return response.data;
    } catch (error) {
      console.error('❌ Get upcoming appointments error:', error);
      throw error;
    }
  },

  /**
   * Search appointments by patient name or booking ID
   * @param {string} query - Search query
   * @returns {Promise} - Array of matching appointments
   */
  async searchAppointments(query) {
    try {
      const response = await api.get(`/doctor/appointments/search`, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Search appointments error:', error);
      throw error;
    }
  },

  /**
   * Get patient history for an appointment
   * @param {number} appointmentId - Appointment ID
   * @returns {Promise} - Patient's appointment history
   */
  async getPatientHistory(appointmentId) {
    try {
      const response = await api.get(
        `/doctor/appointments/${appointmentId}/patient-history`
      );
      return response.data;
    } catch (error) {
      console.error('❌ Get patient history error:', error);
      throw error;
    }
  },

  /**
   * Add notes to appointment
   * @param {number} appointmentId - Appointment ID
   * @param {string} notes - Doctor's notes
   * @returns {Promise} - { success: true, message: '' }
   */
  async addNotes(appointmentId, notes) {
    try {
      const response = await api.post(
        `/doctor/appointments/${appointmentId}/notes`,
        { notes }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Add notes error:', error);
      throw error;
    }
  },

  /**
   * Update appointment status (generic)
   * @param {number} appointmentId - Appointment ID
   * @param {string} status - New status
   * @param {string} reason - Optional reason
   * @returns {Promise} - { success: true, message: '', appointment: {} }
   */
  async updateAppointmentStatus(appointmentId, status, reason = '') {
    try {
      const response = await api.patch(
        `/doctor/appointments/${appointmentId}/status`,
        { status, reason }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Update appointment status error:', error);
      throw error;
    }
  },

  /**
   * Get appointment slots availability
   * @param {string} date - Date to check (YYYY-MM-DD)
   * @returns {Promise} - Available time slots
   */
  async getAvailableSlots(date) {
    try {
      const response = await api.get(`/doctor/appointments/slots`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Get available slots error:', error);
      throw error;
    }
  },

  /**
   * Bulk update appointment statuses
   * @param {Array} appointmentIds - Array of appointment IDs
   * @param {string} status - New status
   * @returns {Promise} - { success: true, updated_count: 0 }
   */
  async bulkUpdateStatus(appointmentIds, status) {
    try {
      const response = await api.post('/doctor/appointments/bulk-update', {
        appointment_ids: appointmentIds,
        status
      });
      return response.data;
    } catch (error) {
      console.error('❌ Bulk update error:', error);
      throw error;
    }
  }
};

export default doctorAppointmentsAPI;
