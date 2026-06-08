/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/VoiceConsult/Voice/VoiceTranscriptFeed.jsx
import { useEffect, useRef } from 'react';
import { SESSION_STATE } from '../../../../hooks/useVoiceSession';

/**
 * VoiceTranscriptFeed
 *
 * Props:
 *   transcript      — live turns from current session
 *   sessionState    — SESSION_STATE enum
 *   specialistName  — display name shown above AI bubbles
 *   priorMessages   — [] pre-loaded turns from resumed session (shown faded above)
 */
export default function VoiceTranscriptFeed({
  transcript,
  sessionState,
  specialistName,
  priorMessages = [],   // ✅ resume prop
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, priorMessages]);

  const isThinking     = sessionState === SESSION_STATE.THINKING;
  const isEmpty        = transcript.length === 0 && priorMessages.length === 0;
  const hasStreamingAI = transcript.some(t => t.role === 'assistant' && t.isStreaming);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">

      {/* ── Empty state ─────────────────────────────────────────────────── */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center h-full
                        text-center py-12 text-gray-400 space-y-3">
                          
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center
                          justify-center text-3xl">
            🎙️
          </div>

          <div>
            <p className="font-medium text-gray-600 text-sm">Ready to listen</p>
            <p className="text-xs text-gray-400 mt-1">
              Press the mic button and start speaking
            </p>
          </div>
        </div>
      )}

      {/* ── ✅ Prior session messages (faded, read-only) ─────────────────── */}
      {priorMessages.length > 0 && (
        <>
          {/* Top divider */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[10px] text-gray-400 font-medium px-2 whitespace-nowrap
                             bg-white border border-gray-200 rounded-full py-0.5">
              Previous session
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {priorMessages.map((msg, i) => (
            <div
              key={`prior-${i}`}
              className={`flex gap-2 opacity-50 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center
                                justify-center text-xs shrink-0 mt-0.5">
                  🤖
                </div>
              )}
              <div className={`
                max-w-[75%] px-3 py-2 rounded-xl text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-emerald-100 text-emerald-900 rounded-tr-none'
                  : 'bg-gray-100 text-gray-700 rounded-tl-none'
                }
              `}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* Bottom divider — current session starts here */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-teal-200" />
            <span className="text-[10px] text-teal-600 font-semibold px-2 whitespace-nowrap
                             bg-teal-50 border border-teal-200 rounded-full py-0.5">
              Continuing now
            </span>
            <div className="flex-1 h-px bg-teal-200" />
          </div>
        </>
      )}

      {/* ── Live transcript turns ────────────────────────────────────────── */}
      {transcript.map((turn, idx) => (
        <TranscriptBubble
          key={idx}
          turn={turn}
          specialistName={specialistName}
        />
      ))}

      {/* ── Global thinking dots (only when no AI streaming bubble present) */}
      {isThinking && !hasStreamingAI && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center
                          justify-center text-sm shrink-0">
            🤖
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm
                          px-4 py-3 shadow-sm">
            <TypingDots />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

// ── Transcript Bubble ─────────────────────────────────────────────────────────
function TranscriptBubble({ turn, specialistName }) {
  const isUser           = turn.role === 'user';
  const isStreamingEmpty = turn.isStreaming && !turn.text;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%]">
          <div className="bg-emerald-500 text-white rounded-2xl rounded-tr-sm
                          px-4 py-2.5 shadow-sm">
            {isStreamingEmpty ? (
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-75">🎤</span>
                <TypingDots light />
              </div>
            ) : (
              <p className="text-sm leading-relaxed">{turn.text}</p>
            )}
          </div>
          {!isStreamingEmpty && (
            <p className="text-xs text-gray-400 text-right mt-1 pr-1">
              {formatTime(turn.timestamp)}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center
                      justify-center text-sm shrink-0 mt-0.5">
        🤖
      </div>
      <div className="max-w-[75%]">
        <p className="text-xs text-gray-500 mb-1 font-medium">{specialistName}</p>
        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm
                        px-4 py-2.5 shadow-sm">
          {isStreamingEmpty ? (
            <TypingDots />
          ) : turn.isStreaming ? (
            <p className="text-sm text-gray-800 leading-relaxed">
              {turn.text}
              <span className="inline-block w-0.5 h-4 bg-emerald-400 ml-0.5
                               align-middle animate-pulse" />
            </p>
          ) : (
            <p className="text-sm text-gray-800 leading-relaxed">{turn.text}</p>
          )}
        </div>
        {/* {!isStreamingEmpty && (
          <p className="text-xs text-gray-400 mt-1 pl-1">
            {formatTime(turn.timestamp)}
          </p>
        )} */}
      </div>
    </div>
  );
}

// ── Typing Dots ───────────────────────────────────────────────────────────────
function TypingDots({ light = false }) {
  const color = light ? 'bg-white/70' : 'bg-emerald-400';
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={`w-2 h-2 ${color} rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

function formatTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  });
}
