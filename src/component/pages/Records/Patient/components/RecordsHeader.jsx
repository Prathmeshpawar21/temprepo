/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/Patient/components/RecordsHeader.jsx

import React from 'react';
import { FileText, RefreshCw, Clock, Calendar, Plus, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';

const RecordsHeader = ({ currentTime, healthStatus, onRefresh, isRefreshing, onUploadClick }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
    >
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center shadow-md">
          <FileText className="h-8 w-8 text-teal-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Medical Records
          </h1>
          {/* <p className="text-gray-600 mt-1">
            Access and manage your complete medical history
          </p> */}
        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
                        {/* ✅ IST 12hr format */}
              {currentTime.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata'
              })}
            </span>


              <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {/* ✅ Indian date format */}
              {currentTime.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                timeZone: 'Asia/Kolkata'
              })}
            </span>

            {/* <span className={`flex items-center ${
              healthStatus === 'healthy' ? 'text-green-600' : 
              healthStatus === 'error' ? 'text-red-600' : 
              'text-gray-400'
            }`}>
              {healthStatus === 'healthy' ? (
                <Wifi className="h-4 w-4 mr-1" />
              ) : (
                <WifiOff className="h-4 w-4 mr-1" />
              )}
              {healthStatus === 'healthy' ? 'Connected' : 
               healthStatus === 'error' ? 'Offline' : 
               'Checking...'}
            </span> */}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`h-5 w-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
        
        <button
          onClick={onUploadClick}
          className="flex items-center space-x-2 px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all shadow-md"
        >
          <Plus className="h-5 w-5" />
          <span>Upload</span>
        </button>
      </div>
    </motion.header>
  );
};

export default RecordsHeader;
