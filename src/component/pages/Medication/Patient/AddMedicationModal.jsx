/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Medication/Patient/AddMedicationModal.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pill, AlertCircle, Loader2 } from 'lucide-react';

const AddMedicationModal = ({
  showAddModal,
  setShowAddModal,
  newMedication,
  setNewMedication,
  addMedication,
  resetForm,
  setError
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    
    // ✅ Validation
    if (!newMedication.name && !newMedication.genericName) {
      setValidationError('Please provide either brand name or generic name');
      return;
    }
    
    if (!newMedication.strength) {
      setValidationError('Please provide medication strength');
      return;
    }
    
    if (!newMedication.frequency) {
      setValidationError('Please select frequency');
      return;
    }

    setSubmitting(true);
    
    try {
      await addMedication(newMedication);
      // Modal will close from parent component
    } catch (err) {
      setValidationError(err.message || 'Failed to add medication');
      setError && setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setShowAddModal(false);
      resetForm();
      setValidationError('');
    }
  };

  return (
    <AnimatePresence>
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center">
                    <Pill className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Add Medication
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Add a medication to your list
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={submitting}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 disabled:opacity-50"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* ✅ Validation Error */}
              {validationError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3"
                >
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{validationError}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* ✅ Medication Names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={newMedication.name}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Crocin, Dolo"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      disabled={submitting}
                    />
                    <p className="text-xs text-gray-500 mt-1">Trade/commercial name</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Generic Name
                    </label>
                    <input
                      type="text"
                      value={newMedication.genericName}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, genericName: e.target.value }))}
                      placeholder="e.g., Paracetamol"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      disabled={submitting}
                    />
                    <p className="text-xs text-gray-500 mt-1">Chemical/active ingredient name</p>
                  </div>
                </div>

                {/* ✅ Dosage Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Strength/Dosage *
                    </label>
                    <input
                      type="text"
                      value={newMedication.strength}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, strength: e.target.value }))}
                      placeholder="e.g., 500mg, 10ml, 5mg/ml"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Dosage Form
                    </label>
                    <input
                      type="text"
                      value={newMedication.dosage}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                      placeholder="e.g., tablet, syrup, capsule"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      disabled={submitting}
                    />
                  </div>
                </div>

                {/* ✅ Frequency & Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Frequency *
                    </label>
                    <select
                      value={newMedication.frequency}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                      disabled={submitting}
                    >
                      <option value="">Select frequency</option>
                      <option value="once daily">Once daily (1-0-0)</option>
                      <option value="twice daily">Twice daily (1-0-1)</option>
                      <option value="three times daily">Three times daily (1-1-1)</option>
                      <option value="four times daily">Four times daily</option>
                      <option value="every 6 hours">Every 6 hours</option>
                      <option value="every 8 hours">Every 8 hours</option>
                      <option value="every 12 hours">Every 12 hours</option>
                      <option value="as needed">As needed (PRN)</option>
                      <option value="before meals">Before meals</option>
                      <option value="after meals">After meals</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={newMedication.duration}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 7 days, 2 weeks, Long-term"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      disabled={submitting}
                    />
                  </div>
                </div>

                {/* ✅ Start Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newMedication.startDate}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={submitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to use today's date</p>
                </div>

                {/* ✅ Instructions */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instructions
                  </label>
                  <textarea
                    value={newMedication.instructions}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, instructions: e.target.value }))}
                    placeholder="e.g., Take with food, Take on empty stomach, Avoid alcohol"
                    rows={3}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={submitting}
                  />
                </div>

                {/* ✅ Prescriber Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Prescribed By
                    </label>
                    <input
                      type="text"
                      value={newMedication.prescribedBy}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, prescribedBy: e.target.value }))}
                      placeholder="e.g., Dr. Sharma"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Hospital/Clinic
                    </label>
                    <input
                      type="text"
                      value={newMedication.prescribedByHospital}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, prescribedByHospital: e.target.value }))}
                      placeholder="e.g., Mumbai General Hospital"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      disabled={submitting}
                    />
                  </div>
                </div>

                {/* ✅ Additional Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={newMedication.notes}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional information..."
                    rows={3}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={submitting}
                  />
                </div>

                {/* ✅ Submit Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={submitting}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || (!newMedication.name && !newMedication.genericName) || !newMedication.strength || !newMedication.frequency}
                    className="flex-1 px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center space-x-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <span>Add Medication</span>
                    )}
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

export default AddMedicationModal;
