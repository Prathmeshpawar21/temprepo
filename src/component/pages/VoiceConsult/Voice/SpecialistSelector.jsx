/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/Consult/voice/SpecialistSelector.jsx
import { useState } from 'react';
import { Phone, PhoneOutgoing} from 'lucide-react';

// ── Doctor image map ──────────────────────────────────────────────────────────
// Keys match specialist_type from backend
const DOCTOR_IMAGE_MAP = {
  cardiologist:       '/doctors_images/Cardiologist.png',
  dentist:            '/doctors_images/Dentist.png',
  dermatologist:      '/doctors_images/Dermatologist.png',
  endocrinologist:    '/doctors_images/Endocrinologist.png',
  ent:                '/doctors_images/ENT.png',
  gastroenterologist: '/doctors_images/Gastroenterologist.png',
  nephrologist:       '/doctors_images/Nephrologist.png',
  neurologist:        '/doctors_images/Neurologist.png',
  oncologist:         '/doctors_images/Oncologist.png',
  ophthalmologist:    '/doctors_images/Ophthalmologist.png',
  orthopedic:         '/doctors_images/Orthopedic.png',
  pediatrician:       '/doctors_images/Pediatrician.png',
  physiotherapist:    '/doctors_images/Physiotherapist.png',
  psychiatrist:       '/doctors_images/Psychiatrist.png',
  pulmonologist:      '/doctors_images/Pulmonologist.png',
  rheumatologist:     '/doctors_images/Rheumatologist.png',
  urologist:          '/doctors_images/Urologist.png',
  dietitian:          '/doctors_images/Dietitian.png',
  general_physician:     '/doctors_images/General_Physician.png',
  gynecologist:          '/doctors_images/Gynecologist.png',
  
};
// ── Emoji fallback for specialists without a photo ────────────────────────────
const ICON_MAP = {
  stethoscope: '🩺', heart: '❤️', tooth: '🦷', skin: '✨',
  food: '🥗', ear: '👂', hormone: '⚗️', stomach: '🫃',
  female: '🌸', filter: '🫘', neurology: '🧠', ribbon: '🎗️',
  eye: '👁️', bone: '🦴', baby: '👶', exercise: '🏃',
  brain: '💭', lungs: '🫁', joints: '🦵', kidney: '🫀',
};

// ── Category filters ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'all',        label: 'All' },
  { key: 'common',     label: 'Common' },
  { key: 'chronic',    label: 'Chronic' },
  { key: 'specialist', label: 'Specialist' },
  { key: 'mental',     label: 'Mental Health' },
];

const SPECIALIST_CATEGORY_MAP = {
  general_physician:  'common',
  dermatologist:      'common',
  dentist:            'common',
  ent:                'common',
  pediatrician:       'common',
  gynecologist:       'specialist',
  cardiologist:       'chronic',
  endocrinologist:    'chronic',
  gastroenterologist: 'chronic',
  nephrologist:       'chronic',
  pulmonologist:      'chronic',
  rheumatologist:     'chronic',
  neurologist:        'specialist',
  oncologist:         'specialist',
  ophthalmologist:    'specialist',
  orthopedic:         'specialist',
  urologist:          'specialist',
  physiotherapist:    'specialist',
  dietitian:          'common',
  psychiatrist:       'mental',
};


function CallIcon({ className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}


export default function SpecialistSelector({ specialists = [], onSelect, loading }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const gp     = specialists.find(s => s.specialist_type === 'general_physician');
  const others = specialists.filter(s => s.specialist_type !== 'general_physician');

  const filtered = others.filter(s => {
    const matchesCategory =
      activeCategory === 'all' ||
      SPECIALIST_CATEGORY_MAP[s.specialist_type] === activeCategory;
    const matchesSearch =
      !search ||
      s.display_name.toLowerCase().includes(search.toLowerCase()) ||
      s.focus_areas?.some(f => f.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) return <SpecialistSkeleton />;

  return (
    <div className="space-y-6">

      {/* ── GP Hero Card ──────────────────────────────────────────────────── */}
      {gp && (
        <div
          onClick={() => onSelect(gp)}
          className="relative bg-gradient-to-br from-emerald-500 to-teal-600
                     rounded-2xl cursor-pointer group
                     hover:shadow-xl hover:scale-[1.01]
                     transition-all duration-200 overflow-hidden"
        >
          {/* Decorative background blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10
                          rounded-full -translate-y-20 translate-x-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5
                          rounded-full translate-y-10 -translate-x-8" />

          <div className="relative flex items-center justify-between gap-4 p-5 sm:p-6">

            {/* Left — info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h2 className="text-xl font-bold text-white">{gp.display_name}</h2>
                <span className="bg-white/25 text-white text-xs font-semibold
                                 px-2.5 py-0.5 rounded-full">
                  Most Popular
                </span>
              </div>
              <p className="text-emerald-100 text-sm mb-3 leading-relaxed">
                {gp.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {gp.focus_areas?.slice(0, 4).map(area => (
                  <span key={area}
                        className="bg-white/20 text-white text-xs px-2.5 py-1
                                   rounded-full backdrop-blur-sm">
                    {area}
                  </span>
                ))}
              </div>
         <div className="inline-flex items-center gap-2 bg-white text-emerald-600
                font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg
                        group-hover:bg-emerald-50 transition-colors">
          <PhoneOutgoing className="w-5 h-5 text-green-500" />
          Start Talking
        </div>
            </div>

            {/* Right — doctor photo */}
            <div className="shrink-0 flex flex-col items-center gap-1.5">
              {DOCTOR_IMAGE_MAP[gp.specialist_type] ? (
                <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-2xl overflow-hidden
                                border-4 border-white/30 shadow-2xl
                                group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={DOCTOR_IMAGE_MAP[gp.specialist_type]}
                    alt={gp.display_name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white/20 rounded-2xl
                                flex items-center justify-center text-5xl
                                border-4 border-white/30 shadow-2xl">
                  {ICON_MAP[gp.icon_slug] || '🩺'}
                </div>
              )}
              {/* <p className="text-emerald-100 text-xs font-medium">
                Voice: {gp.voice}
              </p> */}
            </div>
          </div>
        </div>
      )}

      {/* ── Search + Category Filter ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-xs">
          {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span> */}
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search specialists..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200
                       rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300
                       focus:border-emerald-400 text-gray-700 placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap
                          transition-all duration-150
                          ${activeCategory === cat.key
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
                          }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Specialist Grid ───────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-2">🔍</p>
          <p className="text-sm">No specialists found for "{search}"</p>
          <button
            onClick={() => { setSearch(''); setActiveCategory('all'); }}
            className="mt-2 text-emerald-500 text-sm hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(specialist => (
            <SpecialistCard
              key={specialist.specialist_type}
              specialist={specialist}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Specialist Card (with doctor photo) ───────────────────────────────────────
function SpecialistCard({ specialist, onSelect }) {
  const image = DOCTOR_IMAGE_MAP[specialist.specialist_type];

  return (
    <div
      onClick={() => onSelect(specialist)}
      className="bg-white border border-gray-100 rounded-2xl cursor-pointer
                 hover:border-emerald-300 hover:shadow-lg
                 transition-all duration-200 group overflow-hidden"
    >
      {/* ── Doctor Photo / Icon area ──────────────────────────────────── */}
      <div className="relative h-70 bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={specialist.display_name}
            className="w-full h-full object-cover object-top
                       group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          /* Fallback for specialists without photo */
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-5xl">
              {ICON_MAP[specialist.icon_slug] || '🏥'}
            </span>
          </div>
        )}

        {/* Voice badge — top right overlay */}
        {/* <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm
                        text-xs text-gray-500 px-2 py-0.5 rounded-full
                        font-medium shadow-sm">
          {specialist.voice}
        </div> */}

        {/* Bottom fade gradient — blends into card body */}
        <div className="absolute inset-x-0 bottom-0 h-14
                        bg-gradient-to-t from-white via-white/60 to-transparent" />
      </div>

      {/* ── Card Body ────────────────────────────────────────────────── */}
      <div className="px-4 pb-4">
        {/* Name */}
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
          {specialist.display_name}
        </h3>

        {/* Description */}
        {/* <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
          {specialist.description}
        </p> */}

        {/* Focus areas */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {specialist.focus_areas?.slice(0, 2).map(area => (
            <span key={area}
                  className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-lg">
              {area}
            </span>
          ))}
          {specialist.focus_areas?.length > 2 && (
            <span className="text-xs text-gray-400">
              +{specialist.focus_areas.length - 2}
            </span>
          )}
        </div>

        {/* CTA */}
  <div className="w-full bg-emerald-50 text-emerald-600 text-xs font-semibold
                py-2 rounded-xl text-center transition-all duration-200
                group-hover:bg-emerald-500 group-hover:text-white
                flex items-center justify-center gap-1.5">
  <Phone className="w-4 h-4 text-green-500 group-hover:text-white transition-colors" />
  Consult Now
</div>


      </div>
    </div>
  );
}

// ── Loading Skeleton ──────────────────────────────────────────────────────────
function SpecialistSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-40 bg-gray-200 rounded-2xl" />
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-20 bg-gray-200 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-56 bg-gray-200 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
