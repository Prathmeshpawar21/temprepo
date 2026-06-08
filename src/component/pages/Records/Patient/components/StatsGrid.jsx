/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/Patient/components/StatsGrid.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Pill, 
  FlaskConical, 
  Activity, 
  Syringe,
  Shield,
  TrendingUp 
} from 'lucide-react';

const StatsGrid = ({ statistics }) => {
  if (!statistics) return null;

  const stats = [
    { 
      label: 'Total', 
      value: statistics.total_documents || 0, 
      icon: <FileText />, 
      color: 'bg-purple-50', 
      text: 'text-purple-600'
    },
    { 
      label: 'Prescriptions', 
      value: statistics.category_breakdown?.find(c => c.category === 'prescription')?.count || 0, 
      icon: <Pill />, 
      color: 'bg-blue-50', 
      text: 'text-blue-600'
    },
    { 
      label: 'Lab Reports', // ✅ FIXED label
      value: statistics.category_breakdown?.find(c => c.category === 'lab_report')?.count || 0, // ✅ FIXED
      icon: <FlaskConical />, 
      color: 'bg-purple-50', 
      text: 'text-purple-600'
    },
    { 
      label: 'Radiology', // ✅ FIXED label
      value: statistics.category_breakdown?.find(c => c.category === 'radiology')?.count || 0, // ✅ FIXED
      icon: <Activity />, 
      color: 'bg-green-50', 
      text: 'text-green-600'
    },
    { 
      label: 'Vaccinations', 
      value: statistics.category_breakdown?.find(c => c.category === 'vaccination_record')?.count || 0, // ✅ FIXED
      icon: <Syringe />, 
      color: 'bg-pink-50', 
      text: 'text-pink-600'
    },
    { 
      label: 'Insurance', // ✅ ADDED
      value: statistics.category_breakdown?.find(c => c.category === 'insurance_document')?.count || 0, 
      icon: <Shield />, 
      color: 'bg-yellow-50', 
      text: 'text-yellow-600'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl p-5 border border-gray-200 shadow hover:shadow-md transition-all cursor-pointer group"
        >
          <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-3 ${stat.text} shadow group-hover:scale-110 transition-transform`}>
            {stat.icon}
          </div>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          <p className="text-sm text-gray-600">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsGrid;
