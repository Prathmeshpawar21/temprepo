/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, MessageSquare, PlayCircle,
  Loader2, Trash2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const SEVERITY_STYLES = {
  low:      { pill: 'bg-green-100 text-green-700 border-green-200',    dot: 'bg-green-500'  },
  medium:   { pill: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  high:     { pill: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  critical: { pill: 'bg-red-100 text-red-700 border-red-200',          dot: 'bg-red-500'    },
};

const ConsultationCard = ({
  consult,
  onResume,
  globalResuming = false,
  onDelete,
  onClick,
  index = 0,
}) => {
  const [localResuming,   setLocalResuming]   = useState(false);
  const [deletingId,      setDeletingId]      = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const severity    = SEVERITY_STYLES[consult.severity] || SEVERITY_STYLES.medium;
  const isResuming  = localResuming || globalResuming;

  // ── Resume ────────────────────────────────────────────────────────────────
  const handleResume = async (e) => {
    e.stopPropagation();
    if (isResuming) return;

    setLocalResuming(true);
    toast.loading('Loading previous conversation...', { id: `resume-${consult.id}` });

    try {
      await onResume(consult.id);
      toast.success('Conversation loaded!', { id: `resume-${consult.id}` });
    } catch (err) {
      toast.error(
        err?.response?.data?.detail || err?.message || 'Failed to resume',
        { id: `resume-${consult.id}` }
      );
    } finally {
      setLocalResuming(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (e) => {
    e.stopPropagation();

    // First click → show confirm
    if (confirmDeleteId !== consult.id) {
      setConfirmDeleteId(consult.id);
      return;
    }

    // Second click (Yes) → call API
    setDeletingId(consult.id);
    setConfirmDeleteId(null);
    try {
      await onDelete(consult.id);
      toast.success('Consultation deleted');
    } catch (err) {
      toast.error(err?.message || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group flex flex-col"
      onClick={onClick}
    >
      {/* ── Specialist Image Header ─────────────────────────────────────── */}
      <div className="relative h-28 bg-gradient-to-br from-teal-50 to-blue-50 overflow-hidden">
        <img
          src={consult.specialistImage}
          alt={consult.doctorSpecialty}
          className="absolute bottom-0 right-4 h-24 w-24 object-contain"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        {/* Severity badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${severity.dot}`} />
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${severity.pill}`}>
            {consult.severity}
          </span>
        </div>

        {/* ✅ DELETE button — top-right corner of the image header */}
        <div
          className="absolute top-2 right-2"
          onClick={(e) => e.stopPropagation()}
        >
          {confirmDeleteId === consult.id ? (
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-1.5 py-1 shadow-sm">
              <button
                onClick={handleDelete}
                disabled={deletingId === consult.id}
                className="px-2 py-0.5 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Yes
              </button>
              <button
                onClick={cancelDelete}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={handleDelete}
              disabled={deletingId === consult.id}
              className="p-1.5 bg-white/80 backdrop-blur-sm rounded-lg text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100 disabled:opacity-50"
              title="Delete consultation"
            >
              {deletingId === consult.id
                ? <Loader2 className="h-3.5 w-3.5 animate-spin text-red-400" />
                : <Trash2 className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>


        
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
            {consult.type}
          </h3>
          <p className="text-xs text-teal-600 font-medium mt-0.5 truncate">
            {consult.doctorSpecialty}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(consult.date).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short',
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {consult.time}
          </span>
          {consult.messageCount > 0 && (
            <span className="flex items-center gap-1 text-teal-600 font-medium ml-auto">
              <MessageSquare className="w-3.5 h-3.5" />
              {consult.messageCount}
            </span>
          )}
        </div>

        {/* Resume button */}
        <button
          onClick={handleResume}
          disabled={isResuming}
          className="mt-auto w-full flex items-center justify-center gap-2 py-2 rounded-xl
                     bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs font-semibold
                     hover:from-teal-600 hover:to-teal-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 shadow-sm hover:shadow"
        >
          {isResuming ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...</>
          ) : (
            <><PlayCircle className="w-3.5 h-3.5" /> Resume Consultation</>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ConsultationCard;
