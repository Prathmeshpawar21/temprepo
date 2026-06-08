/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Medication/Doctor/DoctorMedicationDetailsModal.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Pill, 
  Calendar, 
  Clock, 
  Bell,
  AlertTriangle,
  AlertCircle,
  XCircle,
  Share2,
  Download,
  User,
  Edit,
  TrendingUp,
  FileText,
  Phone,
  Mail,
  MessageSquare,
  Activity,
  CheckCircle2
} from 'lucide-react';

const DoctorMedicationDetailsModal = ({
  showDetails,
  setShowDetails,
  selectedMedication,
  getStatusColor,
  getStatusIcon,
  getAdherenceColor,
  updateMedication,
  discontinueMedication,
  isDoctor = true
}) => {
  
  if (!selectedMedication) return null;

  const handleEdit = () => {
    // TODO: Implement edit functionality
    alert('Edit functionality - Open edit modal');
  };

  const handleDiscontinue = () => {
    if (window.confirm(`Are you sure you want to discontinue ${selectedMedication.name} for ${selectedMedication.patientName}?`)) {
      const reason = prompt('Please enter the reason for discontinuing:');
      if (reason) {
        discontinueMedication(selectedMedication.id, reason);
        setShowDetails(false);
      }
    }
  };

  const handleContactPatient = (method) => {
    // TODO: Implement contact functionality
    alert(`Contact patient via ${method}`);
  };

  const handleViewPatientHistory = () => {
    // TODO: Navigate to patient medication history
    alert('View patient medication history');
  };

  return (
    <AnimatePresence>
      {showDetails && (
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
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Pill className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedMedication.name}</h2>
                    <p className="text-gray-600">{selectedMedication.genericName}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedMedication.status)}`}>
                        {getStatusIcon(selectedMedication.status)}
                        <span className="ml-2 capitalize">{selectedMedication.status}</span>
                      </span>
                      {selectedMedication.adherence !== undefined && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedMedication.adherence >= 90 ? 'bg-green-50 text-green-700 border border-green-200' :
                          selectedMedication.adherence >= 70 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                          'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          <TrendingUp className="h-3 w-3 inline mr-1" />
                          {selectedMedication.adherence}% Adherence
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Patient Information Card */}
              <div className="mb-6 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-md">
                      <User className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-emerald-900">{selectedMedication.patientName}</h3>
                      <p className="text-emerald-700">{selectedMedication.patientAge} years • {selectedMedication.patientGender}</p>
                      <p className="text-sm text-emerald-600 mt-1">Patient ID: #{selectedMedication.patientId}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleContactPatient('phone')}
                      className="p-2 bg-white rounded-lg hover:bg-emerald-100 transition-colors"
                      title="Call patient"
                    >
                      <Phone className="h-5 w-5 text-emerald-600" />
                    </button>
                    <button
                      onClick={() => handleContactPatient('email')}
                      className="p-2 bg-white rounded-lg hover:bg-emerald-100 transition-colors"
                      title="Email patient"
                    >
                      <Mail className="h-5 w-5 text-emerald-600" />
                    </button>
                    <button
                      onClick={() => handleContactPatient('message')}
                      className="p-2 bg-white rounded-lg hover:bg-emerald-100 transition-colors"
                      title="Message patient"
                    >
                      <MessageSquare className="h-5 w-5 text-emerald-600" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Dosage Information */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Pill className="h-5 w-5 text-emerald-600 mr-2" />
                      Dosage Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <span className="text-gray-600">Strength</span>
                        <span className="font-semibold text-gray-900">{selectedMedication.strength}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <span className="text-gray-600">Frequency</span>
                        <span className="font-semibold text-gray-900 capitalize">{selectedMedication.frequency.replace('-', ' ')}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-semibold text-gray-900">{selectedMedication.duration}</span>
                      </div>
                      {selectedMedication.adherence !== undefined && (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <span className="text-gray-600 flex items-center">
                            <Activity className="h-4 w-4 mr-2" />
                            Adherence Rate
                          </span>
                          <span className={`font-semibold ${getAdherenceColor(selectedMedication.adherence)}`}>
                            {selectedMedication.adherence}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Schedule */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Calendar className="h-5 w-5 text-emerald-600 mr-2" />
                      Schedule
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl">
                        <Calendar className="h-5 w-5 text-emerald-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Prescribed Date</p>
                              <p className="text-sm text-gray-600">
                                {new Date(selectedMedication.prescribedDate).toLocaleDateString('en-IN', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  timeZone: 'Asia/Kolkata'
                                })}
                              </p>

                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Start Date</p>
                          <p className="text-sm text-gray-600">
                            {new Date(selectedMedication.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {selectedMedication.endDate && (
                        <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl">
                          <Calendar className="h-5 w-5 text-red-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">End Date</p>
                            <p className="text-sm text-gray-600">
                              {new Date(selectedMedication.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedMedication.nextDose && (
                        <div className="flex items-center space-x-3 p-3 border border-emerald-200 bg-emerald-50 rounded-xl">
                          <Bell className="h-5 w-5 text-emerald-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Next Dose</p>
                            <p className="text-sm text-emerald-700">
                              {new Date(selectedMedication.nextDose).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  {selectedMedication.progress !== undefined && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Treatment Progress</h3>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>Completion</span>
                          <span className="font-semibold text-emerald-700">{selectedMedication.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-300 shadow-sm"
                            style={{ width: `${selectedMedication.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Instructions */}
                  {selectedMedication.instructions && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <FileText className="h-5 w-5 text-blue-600 mr-2" />
                        Instructions
                      </h3>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-blue-900">{selectedMedication.instructions}</p>
                      </div>
                    </div>
                  )}

                  {/* Warnings */}
                  {selectedMedication.warnings?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                        Warnings
                      </h3>
                      <div className="space-y-2">
                        {selectedMedication.warnings.map((warning, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p className="text-amber-900 text-sm">{warning}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Side Effects */}
                  {selectedMedication.sideEffects?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        Side Effects
                      </h3>
                      <div className="space-y-2">
                        {selectedMedication.sideEffects.map((effect, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <p className="text-red-900 text-sm">{effect}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedMedication.notes && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Doctor's Notes</h3>
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <p className="text-gray-700 text-sm">{selectedMedication.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-200">
                {selectedMedication.status === 'active' && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Prescription</span>
                    </button>
                    
                    <button
                      onClick={handleDiscontinue}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Discontinue</span>
                    </button>
                  </>
                )}
                
                <button
                  onClick={handleViewPatientHistory}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Activity className="h-4 w-4" />
                  <span>Patient History</span>
                </button>
                
                <button 
                  onClick={() => {
                    // Handle share functionality
                    if (navigator.share) {
                      navigator.share({
                        title: `${selectedMedication.name} Prescription`,
                        text: `Prescription for ${selectedMedication.patientName}: ${selectedMedication.name} ${selectedMedication.strength}`
                      });
                    }
                  }}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
                
                <button 
                  onClick={() => {
                    // Handle download/export functionality
                    const prescriptionData = {
                      patient: selectedMedication.patientName,
                      medication: selectedMedication.name,
                      strength: selectedMedication.strength,
                      frequency: selectedMedication.frequency,
                      duration: selectedMedication.duration,
                      instructions: selectedMedication.instructions,
                      warnings: selectedMedication.warnings,
                      sideEffects: selectedMedication.sideEffects,
                      prescribedDate: selectedMedication.prescribedDate
                    };
                    
                    const blob = new Blob([JSON.stringify(prescriptionData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `prescription-${selectedMedication.patientName}-${selectedMedication.name}.json`;
                    a.click();
                  }}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>

              {/* Discontinued Info */}
              {selectedMedication.status === 'discontinued' && selectedMedication.discontinueReason && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900">Discontinued</h4>
                      <p className="text-sm text-red-800 mt-1">Reason: {selectedMedication.discontinueReason}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DoctorMedicationDetailsModal;
