/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/api/booking.api.js

import api from '../api';

/**
 * Booking API Client for Pathway 2 (Manual Booking Flow)
 * Handles: Specialties → Doctors → Slots → Booking
 */
const bookingAPI = {
  
  // ============================================
  // STEP 1: SPECIALTIES
  // ============================================

  /**
   * Get popular specialties (limited list for homepage)
   */
  async getPopularSpecialties(limit = 8) {
    try {
      const response = await api.get('/bookings/specialties/popular', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Get popular specialties error:', error);
      throw error;
    }
  },

  /**
   * Get all specialties with pagination
   */
  async getAllSpecialties(page = 1, pageSize = 20, isActive = true) {
    try {
      const response = await api.get('/bookings/specialties/all', {
        params: { 
          page, 
          page_size: pageSize,
          is_active: isActive
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get all specialties error:', error);
      throw error;
    }
  },

  /**
   * Search specialties by query
   */
  async searchSpecialties(query, limit = 10) {
    try {
      const response = await api.get('/bookings/specialties/search', {
        params: { query, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Search specialties error:', error);
      throw error;
    }
  },

  /**
   * Get specialty by ID
   */
  async getSpecialtyById(specialtyId) {
    try {
      const response = await api.get(`/bookings/specialties/${specialtyId}`);
      return response.data;
    } catch (error) {
      console.error('Get specialty by ID error:', error);
      throw error;
    }
  },

  /**
   * Get specialty statistics
   */
  async getSpecialtyStats(specialtyId) {
    try {
      const response = await api.get(`/bookings/specialties/${specialtyId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Get specialty stats error:', error);
      throw error;
    }
  },

  // ============================================
  // STEP 2: DOCTORS
  // ============================================

  /**
   * Search nearby doctors (Google Places API)
   */
  async searchNearbyDoctors(latitude, longitude, specialtyName, radiusKm = 15, maxResults = 4) {
    try {
      const response = await api.post('/bookings/doctors/nearby', {
        latitude,
        longitude,
        specialty_name: specialtyName,
        radius_km: radiusKm,
        max_results: maxResults
      });
      return response.data;
    } catch (error) {
      console.error('Search nearby doctors error:', error);
      throw error;
    }
  },

  /**
   * Browse doctors from database with filters
   */
  async browseDoctors(filters = {}) {
    try {
      const payload = {
        specialty_name: filters.specialtyName || null,
        latitude: filters.latitude || null,
        longitude: filters.longitude || null,
        max_distance_km: filters.maxDistanceKm || 15,
        min_rating: filters.minRating || null,
        instant_booking_only: filters.instantBookingOnly || false,
        sort_by: filters.sortBy || 'distance', // 'distance', 'rating', 'experience'
        page: filters.page || 1,
        page_size: filters.pageSize || 20
      };

      const response = await api.post('/bookings/doctors/browse', payload);
      return response.data;
    } catch (error) {
      console.error('Browse doctors error:', error);
      throw error;
    }
  },

  /**
   * Get doctor profile by Google Place ID (lazy sync to database)
   */
  async getDoctorProfile(googlePlaceId) {
    try {
      const response = await api.get(`/bookings/doctors/${googlePlaceId}`, {
        params: { google_place_id: googlePlaceId }
      });
      return response.data;
    } catch (error) {
      console.error('Get doctor profile error:', error);
      throw error;
    }
  },

  /**
   * Free-text doctor search
   */
  async searchDoctors(query, latitude, longitude, maxDistanceKm = 15, limit = 10) {
    try {
      const response = await api.post('/bookings/doctors/search', {
        query,
        latitude,
        longitude,
        max_distance_km: maxDistanceKm,
        limit
      });
      return response.data;
    } catch (error) {
      console.error('Search doctors error:', error);
      throw error;
    }
  },

  // ============================================
  // STEP 3: SLOTS
  // ============================================

  /**
   * Get slot availability for doctor (calendar view)
   */
  async getSlotAvailability(doctorId, startDate, endDate) {
    try {
      const response = await api.post('/bookings/slots/availability', {
        doctor_id: doctorId,
        start_date: startDate,
        end_date: endDate
      });
      return response.data;
    } catch (error) {
      console.error('Get slot availability error:', error);
      throw error;
    }
  },

  /**
   * Get next available slot for doctor
   */
  async getNextAvailableSlot(doctorId) {
    try {
      const response = await api.get(`/bookings/slots/next-available/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error('Get next available slot error:', error);
      throw error;
    }
  },

  /**
   * Reserve slot (10-minute hold)
   */
  async reserveSlot(slotId, userId) {
    try {
      const response = await api.post('/bookings/slots/reserve', {
        slot_id: slotId,
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('Reserve slot error:', error);
      throw error;
    }
  },

  /**
   * Release reserved slot
   */
  async releaseSlot(slotId) {
    try {
      const response = await api.post(`/bookings/slots/release/${slotId}`);
      return response.data;
    } catch (error) {
      console.error('Release slot error:', error);
      throw error;
    }
  },

  // ============================================
  // STEP 4: BOOKING
  // ============================================

  /**
   * Get booking preview (before final confirmation)
   */
  async getBookingPreview(slotId, doctorId) {
    try {
      const response = await api.post('/bookings/preview', {
        slot_id: slotId,
        doctor_id: doctorId
      });
      return response.data;
    } catch (error) {
      console.error('Get booking preview error:', error);
      throw error;
    }
  },

  /**
   * Validate booking before submission
   */
  async validateBooking(slotId, doctorId, userId) {
    try {
      const response = await api.post('/bookings/validate', {
        slot_id: slotId,
        doctor_id: doctorId,
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('Validate booking error:', error);
      throw error;
    }
  },

  /**
   * Create manual booking (final step)
   */
  async createBooking(bookingData) {
    try {
      const payload = {
        slot_id: bookingData.slotId,
        doctor_id: bookingData.doctorId,
        patient_name: bookingData.patientName,
        patient_phone: bookingData.patientPhone,
        patient_age: bookingData.patientAge,
        patient_gender: bookingData.patientGender,
        reason: bookingData.reason,
        symptoms: bookingData.symptoms || [],
        special_instructions: bookingData.specialInstructions || null,
        consultation_type: bookingData.consultationType || 'in-person'
      };

      const response = await api.post('/bookings/book', payload);
      return response.data;
    } catch (error) {
      console.error('Create booking error:', error);
      throw error;
    }
  },

  /**
   * Get booking details by appointment ID
   */
  async getBookingDetails(appointmentId) {
    try {
      const response = await api.get(`/bookings/${appointmentId}/details`);
      return response.data;
    } catch (error) {
      console.error('Get booking details error:', error);
      throw error;
    }
  },

  // ============================================
  // DASHBOARD: VIEW APPOINTMENTS
  // ============================================

  /**
   * Get upcoming appointments
   */
  async getUpcomingAppointments(limit = 10) {
    try {
      const response = await api.get('/bookings/dashboard/upcoming', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Get upcoming appointments error:', error);
      throw error;
    }
  },

  /**
   * Get past appointments
   */
  async getPastAppointments(limit = 10) {
    try {
      const response = await api.get('/bookings/dashboard/past', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Get past appointments error:', error);
      throw error;
    }
  },

  /**
   * Get all appointments with filters
   */
  async getAllAppointments(filters = {}) {
    try {
      const response = await api.get('/bookings/dashboard/all', {
        params: {
          status: filters.status || null,
          booking_type: filters.bookingType || null,
          limit: filters.limit || 50
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get all appointments error:', error);
      throw error;
    }
  },

  /**
   * Get appointment statistics
   */
  async getAppointmentStats() {
    try {
      const response = await api.get('/bookings/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Get appointment stats error:', error);
      throw error;
    }
  }
};

export default bookingAPI;
