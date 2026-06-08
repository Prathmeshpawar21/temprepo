/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// Components/ConsultHistory/StatsSection.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle2, BookmarkCheck, AlertCircle, Target } from 'lucide-react';

const StatsSection = ({ showStats, stats }) => {
  const statsData = [
    { label: 'Total Visits', value: stats.total, icon: <FileText />, color: 'bg-purple-50', text: 'text-purple-600'},
    { label: 'Completed', value: stats.completed, icon: <CheckCircle2 />, color: 'bg-teal-50', text: 'text-teal-600'},
    { label: 'Bookmarked', value: stats.bookmarked, icon: <BookmarkCheck />, color: 'bg-orange-50', text: 'text-orange-600'},
    { label: 'Emergency', value: stats.emergency, icon: <AlertCircle />, color: 'bg-pink-50', text: 'text-pink-600'},
    { label: 'Avg Cost', value: `$${stats.avgCost}`, icon: <Target />, color: 'bg-indigo-50', text: 'text-indigo-600' },
  ];

  return (
    <AnimatePresence>
      {showStats && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-md"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4 ${stat.text} shadow-sm`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatsSection;
