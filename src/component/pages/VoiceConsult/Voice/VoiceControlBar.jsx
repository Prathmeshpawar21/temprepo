/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/Consult/voice/VoiceControlBar.jsx
import { useState } from 'react';
import { SESSION_STATE } from '../../../../hooks/useVoiceSession';

export default function VoiceControlBar({
  sessionState,
  isMuted,
  micPermission,
  onStartMic,
  onStopMic,
  onToggleMute,
  onEndSession,
  onSendText,
}) {
  const [textInput, setTextInput] = useState('');
  const [showText,  setShowText]  = useState(false);

  const isListening = sessionState === SESSION_STATE.LISTENING;
  const isThinking  = sessionState === SESSION_STATE.THINKING;
  const isSpeaking  = sessionState === SESSION_STATE.SPEAKING;
  const isReady     = sessionState === SESSION_STATE.READY;
  const isEnding    = sessionState === SESSION_STATE.ENDING;

  const micDisabled = isThinking || isSpeaking || isEnding;
 const canSpeak = isReady || isListening;

  const handleMicPress = () => {
    if (isListening) {
      onStopMic();
    } else if (canSpeak && !micDisabled) {
      onStartMic();
    }
  };

  const handleSendText = () => {
    if (!textInput.trim()) return;
    onSendText(textInput.trim());
    setTextInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  return (
    <div className="border-t border-gray-100 bg-white px-4 py-3 space-y-3">

      {/* Text input — shown when mic denied or toggled */}
      {(showText || micPermission === 'denied') && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your symptoms..."
            disabled={isThinking || isEnding}
            className="flex-1 px-4 py-2.5 text-sm bg-gray-50 border border-gray-200
                       rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300
                       focus:border-emerald-400 disabled:opacity-50"
          />
          <button
            onClick={handleSendText}
            disabled={!textInput.trim() || isThinking || isEnding}
            className="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200
                       text-white rounded-xl flex items-center justify-center
                       transition-colors shrink-0"
          >
            <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429
                       A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428
                       a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      )}

      {/* Main controls row */}
      <div className="flex items-center justify-between gap-3">

        {/* Left — Text toggle + Mute */}
        <div className="flex items-center gap-2">
          {/* Toggle text input */}
          <button
            onClick={() => setShowText(p => !p)}
            title="Type instead"
            className={`w-9 h-9 rounded-xl border flex items-center justify-center
                        text-sm transition-all
                        ${showText
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
          >
            ⌨️
          </button>

          {/* Mute */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center
                        text-sm transition-all
                        ${isMuted
                          ? 'bg-red-50 border-red-200 text-red-500'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>

        {/* Center — Mic button (hero) */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleMicPress}
            disabled={micDisabled || micPermission === 'denied'}
            className={`
              relative w-16 h-16 rounded-full flex items-center justify-center
              text-2xl transition-all duration-200 shadow-lg
              disabled:opacity-40 disabled:cursor-not-allowed
              ${isListening
                ? 'bg-red-500 hover:bg-red-600 scale-110 shadow-red-200'
                : isThinking || isSpeaking
                  ? 'bg-emerald-200 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600 hover:scale-105 shadow-emerald-200'
              }
            `}
          >
            {/* Pulse ring when listening */}
            {isListening && (
              <>
                <span className="absolute inset-0 rounded-full bg-red-400
                                 animate-ping opacity-30" />
                <span className="absolute inset-[-6px] rounded-full border-2
                                 border-red-300 animate-pulse" />
              </>
            )}
            <span className="relative z-10">
              {isListening ? '⏹️' : isThinking ? '⏳' : isSpeaking ? '🔊' : '🎙️'}
            </span>
          </button>

          {/* Mic label */}
          <span className="text-xs text-gray-500 font-medium">
            {isListening
              ? 'Tap to stop'
              : isThinking
                ? 'Processing...'
                : isSpeaking
                  ? 'AI speaking...'
                  : 'Tap to speak'
            }
          </span>
        </div>

        {/* Right — End session */}
        <div className="flex items-center gap-2">
          {/* Waveform indicator */}
          {isListening && (
            <div className="flex items-center gap-0.5 h-9 px-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-emerald-400 rounded-full animate-pulse"
                  style={{
                    height:          `${8 + Math.random() * 16}px`,
                    animationDelay:  `${i * 100}ms`,
                    animationDuration:'0.6s',
                  }}
                />
              ))}
            </div>
          )}

          {/* End session */}
          <button
            onClick={onEndSession}
            disabled={isEnding}
            title="End consultation"
            className="px-3 h-9 bg-white border border-red-200 text-red-500
                       hover:bg-red-50 hover:border-red-300
                       rounded-xl text-xs font-semibold
                       flex items-center gap-1.5 transition-all
                       disabled:opacity-50"
          >
            {isEnding ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <>
                <span>✕</span>
                <span>End</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mic denied warning */}
      {micPermission === 'denied' && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200
                        rounded-xl px-3 py-2">
          {/* <span className="text-amber-500 text-sm">⚠️</span> */}
          <p className="text-xs text-amber-700">
            Microphone blocked — using text mode. Allow mic in browser settings.
          </p>
        </div>
      )}
    </div>
  );
}
