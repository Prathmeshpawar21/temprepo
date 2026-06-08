/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/ConsultHistory/SearchAndControls.jsx
import React from 'react';
import { Search, Grid, List, ArrowUpDown } from 'lucide-react';

const SearchAndControls = ({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder
}) => {
  return (
    <div className="flex flex-1 items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search consultations, doctors, symptoms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* View Toggle */}
      <div className="flex bg-white border border-gray-200 rounded-xl p-1">
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded-lg transition-all ${
            viewMode === 'list'
              ? 'bg-teal-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <List className="h-5 w-5" />
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded-lg transition-all ${
            viewMode === 'grid'
              ? 'bg-teal-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Grid className="h-5 w-5" />
        </button>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2">
        {/* <ArrowUpDown className="h-4 w-4 text-gray-600" /> */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-transparent text-gray-700 text-sm font-medium outline-none cursor-pointer"
        >
          <option value="date">Date</option>
          <option value="doctor">Doctor</option>
          <option value="type">Type</option>
          <option value="severity">Severity</option>
        </select>
        {/* <button
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="text-gray-600 hover:text-gray-800"
        >
          {sortOrder === 'desc' ? '↓' : '↑'}
        </button> */}
      </div>
    </div>
  );
};

export default SearchAndControls;
