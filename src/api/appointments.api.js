/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/api/appointments.api.js
import api from './api';

/**
 * Appointments API Client
 */
const appointmentsAPI = {
  /**
   * Book a new appointment
   */
  async bookAppointment(appointmentData) {
    try {
      const response = await api.post('/appointments/book', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Book appointment error:', error);
      throw error;
    }
  },

  /**
   * Get all appointments for current user
   */
  async getMyAppointments(params = {}) {
    try {
      const { status, page = 1, page_size = 20 } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_size: page_size.toString(),
        ...(status && { status })
      });
      const response = await api.get(`/appointments/my-appointments?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Get appointments error:', error);
      throw error;
    }
  },

  /**
   * Get appointment by ID
   */
  async getAppointmentById(appointmentId) {
    try {
      const response = await api.get(`/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error('Get appointment error:', error);
      throw error;
    }
  },

  /**
   * Get appointment by booking ID
   */
  async getAppointmentByBookingId(bookingId) {
    try {
      const response = await api.get(`/appointments/booking/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Get appointment by booking ID error:', error);
      throw error;
    }
  },

  /**
   * Cancel appointment
   */
  async cancelAppointment(appointmentId, reason) {
    try {
      const response = await api.delete(`/appointments/${appointmentId}/cancel`, {
        params: { reason }
      });
      return response.data;
    } catch (error) {
      console.error('Cancel appointment error:', error);
      throw error;
    }
  },





  /**
   * Confirm appointment (by clinic)
   */
  async confirmAppointment(confirmData) {
    try {
      const response = await api.post('/appointments/confirm', confirmData);
      return response.data;
    } catch (error) {
      console.error('Confirm appointment error:', error);
      throw error;
    }
  }


  
};

export default appointmentsAPI;
