/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Profile/shared/StatsCards.jsx

import React from 'react';
import { motion } from 'framer-motion';

const StatsCards = ({ stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all cursor-pointer group"
        >
          <div
            className={`w-12 h-12 ${stat.accent} rounded-xl flex items-center justify-center mb-4 ${stat.text} shadow-md group-hover:scale-110 transition-transform`}
          >
            {stat.icon}
          </div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            {stat.change && (
              <span className="text-sm text-green-600 font-medium">{stat.change}</span>
            )}
          </div>
          <p className="text-sm text-gray-600">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsCards;
