/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/VoiceConsult/NewVoiceConsult.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { voiceAPI }                    from '../../../api/patient/voice_consult.api';
import { useVoiceSession, SESSION_STATE } from '../../../hooks/useVoiceSession';

import SpecialistSelector  from './Voice/SpecialistSelector';
import VoiceSessionPanel   from './Voice/VoiceSessionPanel';
import VoiceSessionSummary from './Voice/VoiceSessionSummary';
import { Mic } from 'lucide-react';

export default function NewVoiceConsult() {
  const navigate = useNavigate();
  const location = useLocation();


  const [specialists,        setSpecialists]        = useState([]);
  const [specialistsLoading, setSpecialistsLoading] = useState(true);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [pendingSpecialist,  setPendingSpecialist]  = useState(null);
  const [showConfirm,        setShowConfirm]        = useState(false);

  // ── Conflict modal ────────────────────────────────────────────────────────
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictToken,     setConflictToken]     = useState(null);
  const [closingSession,    setClosingSession]    = useState(false);

  // ✅ FIX 1: Guard — ensures auto-start fires EXACTLY once per navigation
  // Without this, when WS closes → isIdle becomes true again → useEffect
  // re-fires with same isResumed=true from location.state → triple WS open
  const resumeStartedRef = useRef(false);

  const {
    sessionState, sessionData, sessionSummary, transcript,
    error, intent, isEmergency, isMuted, micPermission, turnCount,
    isIdle, isCompleted, isLoading,
    startSession, startMic, stopMic, toggleMute,
    sendTextMessage, endSession, resetSession,

    isResumed,
    resumedMessages,
    resumeSummary,
    resumeSpecialist,
  } = useVoiceSession();

  // ── Fetch specialists ─────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const data = await voiceAPI.getSpecialists();
        setSpecialists(data);
      } catch (e) {
        console.error('Failed to load specialists:', e);
      } finally {
        setSpecialistsLoading(false);
      }
    })();
  }, []);

  // ── AUTO-START for resume flow ────────────────────────────────────────────
  // ✅ FIX 1: resumeStartedRef.current prevents re-firing when:
  //   - isIdle flips back to true after WS closes (was causing triple open)
  //   - startSession identity changes (useCallback re-creates on dep change)
  //   - React StrictMode double-invokes effects in dev
  useEffect(() => {
    if (
      !isResumed                    ||   // not a resume navigation
      !isIdle                       ||   // session already in progress
      specialistsLoading            ||   // wait for specialists list
      resumeStartedRef.current           // ✅ already started once — STOP
    ) return;

    // ✅ Lock BEFORE the async call — prevents race condition if effect
    // fires twice within the same tick (React StrictMode)
    resumeStartedRef.current = true;

    const specialist =
      specialists.find(s => s.specialist_type === resumeSpecialist) || {
        specialist_type: resumeSpecialist || 'general_physician',
        display_name:    resumeSummary?.specialist_name || 'AI Specialist',
        icon_slug:       'stethoscope',
        focus_areas:     [],
        voice:           'alloy',
      };

    setSelectedSpecialist(specialist);
    startSession(specialist.specialist_type, 'en');

    console.log(`📂 Auto-starting resumed session | Specialist: ${specialist.specialist_type}`);

  // ✅ FIX: startSession and resumeSummary intentionally excluded from deps.
  // startSession is a useCallback — its identity changes when hook state changes,
  // which would re-trigger this effect. The ref guard handles the one-shot logic.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResumed, isIdle, specialistsLoading, specialists, resumeSpecialist]);

  // ── Watch for 409 conflict ────────────────────────────────────────────────
  useEffect(() => {
    if (!error?.startsWith('active_session_exists:')) return;
    const colonIdx = error.indexOf(':');
    const token    = error.slice(colonIdx + 1) || null;
    setConflictToken(token);
    setShowConflictModal(true);
    resetSession();
  }, [error, resetSession]);

  // ── Specialist select → confirm modal ─────────────────────────────────────
  const handleSpecialistSelect = (specialist) => {
    setPendingSpecialist(specialist);
    setShowConfirm(true);
  };

  // ── Confirm → start session ───────────────────────────────────────────────
  const handleConfirmStart = async () => {
    setShowConfirm(false);
    setSelectedSpecialist(pendingSpecialist);
    await startSession(pendingSpecialist.specialist_type, 'en');
  };

  // ── Close old conflicting session ─────────────────────────────────────────
  const handleCloseOldSession = async () => {
    if (!conflictToken) {
      setShowConflictModal(false);
      setConflictToken(null);
      resetSession();
      setSelectedSpecialist(null);
      setPendingSpecialist(null);
      return;
    }
    setClosingSession(true);
    try {
      await voiceAPI.endSession(conflictToken);
    } catch (e) {
      console.warn('endSession response:', e?.response?.status, e?.message);
    } finally {
      setClosingSession(false);
      setShowConflictModal(false);
      setConflictToken(null);
      resetSession();
      setSelectedSpecialist(null);
      setPendingSpecialist(null);
    }
  };

  // ── New consult reset ─────────────────────────────────────────────────────
  const handleNewConsult = () => {
    resumeStartedRef.current = false;
    resetSession();
    setSelectedSpecialist(null);
    setPendingSpecialist(null);
    // ✅ FIX: Clear location.state so isResumed/resumeToken/resumeWebsocketUrl
    // become null on next render. Without this:
    //   resetSession() → IDLE + isResumed=true + resumeStartedRef=false
    //   → resume useEffect fires → startSession() uses OLD completed session token
    //   → new WS connects to completed session → 4008 error
    navigate(location.pathname, { replace: true, state: {} });
  };

  // ── View logic ────────────────────────────────────────────────────────────
  const showSelector     = isIdle && !isCompleted && !isResumed;
  const showSession      = !isIdle && !isCompleted;
  const showSummary      = isCompleted;
  const showResumeLoader = isResumed && isIdle && !isCompleted && specialistsLoading;

  return (
    <div className="min-h-screen bg-[#f8fafb]">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center
                          justify-center text-xl">
            🎙️
          </div> */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {showSession   ? (isResumed ? 'Resumed Consultation' : 'Active Consultation')
               : showSummary ? 'Consultation Complete'
               : 'Voice Consultation'}
            </h1>
          </div>
        </div>

        {showSession && (
          <div className="flex items-center gap-1.5 bg-white border border-gray-200
                          rounded-xl px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-gray-700">Live</span>
          </div>
        )}
      </div>

      {/* ── Error banner — non-conflict only ─────────────────────────────── */}
      {error && !error.startsWith('active_session_exists:') && (
        <div className="mx-6 mb-4 flex items-center gap-2 bg-red-50 border
                        border-red-200 rounded-xl px-4 py-3">
          <span className="text-red-500 shrink-0">⚠️</span>
          <p className="text-sm text-red-700 flex-1">{error}</p>
          <button
            onClick={resetSession}
            className="text-xs text-red-500 font-medium hover:underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Starting loader ───────────────────────────────────────────────── */}
      {isLoading && sessionState === SESSION_STATE.STARTING && (
        <div className="mx-6 mb-4 flex items-center gap-3 bg-emerald-50
                        border border-emerald-200 rounded-xl px-4 py-3">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent
                          rounded-full animate-spin shrink-0" />
          <p className="text-sm text-emerald-700 font-medium">
            {isResumed
              ? `Reconnecting to ${selectedSpecialist?.display_name || 'your specialist'}...`
              : `Starting session with ${pendingSpecialist?.display_name}...`}
          </p>
        </div>
      )}

      {/* ── Resume loader (waiting for specialists to load) ───────────────── */}
      {showResumeLoader && (
        <div className="mx-6 mb-4 flex items-center gap-3 bg-teal-50
                        border border-teal-200 rounded-xl px-4 py-3">
          <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent
                          rounded-full animate-spin shrink-0" />
          <p className="text-sm text-teal-700 font-medium">
            Loading previous consultation...
          </p>
        </div>
      )}

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="px-6 pb-6">

        {showSelector && (
          <SpecialistSelector
            specialists={specialists}
            loading={specialistsLoading}
            onSelect={handleSpecialistSelect}
          />
        )}

        {showSession && (
          <div className="h-[calc(100vh-160px)]">
            <VoiceSessionPanel
              sessionState={sessionState}
              sessionData={sessionData}
              transcript={transcript}
              intent={intent}
              isEmergency={isEmergency}
              isMuted={isMuted}
              micPermission={micPermission}
              turnCount={turnCount}
              selectedSpecialist={selectedSpecialist}
              onStartMic={startMic}
              onStopMic={stopMic}
              onToggleMute={toggleMute}
              onEndSession={endSession}
              onSendText={sendTextMessage}
              isResumed={isResumed}
              resumedMessages={resumedMessages}
              resumeSummary={resumeSummary}
            />
          </div>
        )}

        {showSummary && (
          <VoiceSessionSummary
            summary={sessionSummary}
            transcript={transcript}
            selectedSpecialist={selectedSpecialist}
            onNewConsult={handleNewConsult}
            onViewHistory={() => navigate('/consult-history')}
          />
        )}
      </div>

      {/* ── Confirm Start Modal ───────────────────────────────────────────── */}
      {showConfirm && pendingSpecialist && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50
                        flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center
                                justify-center text-2xl">
                  🎙️
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Start Voice Consultation</h3>
                  <p className="text-sm text-gray-500">
                    with {pendingSpecialist.display_name}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
              <Mic className="w-4 h-4 text-green-500 shrink-0" />
              Microphone will be used for voice input
            </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">
                  Covers
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {pendingSpecialist.focus_areas?.map(area => (
                    <span key={area}
                          className="text-xs bg-white border border-gray-200
                                     text-gray-600 px-2 py-0.5 rounded-lg">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700
                           rounded-xl text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStart}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white
                           rounded-xl text-sm font-semibold transition-colors"
              >
                Start Talking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Conflict Modal (409) ──────────────────────────────────────────── */}
      {showConflictModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50
                        flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              {/* <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center
                              justify-center text-xl shrink-0">
                ⚠️
              </div> */}
              <div>
                <h3 className="font-bold text-gray-900">Active Session Found</h3>
                <p className="text-sm text-gray-500">You have an ongoing consultation</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              You already have an active voice session. Close it first before
              starting a new consultation.
            </p>
            {!conflictToken && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                <p className="text-xs text-red-600 font-mono">
                  Token not found in 409 response.
                </p>
              </div>
            )}
            <button
              onClick={handleCloseOldSession}
              disabled={closingSession}
              className="w-full py-3 bg-red-500 hover:bg-red-600
                         disabled:bg-red-300 text-white rounded-xl
                         text-sm font-semibold transition-colors
                         flex items-center justify-center gap-2"
            >
              {closingSession ? (
                <>
                  <div className="w-4 h-4 border-2 border-white
                                  border-t-transparent rounded-full animate-spin" />
                  Closing session...
                </>
              ) : '✕  Close Active Session'}
            </button>
            <button
              onClick={() => { setShowConflictModal(false); setConflictToken(null); }}
              disabled={closingSession}
              className="w-full py-2 text-gray-500 hover:text-gray-700
                         text-sm font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getSessionTime(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  });
}
