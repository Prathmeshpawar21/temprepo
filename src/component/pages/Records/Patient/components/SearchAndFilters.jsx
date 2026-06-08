/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/Patient/components/SearchAndFilters.jsx

import React from 'react';
import { Search, BarChart3, Activity, ArrowUpDown, SlidersHorizontal, X } from 'lucide-react';
import { DOCUMENT_CATEGORIES } from '../../shared/constants';

const SearchAndFilters = ({ 
  filters, 
  onFiltersChange, 
  onReset, 
  viewMode, 
  onViewModeChange,
  availableCategories 
}) => {
  const hasActiveFilters = filters.category || filters.date_from || filters.date_to || (filters.tags?.length > 0);

  // ✅ FIXED: Use availableCategories from backend or fallback to constants
  const categories = availableCategories?.length > 0 
    ? availableCategories 
    : Object.keys(DOCUMENT_CATEGORIES);

  return (
    <div className="space-y-4">
      {/* Main Search Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Left: Search + View Toggle */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={filters.query || ''}
              onChange={(e) => onFiltersChange({ query: e.target.value })}
              placeholder="Search your records..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
          
          <div className="flex bg-white rounded-2xl p-1 border border-gray-200">
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-xl transition-colors ${
                viewMode === 'list' 
                  ? 'bg-teal-100 text-teal-700 shadow' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Activity className="h-5 w-5" />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-xl transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-teal-100 text-teal-700 shadow' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Right: Sort + Filters */}
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2">
            <select
              value={filters.sort_by || 'created_at'}
              onChange={(e) => onFiltersChange({ sort_by: e.target.value })}
              className="bg-transparent text-gray-700 text-sm font-medium outline-none cursor-pointer"
            >
              <option value="created_at">Upload Date</option>
              <option value="title">Title</option>
              <option value="category">Category</option>
              <option value="file_size">File Size</option>
            </select>
            {/* <button
              onClick={() => onFiltersChange({ 
                sort_order: filters.sort_order === 'asc' ? 'desc' : 'asc' 
              })}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              {filters.sort_order === 'asc' ? '↑' : '↓'}
            </button> */}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2.5 border border-red-300 bg-red-50 text-red-700 rounded-xl font-medium hover:bg-red-100 transition-all"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex bg-white rounded-2xl p-1 border border-gray-200 overflow-x-auto">
        {/* All button */}
        <button
          onClick={() => onFiltersChange({ category: null })}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize whitespace-nowrap ${
            !filters.category
              ? 'bg-teal-100 text-teal-700 shadow' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All
        </button>
        
        {/* ✅ FIXED: Dynamic categories from backend */}
        {categories.map((cat) => {
          const categoryConfig = DOCUMENT_CATEGORIES[cat];
          const label = categoryConfig?.label || cat.replace('_', ' ');
          
          return (
            <button
              key={cat}
              onClick={() => onFiltersChange({ category: cat })}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize whitespace-nowrap ${
                filters.category === cat
                  ? 'bg-teal-100 text-teal-700 shadow' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchAndFilters;
