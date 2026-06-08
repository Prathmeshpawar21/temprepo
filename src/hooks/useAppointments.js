/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/hooks/useAppointments.js

import { useState, useEffect, useCallback, useRef } from 'react';
import appointmentsAPI from '../api/appointments.api';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for managing appointments with auto-refresh support
 * @param {boolean} autoFetch - Automatically fetch appointments on mount
 * @param {boolean} autoRefresh - Enable automatic refresh (for video call updates)
 * @param {number} refreshInterval - Refresh interval in milliseconds (default: 30000 = 30s)
 */
export const useAppointments = (
  autoFetch = true, 
  autoRefresh = false, 
  refreshInterval = 30000
) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    rejected: 0
  });

  // Use ref to track if component is mounted (prevent memory leaks)
  const isMountedRef = useRef(true);
  const refreshIntervalRef = useRef(null);

  // Calculate stats from appointments
  const calculateStats = useCallback((appointmentsList) => {
    return {
      total: appointmentsList.length,
      pending: appointmentsList.filter(a => a.status === 'PENDING').length,
      confirmed: appointmentsList.filter(a => a.status === 'CONFIRMED').length,
      completed: appointmentsList.filter(a => a.status === 'COMPLETED').length,
      cancelled: appointmentsList.filter(a => a.status === 'CANCELLED').length,
      rejected: appointmentsList.filter(a => a.status === 'REJECTED').length,
    };
  }, []);

  // Fetch appointments
  const fetchAppointments = useCallback(async (filters = {}, silent = false) => {
    // Don't show loading spinner for silent refreshes
    if (!silent) {
      setLoading(true);
    }
    setError(null);
    
    try {
      const response = await appointmentsAPI.getMyAppointments(filters);
      
      if (response.appointments && isMountedRef.current) {
        setAppointments(response.appointments);
        
        // Calculate and update stats
        const newStats = calculateStats(response.appointments);
        setStats(newStats);
        
        // Only show success toast for manual refreshes
        if (!silent && !autoFetch) {
          toast.success('Appointments refreshed');
        }
      }
      
      return response;
    } catch (err) {
      console.error('Error fetching appointments:', err);
      
      if (isMountedRef.current) {
        setError(err.message || 'Failed to fetch appointments');
        
        // Only show error toast for non-silent requests
        if (!silent) {
          toast.error('Failed to load appointments');
        }
      }
      
      throw err;
    } finally {
      if (!silent && isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [autoFetch, calculateStats]);

  // Cancel appointment
  const cancelAppointment = useCallback(async (appointmentId, reason) => {
    try {
      const response = await appointmentsAPI.cancelAppointment(appointmentId, reason);
      
      if (response.success && isMountedRef.current) {
        toast.success('Appointment cancelled successfully');
        
        // Update local state immediately
        setAppointments(prev => {
          const updated = prev.map(apt => 
            apt.id === appointmentId 
              ? { ...apt, status: 'CANCELLED' }
              : apt
          );
          
          // Recalculate stats
          setStats(calculateStats(updated));
          
          return updated;
        });
        
        // Refresh appointments from server
        await fetchAppointments({}, true); // Silent refresh
      }
      
      return response;
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      toast.error('Failed to cancel appointment');
      throw err;
    }
  }, [fetchAppointments, calculateStats]);

  // Get appointment by ID
  const getAppointment = useCallback(async (appointmentId) => {
    try {
      const response = await appointmentsAPI.getAppointmentById(appointmentId);
      return response;
    } catch (err) {
      console.error('Error getting appointment:', err);
      toast.error('Failed to load appointment details');
      throw err;
    }
  }, []);

  // Manual refresh function (shows loading state)
  const refresh = useCallback(() => {
    return fetchAppointments({}, false);
  }, [fetchAppointments]);

  // Setup auto-refresh interval
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      console.log(`🔄 Auto-refresh enabled: every ${refreshInterval/1000}s`);
      
      refreshIntervalRef.current = setInterval(() => {
        console.log('🔄 Auto-refreshing appointments...');
        fetchAppointments({}, true); // Silent refresh
      }, refreshInterval);
      
      return () => {
        if (refreshIntervalRef.current) {
          console.log('🛑 Stopping auto-refresh');
          clearInterval(refreshIntervalRef.current);
          refreshIntervalRef.current = null;
        }
      };
    }
  }, [autoRefresh, refreshInterval, fetchAppointments]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchAppointments();
    }
  }, [autoFetch, fetchAppointments]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  return {
    appointments,
    loading,
    error,
    stats,
    fetchAppointments,
    cancelAppointment,
    getAppointment,
    refresh
  };
};

export default useAppointments;
