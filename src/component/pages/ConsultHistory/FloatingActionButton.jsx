/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/ConsultHistory/FloatingActionButton.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Mic, X } from 'lucide-react';

/**
 * FloatingActionButton
 *
 * Two actions:
 *   1. New AI Chat Consultation  → /new-consult
 *   2. New Voice Consultation    → /new-consult
 *
 * Tap the main + button to expand/collapse the two options.
 */
const FloatingActionButton = ({ navigate }) => {
  const [open, setOpen] = useState(false);

  const actions = [
    {
      label:   'New Voice Consult',
      icon:    <Mic className="w-4 h-4" />,
      color:   'bg-purple-500 hover:bg-purple-600',
      ring:    'ring-purple-200',
      onClick: () => {
        setOpen(false);
        navigate('/new-consult');
      },
    },
    // {
    //   label:   'New AI Chat',
    //   icon:    <MessageSquare className="w-4 h-4" />,
    //   color:   'bg-teal-500 hover:bg-teal-600',
    //   ring:    'ring-teal-200',
    //   onClick: () => {
    //     setOpen(false);
    //     navigate('/new-consult');
    //   },
    // },
  ];

  return (
    <div className="fixed bottom-8 right-6 z-50 flex flex-col items-end gap-3">

      {/* ── Expanded action buttons ─────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {actions.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 12, scale: 0.85 }}
                animate={{ opacity: 1, y: 0,  scale: 1    }}
                exit={{    opacity: 0, y: 12, scale: 0.85 }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 22 }}
                className="flex items-center gap-2"
              >
                {/* Label tooltip */}
                <span className="
                  px-3 py-1.5 rounded-lg text-xs font-semibold
                  bg-gray-900 text-white shadow-lg
                  whitespace-nowrap
                ">
                  {action.label}
                </span>

                {/* Icon button */}
                <button
                  onClick={action.onClick}
                  className={`
                    w-11 h-11 rounded-full text-white shadow-lg
                    flex items-center justify-center
                    ring-4 ${action.ring}
                    transition-all duration-200
                    ${action.color}
                  `}
                >
                  {action.icon}
                </button>


              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* ── Main FAB ────────────────────────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        whileTap={{ scale: 0.92 }}
        className="
          w-14 h-14 rounded-full shadow-xl
          bg-gradient-to-br from-teal-500 to-teal-600
          text-white flex items-center justify-center
          
          transition-all duration-200
          hover:from-teal-600 hover:to-teal-700
          hover:shadow-2xl
        "
        title={open ? 'Close' : 'New Consultation'}
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {open
            ? <X    className="w-6 h-6" />
            : <Plus className="w-6 h-6" />
          }
        </motion.div>
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;
