/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/hooks/useVoiceSession.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { voiceAPI, VoiceWebSocketManager, MicRecorder, AIAudioPlayer } from '../api/patient/voice_consult.api';
import { useLocation } from 'react-router-dom';

export const SESSION_STATE = {
  IDLE:       'idle',
  STARTING:   'starting',
  CONNECTING: 'connecting',
  READY:      'ready',
  LISTENING:  'listening',
  THINKING:   'thinking',
  SPEAKING:   'speaking',
  ENDING:     'ending',
  COMPLETED:  'completed',
  ERROR:      'error',
};

export function useVoiceSession() {
  const [sessionState,   setSessionState]   = useState(SESSION_STATE.IDLE);
  const [sessionData,    setSessionData]    = useState(null);
  const [sessionSummary, setSessionSummary] = useState(null);
  const [transcript,     setTranscript]     = useState([]);
  const [error,          setError]          = useState(null);
  const [intent,         setIntent]         = useState(null);
  const [isEmergency,    setIsEmergency]    = useState(false);
  const [isMuted,        setIsMuted]        = useState(false);
  const [micPermission,  setMicPermission]  = useState('unknown');
  const [turnCount,      setTurnCount]      = useState(0);

  const wsManagerRef        = useRef(null);
  const recorderRef         = useRef(null);
  const playerRef           = useRef(null);
  const sessionRef          = useRef(null);
  const sessionStateRef     = useRef(SESSION_STATE.IDLE);
  const inactivityTimerRef  = useRef(null);
  const isMutedRef          = useRef(false);
  const endSessionRef       = useRef(null);
  const intentionalEndRef   = useRef(false);

  // ✅ NEW: streaming turn tracking refs
  const streamingAIRef      = useRef(false);  // true = AI placeholder bubble exists
  const streamingUserRef    = useRef(false);  // true = user placeholder bubble exists

  const INACTIVITY_TIMEOUT = 30 * 1000;

  useEffect(() => { sessionRef.current      = sessionData;  }, [sessionData]);
  useEffect(() => { sessionStateRef.current = sessionState; }, [sessionState]);
  useEffect(() => { isMutedRef.current      = isMuted;      }, [isMuted]);

  // REPLACE with:
  const location         = useLocation();
  const resumeState      = location.state || {};
  const resumeToken      = resumeState.sessionToken      || null;
  const isResumed        = resumeState.isResumed         || false;
  const resumedMessages  = resumeState.resumedMessages   || [];   // ✅ prior transcript
  const resumeSummary    = resumeState.resumeSummary     || null; // ✅ banner data
  const resumeSpecialist = resumeState.specialistType    || null;
  const resumeWebsocketUrl = resumeState.websocketUrl    || null;

  // ── Inactivity timer ──────────────────────────────────────────────────────
  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  const resetInactivityTimer = useCallback(() => {
    clearInactivityTimer();
    inactivityTimerRef.current = setTimeout(async () => {
      const state = sessionStateRef.current;
      if (state === SESSION_STATE.READY || state === SESSION_STATE.SPEAKING) {
        console.log('⏰ Auto-ending session due to 30s inactivity');
        await endSessionRef.current?.();
      }
    }, INACTIVITY_TIMEOUT);
  }, [clearInactivityTimer]);

  // ── Helper: replace last streaming turn of a given role ──────────────────
  const replaceStreamingTurn = useCallback((role, newTurnData) => {
    setTranscript(prev => {
      // find last streaming turn for this role
      let targetIdx = -1;
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i].role === role && prev[i].isStreaming) {
          targetIdx = i;
          break;
        }
      }
      if (targetIdx === -1) {
        // No placeholder found — just append
        return [...prev, newTurnData];
      }
      const updated = [...prev];
      updated[targetIdx] = newTurnData;
      return updated;
    });
  }, []);

  // ── WS event handler ──────────────────────────────────────────────────────
  const handleWsEvent = useCallback((event) => {
    const { event_type, data } = event;

    switch (event_type) {

      case 'session_ready':
        setSessionState(SESSION_STATE.READY);
        resetInactivityTimer();
        break;

      case 'ai_thinking':
        recorderRef.current?.stop();
        recorderRef.current = null;
        setSessionState(SESSION_STATE.THINKING);
        clearInactivityTimer();
        break;

      // ✅ FIX 2: Add user message placeholder IMMEDIATELY when speech committed
      case 'user_speech_committed':
        setSessionState(SESSION_STATE.THINKING);
        clearInactivityTimer();
        if (!streamingUserRef.current) {
          streamingUserRef.current = true;
          setTranscript(prev => [...prev, {
            role:        'user',
            text:        '',
            isStreaming: true,
            timestamp:   event.timestamp || new Date().toISOString(),
          }]);
        }
        break;

      // ✅ FIX 2: Replace user placeholder with real transcribed text
      case 'transcription_ready':
        streamingUserRef.current = false;
        replaceStreamingTurn('user', {
          role:      'user',
          text:      data.text,
          timestamp: event.timestamp || new Date().toISOString(),
        });
        resetInactivityTimer();
        break;

      // ✅ FIX 1: Stream AI text delta if backend forwards it
      case 'response.audio_transcript.delta':
        if (!streamingAIRef.current) {
          streamingAIRef.current = true;
          setTranscript(prev => [...prev, {
            role:        'assistant',
            text:        data.delta || '',
            isStreaming: true,
            timestamp:   event.timestamp || new Date().toISOString(),
          }]);
        } else {
          setTranscript(prev => {
            let targetIdx = -1;
            for (let i = prev.length - 1; i >= 0; i--) {
              if (prev[i].role === 'assistant' && prev[i].isStreaming) {
                targetIdx = i;
                break;
              }
            }
            if (targetIdx === -1) return prev;
            const updated = [...prev];
            updated[targetIdx] = {
              ...updated[targetIdx],
              text: updated[targetIdx].text + (data.delta || ''),
            };
            return updated;
          });
        }
        break;

      // ✅ FIX 1: Replace AI placeholder (or add) with complete text
      case 'assistant_turn_complete':
        streamingAIRef.current = false;
        replaceStreamingTurn('assistant', {
          role:      'assistant',
          text:      data.text,
          timestamp: event.timestamp || new Date().toISOString(),
          turn:      data.turn,
        });
        setTurnCount(data.turn);
        setSessionState(SESSION_STATE.SPEAKING);
        resetInactivityTimer();
        break;

      case 'intent_detected':
        setIntent({
          value:      data.intent,
          confidence: data.confidence,
          entities:   data.entities,
          flow:       data.flow,
          language:   data.language,
        });
        break;

      case 'emergency':
        setIsEmergency(true);
        clearInactivityTimer();
        break;

      case 'error':
        setError(data.message);
        if (!data.recoverable) setSessionState(SESSION_STATE.ERROR);
        break;

      default:
        break;
    }
  }, [resetInactivityTimer, clearInactivityTimer, replaceStreamingTurn]);

  // ── WS audio handler ──────────────────────────────────────────────────────
  // ✅ FIX 1: Add AI text placeholder bubble on FIRST audio chunk
  //    so text and voice appear at the same time
  const handleWsAudio = useCallback((arrayBuffer) => {
    setSessionState(SESSION_STATE.SPEAKING);

    if (!streamingAIRef.current) {
      streamingAIRef.current = true;
      setTranscript(prev => [...prev, {
        role:        'assistant',
        text:        '',           // empty → shows typing dots until assistant_turn_complete
        isStreaming: true,
        timestamp:   new Date().toISOString(),
      }]);
    }

    playerRef.current?.enqueue(arrayBuffer);
  }, []);

  // ── Start session ─────────────────────────────────────────────────────────

  
// FIND startSession, replace the whole function:
const startSession = useCallback(async (specialistType, language = 'en') => {
  try {
    setError(null);
    setTranscript([]);
    setIntent(null);
    setIsEmergency(false);
    setTurnCount(0);
    streamingAIRef.current   = false;
    streamingUserRef.current = false;
    setSessionState(SESSION_STATE.STARTING);

    // ✅ RESUME: session was pre-started by useConsultations.resumeConsultation
    // Skip POST /session/start — use the token from location.state directly
    let data;
    if (resumeToken && resumeWebsocketUrl) {
      data = {
        session_token:  resumeToken,
        websocket_url:  resumeWebsocketUrl,
        specialist_type: resumeSpecialist || specialistType,
      };
      console.log('📂 Resume: reusing pre-started session token');
    } else {
      data = await voiceAPI.startSession({ specialist_type: specialistType, language });
    }

    setSessionData(data);

    playerRef.current = new AIAudioPlayer({
      onPlaybackDone: () => {
        setSessionState(prev =>
          prev === SESSION_STATE.SPEAKING ? SESSION_STATE.READY : prev
        );
        resetInactivityTimer();
      },
    });

    setSessionState(SESSION_STATE.CONNECTING);

    const wsManager = new VoiceWebSocketManager({
      wsUrl:   data.websocket_url,
      onEvent: handleWsEvent,
      onAudio: handleWsAudio,
      onOpen:  () => console.log('✅ WS connected'),

    onClose: (e) => {
        if (!intentionalEndRef.current) {
          if (e?.code === 4008) {
            setSessionState(SESSION_STATE.COMPLETED);
          } else {
            setSessionState(prev =>
              prev !== SESSION_STATE.COMPLETED ? SESSION_STATE.IDLE : prev
            );
          }
        }
        clearInactivityTimer();
      },


      onError: () => {
        setError('Connection error. Please try again.');
        setSessionState(SESSION_STATE.ERROR);
        clearInactivityTimer();
      },
    });

    wsManager.connect();
    wsManagerRef.current = wsManager;

  } catch (err) {
    if (err.response?.status === 409) {
      const existingToken =
        err.response?.data?.error?.existing_session_token ||
        err.response?.data?.detail?.existing_session_token ||
        '';
      setError(`active_session_exists:${existingToken}`);
    } else {
      const msg =
        err.response?.data?.detail?.message ||
        err.response?.data?.detail ||
        err.response?.data?.error?.message ||
        err.message ||
        'Failed to start session';
      setError(msg);
    }
    setSessionState(SESSION_STATE.ERROR);
  }
}, [
  handleWsEvent, handleWsAudio,
  resetInactivityTimer, clearInactivityTimer,
  resumeToken, resumeWebsocketUrl, resumeSpecialist,  // ✅ added
]);




  // ── Start mic ─────────────────────────────────────────────────────────────
  const startMic = useCallback(async () => {
    if (!wsManagerRef.current?.isConnected) return;
    try {
      const recorder = new MicRecorder({
        onAudioChunk: (buffer) => {
          if (!isMutedRef.current) wsManagerRef.current?.sendAudio(buffer);
        },
      });
      await recorder.start();
      recorderRef.current = recorder;
      setMicPermission('granted');
      setSessionState(SESSION_STATE.LISTENING);
      clearInactivityTimer();
    } catch (err) {
      setMicPermission('denied');
      setError('Microphone access denied. Use text input instead.');
    }
  }, [clearInactivityTimer]);

  // ── Stop mic ──────────────────────────────────────────────────────────────
  const stopMic = useCallback(() => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    wsManagerRef.current?.commitAudio();
    setSessionState(SESSION_STATE.THINKING);
    clearInactivityTimer();
  }, [clearInactivityTimer]);

  // ── Toggle mute ───────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => setIsMuted(prev => !prev), []);

  // ── Send text fallback ────────────────────────────────────────────────────
  const sendTextMessage = useCallback((text) => {
    if (!text.trim() || !wsManagerRef.current?.isConnected) return;
    wsManagerRef.current.sendTextMessage(text);
    // Text messages show immediately — no need for streaming placeholder
    setTranscript(prev => [...prev, {
      role:      'user',
      text:      text.trim(),
      timestamp: new Date().toISOString(),
    }]);
    setSessionState(SESSION_STATE.THINKING);
    clearInactivityTimer();
  }, [clearInactivityTimer]);

  // ── End session ───────────────────────────────────────────────────────────
  const endSession = useCallback(async () => {
    const session = sessionRef.current;
    if (!session) return;

    clearInactivityTimer();
    intentionalEndRef.current = true;
    try {
      setSessionState(SESSION_STATE.ENDING);
      recorderRef.current?.stop();
      recorderRef.current = null;
      wsManagerRef.current?.endSession();

      await new Promise(r => setTimeout(r, 300));
      wsManagerRef.current?.disconnect();
      playerRef.current?.stop();

      const summary = await voiceAPI.endSession(session.session_token);
      setSessionSummary(summary);
      setSessionState(SESSION_STATE.COMPLETED);
    } catch (err) {
      console.error('❌ End session error:', err);
      setSessionState(SESSION_STATE.COMPLETED);
    } finally {
      intentionalEndRef.current = false; // ✅ Always clear — safe for next session
    }
  }, [clearInactivityTimer]);


  useEffect(() => { endSessionRef.current = endSession; }, [endSession]);

  // ── Reset ─────────────────────────────────────────────────────────────────
  const resetSession = useCallback(() => {
    clearInactivityTimer();
    recorderRef.current?.stop();
    wsManagerRef.current?.disconnect();
    playerRef.current?.stop();
    recorderRef.current          = null;
    streamingAIRef.current       = false;   // ✅ reset
    streamingUserRef.current     = false;   // ✅ reset
    setSessionState(SESSION_STATE.IDLE);
    setSessionData(null);
    setSessionSummary(null);
    setTranscript([]);
    setError(null);
    setIntent(null);
    setIsEmergency(false);
    setTurnCount(0);
  }, [clearInactivityTimer]);

  // ── Page leave cleanup ────────────────────────────────────────────────────
  useEffect(() => {
    const handleBeforeUnload = () => {
      const state = sessionStateRef.current;
      const token = sessionRef.current?.session_token;
      if (token && state !== SESSION_STATE.IDLE && state !== SESSION_STATE.COMPLETED) {
        const blob = new Blob([JSON.stringify({})], { type: 'application/json' });
        navigator.sendBeacon(
          `${import.meta.env.VITE_API_BASE_URL}/voice/session/${token}/end`,
          blob
        );
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // ── Route change / unmount cleanup ────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearInactivityTimer();
      recorderRef.current?.stop();
      wsManagerRef.current?.disconnect();
      playerRef.current?.stop();
      const token = sessionRef.current?.session_token;
      const state = sessionStateRef.current;
      if (token && state !== SESSION_STATE.IDLE && state !== SESSION_STATE.COMPLETED) {
        voiceAPI.endSession(token).catch(() => {});
      }
    };
  }, [clearInactivityTimer]);

  return {
    sessionState, sessionData, sessionSummary, transcript,
    error, intent, isEmergency, isMuted, micPermission, turnCount,

    isIdle:      sessionState === SESSION_STATE.IDLE,
    isActive:    [
                   SESSION_STATE.READY, SESSION_STATE.LISTENING,
                   SESSION_STATE.THINKING, SESSION_STATE.SPEAKING,
                 ].includes(sessionState),
    isListening: sessionState === SESSION_STATE.LISTENING,
    isThinking:  sessionState === SESSION_STATE.THINKING,
    isSpeaking:  sessionState === SESSION_STATE.SPEAKING,
    isCompleted: sessionState === SESSION_STATE.COMPLETED,
    isLoading:   [SESSION_STATE.STARTING, SESSION_STATE.CONNECTING, SESSION_STATE.ENDING]
                   .includes(sessionState),

    startSession, startMic, stopMic, toggleMute,
    sendTextMessage, endSession, resetSession,
    isResumed,
    resumedMessages,
    resumeSummary,
    resumeSpecialist,
  };
}
