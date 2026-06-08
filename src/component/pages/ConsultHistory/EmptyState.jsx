/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// Components/ConsultHistory/EmptyState.jsx
import React from 'react';
import { Search } from 'lucide-react';

const EmptyState = ({ resetFilters }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <div className="p-12 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No consultations found</h3>
        <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default EmptyState;
