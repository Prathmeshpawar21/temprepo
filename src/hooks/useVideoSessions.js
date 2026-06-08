/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/hooks/useVideoSessions.js

import { useState, useEffect, useRef } from 'react';
import videoCallAPI from '../api/videoCall.api';

/**
 * ✅ Custom hook to fetch video sessions for multiple appointments
 * Uses batch endpoint to prevent connection pool exhaustion
 * 
 * @param {Array} appointments - List of appointments
 * @param {boolean} autoRefresh - Enable auto-refresh
 * @param {number} refreshInterval - Refresh interval in milliseconds
 */
export const useVideoSessions = (appointments, autoRefresh = false, refreshInterval = 30000) => {
  const [videoSessions, setVideoSessions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const isMountedRef = useRef(true);
  const refreshIntervalRef = useRef(null);

  // Fetch video sessions in batch
  const fetchVideoSessions = async (silent = false) => {
    if (!appointments || appointments.length === 0) {
      setVideoSessions({});
      return;
    }

    // Only fetch for CONFIRMED appointments
    const confirmedAppointments = appointments.filter(apt => apt.status === 'CONFIRMED');
    
    if (confirmedAppointments.length === 0) {
      setVideoSessions({});
      return;
    }

    if (!silent) {
      setLoading(true);
    }
    setError(null);

    try {
      // Extract appointment IDs
      const appointmentIds = confirmedAppointments.map(apt => apt.id);
      
      console.log(`🎥 Fetching video sessions for ${appointmentIds.length} confirmed appointments`);
      
      // ✅ SINGLE BATCH REQUEST - replaces N individual requests
      const sessions = await videoCallAPI.getBatchVideoSessions(appointmentIds);
      
      if (isMountedRef.current) {
        setVideoSessions(sessions);
        console.log('✅ Video sessions loaded:', Object.keys(sessions).length);
      }
      
    } catch (err) {
      console.error('Error fetching video sessions:', err);
      if (isMountedRef.current) {
        setError(err.message);
        setVideoSessions({});
      }
    } finally {
      if (!silent && isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // Initial fetch when appointments change
  useEffect(() => {
    fetchVideoSessions();
  }, [appointments]);

  // Setup auto-refresh interval
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0 && appointments.length > 0) {
      console.log(`🔄 Video sessions auto-refresh enabled: every ${refreshInterval/1000}s`);
      
      refreshIntervalRef.current = setInterval(() => {
        console.log('🔄 Auto-refreshing video sessions...');
        fetchVideoSessions(true); // Silent refresh
      }, refreshInterval);
      
      return () => {
        if (refreshIntervalRef.current) {
          console.log('🛑 Stopping video sessions auto-refresh');
          clearInterval(refreshIntervalRef.current);
          refreshIntervalRef.current = null;
        }
      };
    }
  }, [autoRefresh, refreshInterval, appointments]);

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
    videoSessions, 
    loading, 
    error,
    refresh: () => fetchVideoSessions(false)
  };
};

export default useVideoSessions;
