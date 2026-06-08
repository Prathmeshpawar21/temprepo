/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/Consult/voice/VoiceSessionSummary.jsx

// const INTENT_LABELS = {
//   symptom_check:        { label: 'Symptom Check',       icon: '🩺', color: 'emerald' },
//   prescription_query:   { label: 'Prescription Query',  icon: '💊', color: 'blue'    },
//   mental_health:        { label: 'Mental Health',        icon: '💭', color: 'purple'  },
//   chronic_management:   { label: 'Chronic Management',  icon: '📋', color: 'orange'  },
//   emergency:            { label: 'Emergency',            icon: '🚨', color: 'red'     },
//   general_query:        { label: 'General Query',        icon: '💬', color: 'gray'    },
//   unknown:              { label: 'General Consultation', icon: '🏥', color: 'gray'    },
// };
const INTENT_LABELS = {
  symptom_check:        { label: 'Symptom Check',       icon: '', color: 'emerald' },
  prescription_query:   { label: 'Prescription Query',  icon: '', color: 'blue'    },
  mental_health:        { label: 'Mental Health',        icon: '', color: 'purple'  },
  chronic_management:   { label: 'Chronic Management',  icon: '', color: 'orange'  },
  emergency:            { label: 'Emergency',            icon: '', color: 'red'     },
  general_query:        { label: 'General Query',        icon: '', color: 'gray'    },
  unknown:              { label: 'General Consultation', icon: '', color: 'gray'    },
};

const COLOR_MAP = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  blue:    'bg-blue-50 text-blue-700 border-blue-200',
  purple:  'bg-purple-50 text-purple-700 border-purple-200',
  orange:  'bg-orange-50 text-orange-700 border-orange-200',
  red:     'bg-red-50 text-red-700 border-red-200',
  gray:    'bg-gray-50 text-gray-700 border-gray-200',
};

export default function VoiceSessionSummary({
  summary,
  transcript,
  selectedSpecialist,
  onNewConsult,
  onViewHistory,
}) {
  const intentKey  = summary?.intent_detected || 'unknown';
  const intentInfo = INTENT_LABELS[intentKey] || INTENT_LABELS.unknown;
  const colorClass = COLOR_MAP[intentInfo.color];

  const duration = summary?.duration_seconds
    ? formatDuration(summary.duration_seconds)
    : '—';

  return (
    <div className="space-y-4 max-w-2xl mx-auto">

      {/* ── Success banner ─────────────────────────────────────────── */}
      {/* <div className="bg-emerald-500 rounded-2xl p-5 text-white text-center"> */}
        {/* <div className="text-4xl mb-2">✅</div> */}
        {/* <h2 className="text-lg font-bold">Consultation Complete</h2> */}
        {/* <p className="text-emerald-100 text-sm mt-1">
          Your session with {selectedSpecialist?.display_name} has ended
        </p> */}
      {/* </div> */}

      {/* ── Stats row ──────────────────────────────────────────────── */}
      {/* <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Duration',   value: duration,                      icon: '⏱️' },
          { label: 'Turns',      value: summary?.turn_count ?? transcript.length, icon: '💬' },
          { label: 'Status',     value: 'Completed',                   icon: '✓'  },
        ].map(stat => (
          <div key={stat.label}
               className="bg-white border border-gray-100 rounded-2xl p-4
                          text-center shadow-sm">
            <div className="text-xl mb-1">{stat.icon}</div>
            <div className="font-bold text-gray-900 text-lg">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div> */}

      {/* ── Intent + outcome ───────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
          <span></span> Analysis
        </h3>

        {/* Intent badge */}
        {/* <div className={`inline-flex items-center gap-2 px-3 py-1.5
                         rounded-xl border text-sm font-medium ${colorClass}`}>
          <span>{intentInfo.icon}</span>
          {intentInfo.label}
        </div> */}

        {/* Outcome summary */}
        {summary?.outcome_summary && (
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">
              Summary
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {summary.outcome_summary}
            </p>
          </div>
        )}

        {/* Emergency flag */}
        {summary?.is_emergency && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200
                          rounded-xl px-3 py-2">
            <span>🚨</span>
            <p className="text-sm text-red-700 font-medium">
              Emergency was detected during this session.
            </p>
          </div>
        )}
      </div>

      {/* ── Transcript preview ─────────────────────────────────────── */}
      {/* {transcript.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4
                        shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
            <span></span> Conversation ({transcript.length} messages)
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {transcript.map((turn, idx) => (
              <div key={idx} className={`flex gap-2 text-xs ${
                turn.role === 'user' ? 'justify-end' : 'justify-start'
              }`}>
                {turn.role === 'assistant' && (
                  <span className="shrink-0 mt-0.5">🤖</span>
                )}
                <div className={`max-w-[80%] px-3 py-2 rounded-xl leading-relaxed ${
                  turn.role === 'user'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {turn.text}
                </div>
                {turn.role === 'user' && (
                  <span className="shrink-0 mt-0.5">👤</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* ── Medical disclaimer ─────────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3
                      flex items-start gap-2">
        {/* <span className="text-amber-500 text-sm mt-0.5 shrink-0">⚠️</span> */}
        <p className="text-xs text-amber-700 leading-relaxed">
          <span className="font-semibold">Medical Disclaimer: </span>
          This AI consultation is for informational purposes only and does not
          replace professional medical advice. Always consult a licensed doctor
          for diagnosis and treatment.
        </p>
      </div>

      {/* ── Actions ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 pb-4">
        <button
          onClick={onViewHistory}
          className="flex items-center justify-center gap-2 px-4 py-3
                     bg-white border border-gray-200 text-gray-700
                     rounded-2xl text-sm font-semibold
                     hover:border-emerald-300 hover:text-emerald-600
                     transition-all"
        >
          <span>📋</span> View History
        </button>
        <button
          onClick={onNewConsult}
          className="flex items-center justify-center gap-2 px-4 py-3
                     bg-emerald-500 hover:bg-emerald-600 text-white
                     rounded-2xl text-sm font-semibold
                     transition-all shadow-sm shadow-emerald-200"
        >
          <span>🎙️</span> New Consult
        </button>
      </div>
    </div>
  );
}

function formatDuration(seconds) {
  if (!seconds) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}
