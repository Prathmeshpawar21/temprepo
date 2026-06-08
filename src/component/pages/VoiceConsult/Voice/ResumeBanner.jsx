/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/VoiceConsult/Voice/ResumeBanner.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { History, Calendar, MessageSquare, X } from 'lucide-react';

/**
 * ResumeBanner
 * Shown at the top of the voice session when continuing a prior consultation.
 *
 * Props:
 *   summary  — { date, chief_complaint, specialist_name, message_count, severity }
 *   onDismiss — hide the banner
 */
const ResumeBanner = ({ summary, onDismiss }) => {
  if (!summary) return null;

  const formattedDate = summary.date
    ? new Date(summary.date).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{   opacity: 0, y: -12 }}
      className="
        w-full px-4 py-3 rounded-xl
        bg-gradient-to-r from-teal-50 to-blue-50
        border border-teal-200
        flex items-start gap-3
      "
    >
      {/* Icon */}
      <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0 mt-0.5">
        <History className="w-4 h-4 text-teal-600" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-0.5">
          Continuing previous consultation
        </p>

        {/* {summary.chief_complaint && (
          <p className="text-sm font-medium text-gray-900 truncate">
            {summary.chief_complaint}
          </p>
        )} */}

        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
          {/* {formattedDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
          )} */}
          {/* {summary.message_count > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {summary.message_count} prior messages
            </span>
          )} */}
          {summary.specialist_name && (
            <span className="text-teal-600 font-medium">
              {summary.specialist_name}
            </span>
          )}
        </div>
      </div>

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default ResumeBanner;
