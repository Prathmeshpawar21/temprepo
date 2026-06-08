/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/hooks/useMedications.js

import { useState, useEffect, useCallback } from 'react';
import medicationsAPI, { transformMedicationFromBackend } from '../../../../api/patient/medications.api';
import { toast } from 'react-hot-toast';
/**
 * ✅ Custom Hook for Patient Medications
 * Manages all medication CRUD operations and state
 */
const useMedications = () => {
  // State
  const [medications, setMedications] = useState([]);
  const [todaySchedule,  setTodaySchedule] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    discontinued: 0,
    dueToday: 0,
    adherenceRate: 0,
    todays_doses_total:          0,
    todays_doses_taken:          0,
    todays_adherence_percentage: 0,
    weekly_adherence_percentage: 0,
    recently_added:              0,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false
  });

 
  // ── Fetch list ──────────────────────────────────────────────────────────────
  const fetchMedications = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await medicationsAPI.list({
        page:       filters.page       || 1,
        page_size:  filters.page_size  || 20,
        status:     filters.status,
        query:      filters.query,
        sort_by:    filters.sort_by    || 'created_at',
        sort_order: filters.sort_order || 'desc',
      });
      const transformed = response.data.medications.map(transformMedicationFromBackend);
      setMedications(transformed);
      setPagination({
        page:        response.data.page,
        page_size:   response.data.page_size,
        total:       response.data.total,
        total_pages: response.data.total_pages,
        has_next:    response.data.has_next,
        has_prev:    response.data.has_prev,
      });
      return transformed;
    } catch (err) {
      console.error('❌ fetchMedications:', err);
      setError(err.response?.data?.detail || 'Failed to fetch medications');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch stats (now includes adherence) ────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const response = await medicationsAPI.getStats();
      const d = response.data;
      setStats({
        total:                       d.total_medications,
        active:                      d.active_medications,
        completed:                   0,
        discontinued:                d.stopped_medications,
        dueToday:                    d.todays_doses_total          || 0,
        adherenceRate:               d.todays_adherence_percentage || 0,
        // ── new ──────────────────────────────────────────────────
        todays_doses_total:          d.todays_doses_total          || 0,
        todays_doses_taken:          d.todays_doses_taken          || 0,
        todays_adherence_percentage: d.todays_adherence_percentage || 0,
        weekly_adherence_percentage: d.weekly_adherence_percentage || 0,
        recently_added:              d.recently_added              || 0,
      });
      return d;
    } catch (err) {
      console.error('❌ fetchStats:', err);
    }
  }, []);


  // ── Fetch today's schedule ──────────────────────────────────────────────────
  const fetchTodaySchedule = useCallback(async () => {
    try {
      const response = await medicationsAPI.getTodaySchedule();
      setTodaySchedule(response.data);
      return response.data;
    } catch (err) {
      console.error('❌ fetchTodaySchedule:', err);
    }
  }, []);



   // ── CRUD (unchanged) ────────────────────────────────────────────────────────
  const getMedication = useCallback(async (medicationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await medicationsAPI.getById(medicationId);
      return transformMedicationFromBackend(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get medication');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMedicationWithSources = useCallback(async (medicationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await medicationsAPI.getWithSources(medicationId);
      return {
        medication: transformMedicationFromBackend(response.data.medication),
        sources:    response.data.sources,
      };
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get medication details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);




  const createMedication = useCallback(async (medicationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await medicationsAPI.create(medicationData);
      const newMed   = transformMedicationFromBackend(response.data);
      setMedications(prev => [newMed, ...prev]);
      await fetchStats();
      return newMed;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create medication');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  const updateMedication = useCallback(async (medicationId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await medicationsAPI.update(medicationId, updateData);
      const updated  = transformMedicationFromBackend(response.data);
      setMedications(prev => prev.map(m => m.id === medicationId ? updated : m));
      return updated;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update medication');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
 


    const stopMedication = useCallback(async (medicationId, reason) => {
    setLoading(true);
    setError(null);
    try {
      const response = await medicationsAPI.stop(medicationId, reason);
      const stopped  = transformMedicationFromBackend(response.data);
      setMedications(prev => prev.map(m => m.id === medicationId ? stopped : m));
      await fetchStats();
      return stopped;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to stop medication');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  
  const deleteMedication = useCallback(async (medicationId, permanent = false) => {
    setLoading(true);
    setError(null);
    try {
      await medicationsAPI.delete(medicationId, permanent);
      setMedications(prev => prev.filter(m => m.id !== medicationId));
      await fetchStats();
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete medication');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  const extractFromPrescription = useCallback(async (documentId, forceReextract = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await medicationsAPI.extractFromPrescription(documentId, forceReextract);
      if (response.data.medications_extracted_count > 0) {
        await Promise.all([fetchMedications(), fetchStats()]);
      }
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to extract medications');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMedications, fetchStats]);

  const getExtractionStatus = useCallback(async (documentId) => {
    try {
      const response = await medicationsAPI.getExtractionStatus(documentId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get extraction status');
      throw err;
    }
  }, []);


  // ── ✅ Mark as TAKEN — real API ─────────────────────────────────────────────
  const markAdherence = useCallback(async (medicationId, data = {}) => {
    const doseNumber = data.dose_number || 1;

    // Optimistic update — show lastTakenAt immediately
    const now = new Date().toISOString();
    setMedications(prev =>
      prev.map(m => m.id === medicationId
        ? { ...m, lastTakenAt: now }
        : m
      )
    );

    try {
      const response = await medicationsAPI.markDoseTaken(medicationId, {
        dose_number: doseNumber,
        taken_at:    data.timestamp || null,
        notes:       data.notes     || null,
      });

      // Confirm update from server response
      const takenAt = response.data.taken_at;
      setMedications(prev =>
        prev.map(m => m.id === medicationId
          ? { ...m, lastTakenAt: takenAt, takenToday: true }
          : m
        )
      );

      // Refresh today's schedule + stats silently
      fetchTodaySchedule();
      fetchStats();

      toast.success('💊 Dose marked as taken!');
      return response.data;
    } catch (err) {
      // Rollback optimistic update on failure
      setMedications(prev =>
        prev.map(m => m.id === medicationId
          ? { ...m, lastTakenAt: m.lastTakenAt }
          : m
        )
      );
      const msg = err.response?.data?.detail || 'Failed to mark dose as taken';
      toast.error(msg);
      throw new Error(msg);
    }
  }, [fetchStats, fetchTodaySchedule]);

  // ── ✅ Mark as SKIPPED — new ────────────────────────────────────────────────
  const markDoseSkipped = useCallback(async (medicationId, data = {}) => {
    try {
      const response = await medicationsAPI.markDoseSkipped(medicationId, {
        dose_number: data.dose_number || 1,
        notes:       data.notes      || null,
      });
      fetchTodaySchedule();
      fetchStats();
      toast.success('Dose marked as skipped');
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to mark dose as skipped';
      toast.error(msg);
      throw new Error(msg);
    }
  }, [fetchStats, fetchTodaySchedule]);

  // ── ✅ Get dose history for a medication ────────────────────────────────────
  const getDoseHistory = useCallback(async (medicationId, days = 7) => {
    try {
      const response = await medicationsAPI.getDoseHistory(medicationId, days);
      return response.data;
    } catch (err) {
      console.error('❌ getDoseHistory:', err);
      throw err;
    }
  }, []);



  // ── Refresh ─────────────────────────────────────────────────────────────────
  const refresh = useCallback(async () => {
    await Promise.all([fetchMedications(), fetchStats(), fetchTodaySchedule()]);
  }, [fetchMedications, fetchStats, fetchTodaySchedule]);

  const clearError = useCallback(() => setError(null), []);

  // Initial load
  useEffect(() => { refresh(); }, []);



  return {
    // State
    medications,
    todaySchedule,
    stats,
    loading,
    error,
    pagination,
    
    // Actions
    fetchMedications,
    fetchStats,
    getMedication,
    getMedicationWithSources,
    createMedication,
    updateMedication,
    stopMedication,
    deleteMedication,
    extractFromPrescription,
    getExtractionStatus,
    markAdherence,       // ✅ now real API
    markDoseSkipped,     // ✅ new
    getDoseHistory,      // ✅ new
    refresh,
    clearError
  };
};

export default useMedications;
