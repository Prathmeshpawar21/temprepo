/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/ConsultHistory/ConsultHistoryHeader.jsx
import React from 'react';
import { RefreshCw, Sun, Moon, BarChart3 } from 'lucide-react';

const ConsultHistoryHeader = ({ 
  currentTime, 
  isDarkMode, 
  setIsDarkMode, 
  showStats, 
  setShowStats,
  onRefresh,
  loading 
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Consultation History</h1>
        {/* <p className="text-gray-600 mt-1">
          View and manage your past AI medical consultations
        </p> */}
        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">


        <span>
            {currentTime.toLocaleDateString('en-IN', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              timeZone: 'Asia/Kolkata'
            })}
          </span>


        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`h-5 w-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
        
        {/* <button
          onClick={() => setShowStats(!showStats)}
          className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          title="Toggle Stats"
        >
          <BarChart3 className="h-5 w-5 text-gray-600" />
        </button>
         */}
         
        {/* <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          title="Toggle Theme"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </button> */}
      </div>
    </div>
  );
};

export default ConsultHistoryHeader;
