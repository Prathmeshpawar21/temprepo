/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/Patient/components/BulkActions.jsx

import React, { useState } from 'react';
import { Trash2, X, CheckSquare, Square } from 'lucide-react';
import { motion } from 'framer-motion';

const BulkActions = ({ selectedCount, totalCount, onSelectAll, onClearSelection, onBulkDelete }) => {
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);

  const handleBulkDelete = (permanent) => {
    onBulkDelete(permanent);
    setShowDeleteOptions(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-teal-50 border border-teal-200 rounded-2xl p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onSelectAll}
            className="flex items-center gap-2 text-teal-700 hover:text-teal-800 font-medium transition-colors"
          >
            {selectedCount === totalCount ? (
              <CheckSquare className="h-5 w-5" />
            ) : (
              <Square className="h-5 w-5" />
            )}
            <span>
              {selectedCount === totalCount ? 'Deselect All' : 'Select All'}
            </span>
          </button>
          
          <div className="h-6 w-px bg-teal-300" />
          
          <span className="text-teal-700 font-semibold">
            {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>

        <div className="flex items-center gap-3">
          {showDeleteOptions ? (
            <>
              <button
                onClick={() => handleBulkDelete(false)}
                className="px-4 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all"
              >
                Soft Delete
              </button>
              <button
                onClick={() => handleBulkDelete(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all"
              >
                Permanent Delete
              </button>
              <button
                onClick={() => setShowDeleteOptions(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowDeleteOptions(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected
              </button>
              
              <button
                onClick={onClearSelection}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BulkActions;
