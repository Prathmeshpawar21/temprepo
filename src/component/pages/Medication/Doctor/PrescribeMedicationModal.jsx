/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Medication/Doctor/PrescribeMedicationModal.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Stethoscope, AlertTriangle, FileText } from 'lucide-react';

const PrescribeMedicationModal = ({
  showPrescribeModal,
  setShowPrescribeModal,
  newPrescription,
  setNewPrescription,
  prescribeMedication,
  resetForm,
  setError,
  patients = []
}) => {
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPrescription.patientId) {
      setError('Please select a patient');
      return;
    }
    
    try {
      // Get patient details
      const selectedPatient = patients.find(p => p.id === parseInt(newPrescription.patientId));
      
      const prescriptionData = {
        ...newPrescription,
        patientName: selectedPatient?.name,
        patientAge: selectedPatient?.age,
        patientGender: selectedPatient?.gender
      };
      
      await prescribeMedication(prescriptionData);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AnimatePresence>
      {showPrescribeModal && (
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
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Prescribe Medication
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Create a new prescription for your patient
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPrescribeModal(false);
                    resetForm();
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Patient Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Patient *
                  </label>
                  <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-2xl p-4">
                    {patients.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No patients available</p>
                      </div>
                    ) : (
                      patients.map((patient) => (
                        <div
                          key={patient.id}
                          onClick={() => setNewPrescription(prev => ({ ...prev, patientId: patient.id.toString() }))}
                          className={`p-4 border rounded-2xl cursor-pointer transition-all ${
                            newPrescription.patientId === patient.id.toString()
                              ? 'border-emerald-500 bg-emerald-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                              newPrescription.patientId === patient.id.toString()
                                ? 'bg-emerald-500'
                                : 'bg-gray-200'
                            }`}>
                              <User className={`h-6 w-6 ${
                                newPrescription.patientId === patient.id.toString()
                                  ? 'text-white'
                                  : 'text-gray-500'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                              <p className="text-sm text-gray-600">{patient.age} years • {patient.gender}</p>
                              <p className="text-xs text-gray-500">Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</p>
                            </div>
                            {newPrescription.patientId === patient.id.toString() && (
                              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Medication Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Medication Name *
                    </label>
                    <input
                      type="text"
                      value={newPrescription.name}
                      onChange={(e) => setNewPrescription(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Metformin"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Generic Name
                    </label>
                    <input
                      type="text"
                      value={newPrescription.genericName}
                      onChange={(e) => setNewPrescription(prev => ({ ...prev, genericName: e.target.value }))}
                      placeholder="e.g., Metformin Hydrochloride"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Strength/Dosage *
                    </label>
                    <input
                      type="text"
                      value={newPrescription.strength}
                      onChange={(e) => setNewPrescription(prev => ({ ...prev, strength: e.target.value }))}
                      placeholder="e.g., 500mg"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Frequency *
                    </label>
                    <select
                      value={newPrescription.frequency}
                      onChange={(e) => setNewPrescription(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      <option value="">Select frequency</option>
                      <option value="once-daily">Once daily</option>
                      <option value="twice-daily">Twice daily</option>
                      <option value="three-times-daily">Three times daily</option>
                      <option value="four-times-daily">Four times daily</option>
                      <option value="as-needed">As needed</option>
                      <option value="every-8-hours">Every 8 hours</option>
                      <option value="every-12-hours">Every 12 hours</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={newPrescription.duration}
                      onChange={(e) => setNewPrescription(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 7 days, 2 weeks, 3 months, Long-term"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={newPrescription.startDate}
                      onChange={(e) => setNewPrescription(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instructions *
                  </label>
                  <textarea
                    value={newPrescription.instructions}
                    onChange={(e) => setNewPrescription(prev => ({ ...prev, instructions: e.target.value }))}
                    placeholder="e.g., Take with food, Take on empty stomach, Take before bedtime, etc."
                    rows={3}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* Warnings & Side Effects */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                      Warnings
                    </label>
                    <textarea
                      value={newPrescription.warnings.join(', ')}
                      onChange={(e) => setNewPrescription(prev => ({ 
                        ...prev, 
                        warnings: e.target.value.split(',').map(w => w.trim()).filter(w => w)
                      }))}
                      placeholder="Enter warnings separated by commas"
                      rows={3}
                      className="w-full p-3 border border-amber-200 bg-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <p className="text-xs text-amber-600 mt-1">Important precautions and contraindications</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FileText className="h-4 w-4 text-red-600 mr-2" />
                      Side Effects
                    </label>
                    <textarea
                      value={newPrescription.sideEffects.join(', ')}
                      onChange={(e) => setNewPrescription(prev => ({ 
                        ...prev, 
                        sideEffects: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      }))}
                      placeholder="Enter side effects separated by commas"
                      rows={3}
                      className="w-full p-3 border border-red-200 bg-red-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <p className="text-xs text-red-600 mt-1">Common and serious adverse reactions</p>
                  </div>
                </div>

                {/* Drug Interactions */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Drug Interactions (Optional)
                  </label>
                  <textarea
                    value={newPrescription.interactions?.join(', ') || ''}
                    onChange={(e) => setNewPrescription(prev => ({ 
                      ...prev, 
                      interactions: e.target.value.split(',').map(i => i.trim()).filter(i => i)
                    }))}
                    placeholder="Enter drug interactions separated by commas (e.g., Warfarin, NSAIDs, etc.)"
                    rows={2}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes for Patient
                  </label>
                  <textarea
                    value={newPrescription.notes}
                    onChange={(e) => setNewPrescription(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional information, follow-up instructions, or special considerations..."
                    rows={3}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Prescription Summary Preview */}
                {newPrescription.name && newPrescription.patientId && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <h4 className="font-semibold text-emerald-900 mb-2">Prescription Summary</h4>
                    <div className="text-sm text-emerald-800 space-y-1">
                      <p><span className="font-medium">Patient:</span> {patients.find(p => p.id === parseInt(newPrescription.patientId))?.name}</p>
                      <p><span className="font-medium">Medication:</span> {newPrescription.name} {newPrescription.strength}</p>
                      <p><span className="font-medium">Dosage:</span> {newPrescription.frequency} for {newPrescription.duration}</p>
                      {newPrescription.instructions && (
                        <p><span className="font-medium">Instructions:</span> {newPrescription.instructions}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPrescribeModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newPrescription.patientId || !newPrescription.name || !newPrescription.strength || !newPrescription.frequency || !newPrescription.instructions}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Prescribe & Send to Patient
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

export default PrescribeMedicationModal;
