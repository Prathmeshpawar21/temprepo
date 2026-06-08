/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/Doctor/DoctorUploadModal.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  AlertCircle, 
  Calendar,
  FileText,
  Stethoscope,
  Pill,
  Heart,
  Activity,
  User,
  CheckCircle
} from 'lucide-react';
import { recordCategories, formatFileSize } from '../shared/recordsUtils.jsx';

const DoctorUploadModal = ({
  showUploadModal,
  setShowUploadModal,
  uploadForm,
  setUploadForm,
  uploadRecord,
  resetUploadForm,
  setError,
  selectedPatient
}) => {
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (uploadForm.files.length === 0) {
      setError('Please select at least one file to upload');
      return;
    }
    
    try {
      const formData = new FormData();
      
      Object.keys(uploadForm).forEach(key => {
        if (key === 'files') {
          uploadForm.files.forEach(file => formData.append('files', file));
        } else if (key === 'tags') {
          formData.append('tags', JSON.stringify(uploadForm.tags));
        } else {
          formData.append(key, uploadForm[key]);
        }
      });
      
      await uploadRecord(formData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadForm(prev => ({ ...prev, files }));
  };

  const removeFile = (indexToRemove) => {
    setUploadForm(prev => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove)
    }));
  };

  return (
    <AnimatePresence>
      {showUploadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Add Medical Record
                    </h2>
                    <p className="text-gray-600 mt-1">
                      For patient: <span className="font-semibold">{selectedPatient?.name}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    resetUploadForm();
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Patient Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-semibold text-blue-900">
                        {selectedPatient?.name}
                      </span>
                      <span className="text-sm text-blue-700">
                        {selectedPatient?.age} years • {selectedPatient?.gender}
                      </span>
                      <span className="text-sm text-blue-700">
                        Condition: {selectedPatient?.condition}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Record Title *
                    </label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Post-Surgery Follow-up"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    >
                      <option value="">Select category...</option>
                      {recordCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide details about this medical record..."
                    rows={3}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Clinical Information */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Clinical Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Diagnosis
                      </label>
                      <input
                        type="text"
                        value={uploadForm.diagnosis}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                        placeholder="e.g., Acute Bronchitis"
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Treatment Plan
                      </label>
                      <input
                        type="text"
                        value={uploadForm.treatment}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, treatment: e.target.value }))}
                        placeholder="e.g., Antibiotics + Rest"
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Clinical Notes
                    </label>
                    <textarea
                      value={uploadForm.notes}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add clinical observations, recommendations, or follow-up instructions..."
                      rows={3}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Follow-up and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      value={uploadForm.followUpDate}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, followUpDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={uploadForm.tags.join(', ')}
                      onChange={(e) => setUploadForm(prev => ({ 
                        ...prev, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                      }))}
                      placeholder="e.g., follow-up, x-ray, medication"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Files *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-500 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.dicom"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload-doctor"
                    />
                    <label htmlFor="file-upload-doctor" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Click to upload medical documents
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF, JPEG, PNG, DOC, DOCX, DICOM up to 10MB each
                      </p>
                    </label>
                    
                    {uploadForm.files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadForm.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <div className="p-2 bg-teal-100 rounded-lg">
                                <FileText className="h-4 w-4 text-teal-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-700 font-medium truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Urgent Checkbox */}
                <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <input
                    type="checkbox"
                    id="urgent"
                    checked={uploadForm.isUrgent}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, isUrgent: e.target.checked }))}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500 mt-1"
                  />
                  <label htmlFor="urgent" className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-2 mb-1">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-semibold text-red-900">Mark as Urgent</span>
                    </div>
                    <p className="text-xs text-red-700">
                      This record requires immediate attention and will be flagged in the patient's records
                    </p>
                  </label>
                </div>

                {/* Upload Summary */}
                {uploadForm.title && uploadForm.category && uploadForm.files.length > 0 && (
                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-teal-900 mb-2">Record Summary</h4>
                        <div className="text-sm text-teal-800 space-y-1">
                          <p><span className="font-medium">Patient:</span> {selectedPatient?.name}</p>
                          <p><span className="font-medium">Title:</span> {uploadForm.title}</p>
                          <p><span className="font-medium">Category:</span> {recordCategories.find(c => c.id === uploadForm.category)?.label}</p>
                          <p><span className="font-medium">Files:</span> {uploadForm.files.length} file(s)</p>
                          {uploadForm.diagnosis && (
                            <p><span className="font-medium">Diagnosis:</span> {uploadForm.diagnosis}</p>
                          )}
                          {uploadForm.treatment && (
                            <p><span className="font-medium">Treatment:</span> {uploadForm.treatment}</p>
                          )}
                          {uploadForm.followUpDate && (
                            <p><span className="font-medium">Follow-up:</span> {new Date(uploadForm.followUpDate).toLocaleDateString()}</p>
                          )}
                          {uploadForm.tags.length > 0 && (
                            <p><span className="font-medium">Tags:</span> {uploadForm.tags.join(', ')}</p>
                          )}
                          {uploadForm.isUrgent && (
                            <p className="text-red-700 font-semibold">Marked as Urgent</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false);
                      resetUploadForm();
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!uploadForm.title || !uploadForm.category || uploadForm.files.length === 0}
                    className="flex-1 px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center space-x-2"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Add Medical Record</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DoctorUploadModal;
