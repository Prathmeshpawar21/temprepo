/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/hooks/useConsultations.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import consultationHistoryAPI from '../api/consultation_history.api';
import { voiceAPI } from '../api/patient/voice_consult.api';   // ✅ FIXED — named export, correct path

const useConsultations = (autoFetch = true) => {
  const navigate = useNavigate();

  const [consultations, setConsultations] = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);
  const [pagination,    setPagination]    = useState({
    page: 1, page_size: 20, total: 0, total_pages: 1,
  });

  const [stats, setStats] = useState({
    total_consultations:   0,
    by_status:             {},
    by_severity:           {},
    by_specialty:          {},
    avg_duration_minutes:  null,
    total_messages:        0,
    completed_today:       0,
    completed_this_week:   0,
    completed_this_month:  0,
  });

  const [resuming,     setResuming]     = useState(false);
  const [resumeError,  setResumeError]  = useState(null);

  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [detailLoading,        setDetailLoading]        = useState(false);

  const fetchedRef = useRef(false);

  // ── Fetch list ──────────────────────────────────────────────────────────────
  const fetchConsultations = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationHistoryAPI.getMyConsultations(filters);
      setConsultations(response.consultations || []);
      setPagination({
        page:        response.page        || 1,
        page_size:   response.page_size   || 20,
        total:       response.total       || 0,
        total_pages: response.total_pages || 1,
      });
      return response;
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || 'Failed to load consultations';
      setError(msg);
      console.error('❌ fetchConsultations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch stats ─────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const response = await consultationHistoryAPI.getConsultationStats();
      setStats(response);
      return response;
    } catch (err) {
      console.error('❌ fetchStats:', err);
    }
  }, []);

  // ── Auto-fetch ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (autoFetch && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchConsultations();
      fetchStats();
    }
  }, [autoFetch, fetchConsultations, fetchStats]);

  // ── Detail drawer ───────────────────────────────────────────────────────────
  const openDetail = useCallback(async (consultationId) => {
    setDetailLoading(true);
    setSelectedConsultation(null);
    try {
      const data = await consultationHistoryAPI.getConsultationById(consultationId);
      setSelectedConsultation(data);
      return data;
    } catch (err) {
      console.error('❌ openDetail:', err);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeDetail = useCallback(() => setSelectedConsultation(null), []);

  // ── ✅ RESUME FLOW ──────────────────────────────────────────────────────────
  const resumeConsultation = useCallback(async (consultationId) => {
    setResuming(true);
    setResumeError(null);

    try {
      // Step 1 — get prior transcript + specialist context from backend
      const resumeData = await consultationHistoryAPI.resumeConsultation(consultationId);

      if (!resumeData.success) {
        throw new Error('Failed to load consultation for resume');
      }

      // Step 2 — start a fresh voice session with resume_context injected
      // into OpenAI system prompt so AI knows prior conversation
      const sessionResponse = await voiceAPI.startSession({   // ✅ FIXED
        specialist_type:              resumeData.specialist_type,
        language:                     'en',
        resume_context:               resumeData.resume_context,
        resumed_from_consultation_id: consultationId,
      });

      console.log(
        `📂 Resuming | Specialist: ${resumeData.specialist_type} | ` +
        `Prior msgs: ${resumeData.messages?.length} | ` +
        `Token: ${sessionResponse.session_token?.slice(0, 20)}`
      );

      // Step 3 — navigate to voice consult, passing everything in location.state
      // useVoiceSession reads this on mount and skips the startSession call
      navigate('/new-consult', {
        state: {
          // Pre-started session — useVoiceSession skips POST /session/start
          sessionToken:   sessionResponse.session_token,
          websocketUrl:   sessionResponse.websocket_url,
          specialistType: resumeData.specialist_type,
          specialistName: resumeData.summary?.specialist_name,

          // Resume identity
          isResumed:  true,
          resumedFrom: consultationId,

          // Pre-populate transcript feed with prior messages
          resumedMessages: resumeData.messages || [],

          // Banner data shown at top of VoiceSessionPanel
          resumeSummary: {
            date:            resumeData.summary?.date,
            chief_complaint: resumeData.summary?.chief_complaint,
            summary:         resumeData.summary?.summary,
            severity:        resumeData.summary?.severity,
            message_count:   resumeData.summary?.message_count,
            specialist_name: resumeData.summary?.specialist_name,
          },
        },
      });

      return { resumeData, sessionResponse };

    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err.message ||
        'Failed to resume consultation. Please try again.';
      setResumeError(msg);
      console.error('❌ resumeConsultation:', err);
      throw err;
    } finally {
      setResuming(false);
    }
  }, [navigate]);

  // ── Search ──────────────────────────────────────────────────────────────────
  const searchConsultations = useCallback(async (query) => {
    if (!query || query.length < 2) return [];
    try {
      const response = await consultationHistoryAPI.searchConsultations(query);
      return response.consultations || [];
    } catch (err) {
      console.error('❌ searchConsultations:', err);
      return [];
    }
  }, []);


  // ── ✅ DELETE ───────────────────────────────────────────────────────────────
  const deleteConsultation = useCallback(async (consultationId) => {
    try {
      await consultationHistoryAPI.deleteConsultation(consultationId);
      // Optimistically remove from local state — no need to re-fetch
      setConsultations((prev) => prev.filter((c) => c.id !== consultationId));
      setStats((prev) => ({
        ...prev,
        total_consultations: Math.max(0, (prev.total_consultations || 1) - 1),
      }));
      return true;
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || 'Failed to delete consultation';
      console.error('❌ deleteConsultation:', err);
      throw new Error(msg);
    }
  }, []);



  const refresh = useCallback(() => {
    fetchConsultations();
    fetchStats();
  }, [fetchConsultations, fetchStats]);

  return {
    consultations, loading, error, pagination,
    fetchConsultations, refresh,
    stats, fetchStats,
    selectedConsultation, detailLoading, openDetail, closeDetail,
    resumeConsultation, resuming, resumeError,
    deleteConsultation,
    searchConsultations,
  };
};

export default useConsultations;
