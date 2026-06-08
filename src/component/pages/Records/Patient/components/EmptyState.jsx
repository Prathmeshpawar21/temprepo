/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/Patient/components/EmptyState.jsx

import React from 'react';
import { FileText, Upload } from 'lucide-react';

const EmptyState = ({ onUploadClick }) => {
  return (
    <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-200">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-gray-300" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No records found</h3>
        
        <p className="text-gray-600 mb-6">
          You don't have any medical records yet. Upload your first document to get started.
        </p>
        
        <button
          onClick={onUploadClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all shadow-lg hover:shadow-xl"
        >
          <Upload className="w-5 h-5" />
          Upload Your First Record
        </button>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Supported formats: PDF, Images (JPG, PNG), Word documents
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
