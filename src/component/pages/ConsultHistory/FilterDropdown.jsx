/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/ConsultHistory/FilterDropdown.jsx
import React from 'react';
import { Filter, X } from 'lucide-react';

const FilterDropdown = ({
  filterOpen,
  setFilterOpen,
  filters,
  handleFilterChange,
  resetFilters,
  selectedTags,
  setSelectedTags,
  allTags,
  dateRanges
}) => {
  return (
    <div className="relative">
      <button
        onClick={() => setFilterOpen(!filterOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
      >
        <Filter className="h-5 w-5 text-gray-600" />
        <span className="font-medium text-gray-700">Filters</span>
        {(filters.status !== 'All statuses' || filters.severity !== 'All severities' || selectedTags.length > 0) && (
          <span className="ml-1 px-2 py-0.5 bg-teal-500 text-white text-xs rounded-full">
            {(filters.status !== 'All statuses' ? 1 : 0) +
              (filters.severity !== 'All severities' ? 1 : 0) +
              selectedTags.length}
          </span>
        )}
      </button>

      {filterOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            <button
              onClick={() => setFilterOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={filters.dateRangeDays || ''}
                onChange={(e) => handleFilterChange('dateRangeDays', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {dateRanges.map((range) => (
                  <option key={range.label} value={range.value || ''}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="All statuses">All statuses</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <select
                value={filters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="All severities">All severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (selectedTags.includes(tag)) {
                          setSelectedTags(selectedTags.filter(t => t !== tag));
                        } else {
                          setSelectedTags([...selectedTags, tag]);
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-xs transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={() => {
                resetFilters();
                setFilterOpen(false);
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
