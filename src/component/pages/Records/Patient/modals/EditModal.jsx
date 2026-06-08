/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/Patient/modals/EditModal.jsx

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Calendar, Tag, User, Building2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EditModal = ({ isOpen, document, onClose, onUpdate, availableCategories }) => {
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    notes: '',
    tags: '',
    doctor_name: '',
    hospital_name: '',
    document_date: '',
  });
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (document) {
      setFormData({
        category: document.category || '',
        title: document.title || '',
        notes: document.notes || '',
        tags: document.tags ? document.tags.join(', ') : '',
        doctor_name: document.doctor_name || '',
        hospital_name: document.hospital_name || '',
        document_date: document.document_date ? document.document_date.split('T')[0] : '',
      });
    }
  }, [document]);

  // const categories = [
  //   { value: 'prescription', label: 'Prescription' },
  //   { value: 'test_result', label: 'Test Result' },
  //   { value: 'imaging', label: 'Medical Imaging' },
  //   { value: 'report', label: 'Medical Report' },
  //   { value: 'vaccination', label: 'Vaccination Record' },
  //   { value: 'insurance', label: 'Insurance Document' },
  //   { value: 'emergency', label: 'Emergency Record' },
  //   { value: 'other', label: 'Other' },
  // ];

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



  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);

    try {
      const updateData = {
        category: formData.category,
        title: formData.title || undefined,
        notes: formData.notes || undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
        doctor_name: formData.doctor_name || undefined,
        hospital_name: formData.hospital_name || undefined,
        document_date: formData.document_date || undefined,
      };

      await onUpdate(document.id, updateData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update document');
    } finally {
      setUpdating(false);
    }
  };

  if (!document) return null;

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
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Document</h2>
                {/* <p className="text-sm text-gray-600 mt-1">Update document information</p> */}
              </div>
              <button
                onClick={onClose}
                disabled={updating}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Document Info Banner */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center shadow">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{document.original_filename}</p>
                    <p className="text-sm text-gray-600">
                      {document.file_extension?.toUpperCase()} • {Math.round(document.file_size / 1024)} KB
                    </p>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
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
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="E.g., Blood Test Results"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Doctor Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    value={formData.doctor_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, doctor_name: e.target.value }))}
                    placeholder="Dr. John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Hospital Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Hospital/Clinic Name
                  </label>
                  <input
                    type="text"
                    value={formData.hospital_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, hospital_name: e.target.value }))}
                    placeholder="City Hospital"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Document Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Document Date
                  </label>
                  <input
                    type="date"
                    value={formData.document_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, document_date: e.target.value }))}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="urgent, follow-up, chronic"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {/* <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p> */}
                </div>
              </div>

              {/* Notes - Full Width */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional notes about this document..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={updating}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
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

export default EditModal;
