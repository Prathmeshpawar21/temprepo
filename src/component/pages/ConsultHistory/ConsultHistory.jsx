/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/ConsultHistory/ConsultHistory.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import useConsultations from '../../../hooks/useConsultations';

import ConsultHistoryHeader from './ConsultHistoryHeader';
import SearchAndControls from './SearchAndControls';
import FilterDropdown from './FilterDropdown';
import ListView from './ListView';
import GridView from './GridView';
import FloatingActionButton from './FloatingActionButton';

const dateRanges = [
  { label: 'All time',     value: null },
  { label: 'Last 7 days',  value: 7    },
  { label: 'Last 30 days', value: 30   },
  { label: 'Last 90 days', value: 90   },
  { label: 'Last year',    value: 365  },
];

// ── Specialist type → image ───────────────────────────────────────────────────
export const SPECIALIST_IMAGE_MAP = {
  general_physician:  '/doctors_images/General_Physician.png',
  cardiologist:       '/doctors_images/Cardiologist.png',
  dermatologist:      '/doctors_images/Dermatologist.png',
  orthopedic:         '/doctors_images/Orthopedic.png',
  pediatrician:       '/doctors_images/Pediatrician.png',
  gynecologist:       '/doctors_images/Gynecologist.png',
  ent:                '/doctors_images/ENT.png',
  dentist:            '/doctors_images/Dentist.png',
  ophthalmologist:    '/doctors_images/Ophthalmologist.png',
  psychiatrist:       '/doctors_images/Psychiatrist.png',
  neurologist:        '/doctors_images/Neurologist.png',
  gastroenterologist: '/doctors_images/Gastroenterologist.png',
  urologist:          '/doctors_images/Urologist.png',
  endocrinologist:    '/doctors_images/Endocrinologist.png',
  pulmonologist:      '/doctors_images/Pulmonologist.png',
  rheumatologist:     '/doctors_images/Rheumatologist.png',
  oncologist:         '/doctors_images/Oncologist.png',
  nephrologist:       '/doctors_images/Nephrologist.png',
  physiotherapist:    '/doctors_images/Physiotherapist.png',
  dietitian:          '/doctors_images/Dietitian.png',
};

// ── Transform raw API consultation → UI shape ─────────────────────────────────
export const transformConsultation = (consultation) => {
  const createdDate = new Date(consultation.created_at);
  const ai = consultation.ai_analysis || {};

  const statusMap = {
    IN_PROGRESS: 'in-progress',
    COMPLETED:   'completed',
    ABANDONED:   'cancelled',
    CANCELLED:   'cancelled',
  };

  // ✅ FIX 1: specialist_type lives inside ai_analysis
  const specialistKey =
    (ai.specialist_type || consultation.recommended_specialty || 'general_physician')
      .toLowerCase();

  const specialistImage =
    SPECIALIST_IMAGE_MAP[specialistKey] || SPECIALIST_IMAGE_MAP.general_physician;

  // ✅ FIX 2: display name from specialist key
  const SPECIALIST_DISPLAY = {
    general_physician:  'General Physician',
    cardiologist:       'Cardiologist',
    dermatologist:      'Dermatologist',
    orthopedic:         'Orthopedic',
    pediatrician:       'Pediatrician',
    gynecologist:       'Gynecologist',
    ent:                'ENT Specialist',
    dentist:            'Dentist',
    ophthalmologist:    'Ophthalmologist',
    psychiatrist:       'Psychiatrist',
    neurologist:        'Neurologist',
    gastroenterologist: 'Gastroenterologist',
    urologist:          'Urologist',
    endocrinologist:    'Endocrinologist',
    pulmonologist:      'Pulmonologist',
    rheumatologist:     'Rheumatologist',
    oncologist:         'Oncologist',
    nephrologist:       'Nephrologist',
    physiotherapist:    'Physiotherapist',
    dietitian:          'Dietitian',
  };
  const specialistDisplayName =
    SPECIALIST_DISPLAY[specialistKey] ||
    specialistKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // ✅ FIX 3: duration from ai_analysis.duration_seconds (recommended_specialty is always null)
  const durationSeconds = ai.duration_seconds;
  let durationDisplay = 'Ongoing';
  if (durationSeconds) {
    const m = Math.floor(durationSeconds / 60);
    const s = durationSeconds % 60;
    durationDisplay = m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  // ✅ FIX 4: display title — chief_complaint is already the patient's first message
  // Skip generic/gibberish ones and fall back to consultation_summary
  const GENERIC_COMPLAINTS = ['hello', 'hi', 'who are you', 'voice consultation'];
  let displayTitle = 'General Consultation';
  let chiefComplaint = consultation.chief_complaint;

  if (chiefComplaint) {
    const isGeneric = GENERIC_COMPLAINTS.some(g =>
      chiefComplaint.toLowerCase().startsWith(g)
    );

    if (!isGeneric) {
      // Clean up: capitalize first letter
      displayTitle = chiefComplaint.charAt(0).toUpperCase() + chiefComplaint.slice(1);
      // Truncate long ones
      if (displayTitle.length > 60) displayTitle = displayTitle.substring(0, 60) + '...';
    } else {
      // Fall back to consultation_summary — strip the " | X turns" suffix for cleaner display
      displayTitle = (consultation.consultation_summary || 'General Consultation')
        .replace(/\s*\|\s*\d+ turns.*$/i, '')
        .trim();
    }
  }

  // ✅ FIX 5: turn count + message count from correct fields
  const turnCount    = ai.turn_count    || 0;
  const messageCount = consultation.message_count || 0;

  // Tags — use specialist key + severity + intent
  const tags = [
    'voice-consultation',
    specialistKey,
    (consultation.severity_level || '').toLowerCase(),
    (ai.intent || '').toLowerCase().replace(/_/g, '-'),
  ].filter(tag => tag && tag !== 'unknown' && tag !== '-');

  return {
    id:             consultation.id,
    specialistType: specialistKey,
    specialistImage,

    // ✅ Use parsed specialist display name
    doctor:          specialistDisplayName,
    doctorSpecialty: specialistDisplayName,
    doctorRating:    4.9,

    date: createdDate.toISOString().split('T')[0],
    // ✅ IST 12hr time
    time: createdDate.toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata'
    }),
    // ✅ Use cleaned display title
    type:      displayTitle,
    diagnosis: consultation.consultation_summary || displayTitle,

    severity: (consultation.severity_level || 'MEDIUM').toLowerCase(),
    status:   statusMap[consultation.status] || 'completed',

    // ✅ Duration from ai_analysis
    duration: durationDisplay,
    cost:     'Free',
    location: 'Online',

    notes: consultation.consultation_summary ||
           consultation.chief_complaint      ||
           'AI-powered voice consultation.',

    prescriptions:     [],
    nextFollowUp:      null,
    tags,
    documents:         [],
    isBookmarked:      false,
    priority:          (consultation.severity_level || '').toLowerCase() === 'high'
                         ? 'high' : 'normal',

    patientName:  consultation.patient_name,
    sessionId:    consultation.session_id,

    // ✅ Both turn count and message count available
    messageCount,
    turnCount,

    symptoms:          consultation.symptoms || [],
    aiAnalysis:        ai,
    recommendedDoctors: [],
    createdAt:         createdDate,
  };
};

// ─────────────────────────────────────────────────────────────────────────────

const ConsultHistory = () => {
  const navigate = useNavigate();

  const {
    consultations: apiConsultations,
    loading,
    stats: apiStats,
    fetchConsultations,
    refresh,
    // ✅ Resume from hook
    resumeConsultation,
    resuming,
    resumeError,
    deleteConsultation,
  } = useConsultations(true);

  // Show resume errors as toasts
  useEffect(() => {
    if (resumeError) toast.error(resumeError);
  }, [resumeError]);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [searchTerm,    setSearchTerm]    = useState('');
  const [expandedId,    setExpandedId]    = useState(null);
  const [filterOpen,    setFilterOpen]    = useState(false);
  const [viewMode,      setViewMode]      = useState('list');
  const [sortBy,        setSortBy]        = useState('date');
  const [sortOrder,     setSortOrder]     = useState('desc');
  const [selectedTags,  setSelectedTags]  = useState([]);
  const [filters,       setFilters]       = useState({
    dateRangeDays: null,
    status:        'All statuses',
    severity:      'All severities',
    specialistType: 'All specialists',
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  // ── Transform ───────────────────────────────────────────────────────────────
  const consultations = useMemo(() => {
    if (!apiConsultations?.length) return [];
    return apiConsultations.map(transformConsultation);
  }, [apiConsultations]);

  // ── Stats ───────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const byStatus   = apiStats.by_status   || {};
    const bySeverity = apiStats.by_severity || {};
    return {
      total:     apiStats.total_consultations || 0,
      completed: byStatus.COMPLETED           || 0,
      bookmarked: 0,
      emergency: bySeverity.HIGH              || 0,
      avgCost:   '0',
    };
  }, [apiStats]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const toggleExpand   = (id) => setExpandedId((prev) => (prev === id ? null : id));
  const toggleBookmark = (id) => console.log('Bookmark coming soon:', id);

  const resetFilters = () => {
    setFilters({
      dateRangeDays:  null,
      status:         'All statuses',
      severity:       'All severities',
      specialistType: 'All specialists',
    });
    setSearchTerm('');
    setSelectedTags([]);
    fetchConsultations();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    const apiFilters = {};
    if (key === 'status' && value !== 'All statuses') {
      const map = { completed: 'COMPLETED', 'in-progress': 'IN_PROGRESS', cancelled: 'CANCELLED' };
      apiFilters.status = map[value.toLowerCase()] || value.toUpperCase();
    }
    if (key === 'severity' && value !== 'All severities') {
      apiFilters.severity = value.toUpperCase();
    }
    if (key === 'specialistType' && value !== 'All specialists') {
      apiFilters.specialist_type = value;
    }
    fetchConsultations(apiFilters);
  };

  const allTags = useMemo(() => {
    const tags = new Set();
    consultations.forEach((c) => c.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [consultations]);

  // ── Filter + sort ───────────────────────────────────────────────────────────
  const filteredAndSorted = useMemo(() => {
    const term = searchTerm.toLowerCase();

    let result = consultations.filter((c) => {
      const matchSearch =
        c.doctor.toLowerCase().includes(term) ||
        c.diagnosis.toLowerCase().includes(term) ||
        c.type.toLowerCase().includes(term) ||
        c.notes.toLowerCase().includes(term) ||
        c.doctorSpecialty.toLowerCase().includes(term) ||
        (c.sessionId && c.sessionId.toLowerCase().includes(term));

      const matchStatus =
        filters.status === 'All statuses' ||
        c.status === filters.status.toLowerCase().replace(' ', '-');

      const matchSeverity =
        filters.severity === 'All severities' ||
        c.severity === filters.severity.toLowerCase();

      const matchTags =
        selectedTags.length === 0 ||
        selectedTags.every((t) => c.tags?.includes(t));

      let matchDate = true;
      if (filters.dateRangeDays) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - filters.dateRangeDays);
        matchDate = new Date(c.date) >= cutoff;
      }

      return matchSearch && matchStatus && matchSeverity && matchTags && matchDate;
    });

    result.sort((a, b) => {
      const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
      const av =
        sortBy === 'date'     ? new Date(a.date)            :
        sortBy === 'severity' ? severityOrder[a.severity]   : a[sortBy];
      const bv =
        sortBy === 'date'     ? new Date(b.date)            :
        sortBy === 'severity' ? severityOrder[b.severity]   : b[sortBy];
      return sortOrder === 'desc'
        ? av > bv ? -1 : av < bv ? 1 : 0
        : av < bv ? -1 : av > bv ? 1 : 0;
    });

    return result;
  }, [consultations, searchTerm, filters, selectedTags, sortBy, sortOrder]);

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        <ConsultHistoryHeader
          currentTime={currentTime}
          onRefresh={refresh}
          loading={loading}
        />

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <SearchAndControls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          <FilterDropdown
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
            filters={filters}
            handleFilterChange={handleFilterChange}
            resetFilters={resetFilters}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            allTags={allTags}
            dateRanges={dateRanges}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Content */}
        {!loading && (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredAndSorted.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Consultation History</h3>
                <p className="text-gray-600 mb-6">
                  Start a new consultation to begin tracking your medical history.
                </p>
                <button
                  onClick={() => navigate('/new-consult')}
                  className="px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all"
                >
                  Start New Consultation
                </button>
              </div>
            ) : viewMode === 'list' ? (
              <ListView
                filteredAndSortedConsultations={filteredAndSorted}
                expandedId={expandedId}
                toggleExpand={toggleExpand}
                toggleBookmark={toggleBookmark}
                resetFilters={resetFilters}
                // ✅ Pass resume from hook — hook handles API + navigate
                onResume={resumeConsultation}
                globalResuming={resuming}
                onDelete={deleteConsultation} 
              />
            ) : (
              <GridView
                filteredAndSortedConsultations={filteredAndSorted}
                toggleExpand={toggleExpand}
                toggleBookmark={toggleBookmark}
                onResume={resumeConsultation}
                globalResuming={resuming}
                onDelete={deleteConsultation}  
              />
            )}
          </motion.div>
        )}

        <FloatingActionButton navigate={navigate} />
      </div>
    </div>
  );
};

export default ConsultHistory;
