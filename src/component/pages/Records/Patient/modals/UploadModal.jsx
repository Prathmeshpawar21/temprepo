/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/Patient/modals/UploadModal.jsx

import React, { useState, useRef } from 'react';
import { X, Upload, File, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadModal = ({ isOpen, onClose, onUpload, availableCategories }) => {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({
    category: 'prescription',
    title: '',
  });
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);


// Change this array:
const categories = [
  { value: 'prescription', label: 'Prescription' },
  { value: 'lab_report', label: 'Lab Report' },              // ✅ FIXED
  { value: 'radiology', label: 'Radiology/Imaging' },        // ✅ FIXED
  { value: 'discharge_summary', label: 'Discharge Summary' }, // ✅ FIXED
  { value: 'vaccination_record', label: 'Vaccination Record' }, // ✅ FIXED
  { value: 'insurance_document', label: 'Insurance Document' }, // ✅ FIXED
  { value: 'other', label: 'Other' },
];

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFileSelect = (selectedFile) => {
    setError(null);

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File size must be less than 10MB');
      return;
    }

    const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();
    const validExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.doc', '.docx'];
    
    if (!validExtensions.includes(fileExtension)) {
      setError('Invalid file type. Please upload PDF, images, or Word documents');
      return;
    }

    setFile(selectedFile);
    
    // Auto-fill title if empty
    if (!metadata.title) {
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, '');
      setMetadata(prev => ({ ...prev, title: nameWithoutExt }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) handleFileSelect(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      const uploadMetadata = {
        category: metadata.category,
        title: metadata.title || file.name,
      };
      
      await onUpload(file, uploadMetadata);
      
      // Reset form
      setFile(null);
      setMetadata({
        category: 'prescription',
        title: '',
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-4"
          >
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Upload Medical Record</h2>
                {/* <p className="text-sm text-gray-600 mt-1">Add your medical documents securely</p> */}
              </div>
              <button
                onClick={onClose}
                disabled={uploading}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpload} className="p-6 space-y-5">
              
              {/* File Drop Zone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Document File *
                </label>
                
                {!file ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                      transition-all duration-200
                      ${isDragging 
                        ? 'border-teal-500 bg-teal-50 scale-105' 
                        : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-700 font-semibold mb-2">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, Images (JPG, PNG), Word (Max: 10MB)
                    </p>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileInputChange}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,image/*"
                      className="hidden"
                    />
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="border-2 border-teal-300 bg-teal-50 rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                          <File className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{file.name}</p>
                          <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                        </div>
                        <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0" />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        disabled={uploading}
                        className="ml-3 p-2 hover:bg-red-100 rounded-xl transition-colors"
                      >
                        <X className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={metadata.category}
                  onChange={(e) => setMetadata(prev => ({ ...prev, category: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 font-medium"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Document Title
                </label>
                <input
                  type="text"
                  value={metadata.title}
                  onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="E.g., Blood Test Results"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={uploading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!file || uploading}
                  className="flex-1 px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload Document
                    </>
                  )}
                </button>
              </div>

            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;
