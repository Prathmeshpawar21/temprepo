/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/VoiceConsult/Voice/VoiceSessionPanel.jsx
import { useState }          from 'react';
import { AnimatePresence }   from 'framer-motion';
import { SESSION_STATE }     from '../../../../hooks/useVoiceSession';
import VoiceTranscriptFeed   from './VoiceTranscriptFeed';
import VoiceControlBar       from './VoiceControlBar';
import ResumeBanner          from './ResumeBanner';

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  [SESSION_STATE.CONNECTING]: {
    label: 'Connecting...',
    color: 'text-amber-500',
    dot:   'bg-amber-400 animate-pulse',
  },
  [SESSION_STATE.READY]: {
    label: 'Ready — tap mic to speak',
    color: 'text-emerald-600',
    dot:   'bg-emerald-400',
  },
  [SESSION_STATE.LISTENING]: {
    label: 'Listening...',
    color: 'text-emerald-600',
    dot:   'bg-emerald-500 animate-ping',
  },
  [SESSION_STATE.THINKING]: {
    label: 'AI is thinking...',
    color: 'text-blue-500',
    dot:   'bg-blue-400 animate-pulse',
  },
  [SESSION_STATE.SPEAKING]: {
    label: 'AI is speaking...',
    color: 'text-purple-500',
    dot:   'bg-purple-400 animate-pulse',
  },
  [SESSION_STATE.ENDING]: {
    label: 'Ending session...',
    color: 'text-gray-500',
    dot:   'bg-gray-400 animate-pulse',
  },
};

const VOICE_ICON_MAP = {
  stethoscope: '🩺', heart: '❤️', tooth: '🦷', skin: '✨',
  food: '🥗', ear: '👂', hormone: '⚗️', stomach: '🫃',
  female: '🌸', filter: '🫘', neurology: '🧠', ribbon: '🎗️',
  eye: '👁️', bone: '🦴', baby: '👶', exercise: '🏃',
  brain: '💭', lungs: '🫁', joints: '🦵', kidney: '🫀',
};

/**
 * VoiceSessionPanel
 *
 * Props (existing):
 *   sessionState, sessionData, transcript, intent,
 *   isEmergency, isMuted, micPermission, turnCount,
 *   selectedSpecialist, onStartMic, onStopMic, onToggleMute,
 *   onEndSession, onSendText
 *
 * ✅ New resume props:
 *   isResumed       — show ResumeBanner at top
 *   resumedMessages — prior transcript turns passed to VoiceTranscriptFeed
 *   resumeSummary   — { date, chief_complaint, specialist_name, message_count }
 */
export default function VoiceSessionPanel({
  sessionState,
  sessionData,
  transcript,
  intent,
  isEmergency,
  isMuted,
  micPermission,
  turnCount,
  selectedSpecialist,
  onStartMic,
  onStopMic,
  onToggleMute,
  onEndSession,
  onSendText,
  // ✅ Resume
  isResumed       = false,
  resumedMessages = [],
  resumeSummary   = null,
}) {
  const [showResumeBanner, setShowResumeBanner] = useState(true);

  const status = STATUS_CONFIG[sessionState] || STATUS_CONFIG[SESSION_STATE.READY];
  const icon   = VOICE_ICON_MAP[selectedSpecialist?.icon_slug] || '🩺';

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl
                    border border-gray-100 shadow-sm overflow-hidden">

      {/* ── Session Header ──────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between">

          {/* Specialist info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center
                            justify-center text-xl">
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-gray-900 text-sm leading-tight">
                  {selectedSpecialist?.display_name || 'AI Specialist'}
                </h2>
                {/* ✅ Resumed badge */}
                {isResumed && (
                  <span className="text-[10px] bg-teal-100 text-teal-700
                                   px-2 py-0.5 rounded-full font-semibold
                                   border border-teal-200">
                    Resumed
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                <span className={`text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </div>
          </div>

          {/* Turn counter + intent badge */}
          {/* <div className="flex items-center gap-2">
            {intent && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700
                              text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                <span>🎯</span>
                {intent.value.replace(/_/g, ' ')}
              </div>
            )}
            {turnCount > 0 && (
              <div className="bg-gray-100 text-gray-600 text-xs
                              px-2.5 py-1 rounded-full font-medium">
                {turnCount} {turnCount === 1 ? 'turn' : 'turns'}
              </div>
            )}
          </div> */}
          
        </div>
      </div>

      {/* ── ✅ Resume Banner ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isResumed && showResumeBanner && resumeSummary && (
          <div className="px-4 pt-3">
            <ResumeBanner
              summary={resumeSummary}
              onDismiss={() => setShowResumeBanner(false)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* ── Emergency Banner ─────────────────────────────────────────────── */}
      {isEmergency && (
        <div className="bg-red-500 text-white px-4 py-2.5 flex items-center gap-2">
          <span className="text-base animate-pulse">🚨</span>
          <div>
            <p className="font-semibold text-sm">Emergency Detected</p>
            <p className="text-xs text-red-100">
              Call 112 immediately or visit nearest emergency room.
            </p>
          </div>
          <a
            href="tel:112"
            className="ml-auto bg-white text-red-600 text-xs font-bold
                       px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors
                       whitespace-nowrap"
          >
            Call 112
          </a>
        </div>
      )}

      {/* ── Connecting overlay ───────────────────────────────────────────── */}
      {sessionState === SESSION_STATE.CONNECTING && (
        <div className="flex-1 flex flex-col items-center justify-center
                        gap-4 text-center px-6">
          <div className="relative">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center
                            justify-center text-3xl">
              {icon}
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-emerald-300
                            animate-spin border-t-transparent" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {isResumed ? 'Reconnecting...' : 'Connecting to AI'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isResumed
                ? `Resuming session with ${selectedSpecialist?.display_name}...`
                : `Setting up your session with ${selectedSpecialist?.display_name}...`}
            </p>
          </div>
        </div>
      )}

      {/* ── ✅ Transcript feed — passes priorMessages for resume ─────────── */}
      {sessionState !== SESSION_STATE.CONNECTING && (
        <VoiceTranscriptFeed
          transcript={transcript}
          sessionState={sessionState}
          specialistName={selectedSpecialist?.display_name}
          priorMessages={resumedMessages}    // ✅ faded prior turns above live turns
        />
      )}

      {/* ── Control bar ──────────────────────────────────────────────────── */}
      <VoiceControlBar
        sessionState={sessionState}
        isMuted={isMuted}
        micPermission={micPermission}
        onStartMic={onStartMic}
        onStopMic={onStopMic}
        onToggleMute={onToggleMute}
        onEndSession={onEndSession}
        onSendText={onSendText}
      />
    </div>
  );
}
