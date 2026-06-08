/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Medication/Patient/MedicationDetailsModal.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Pill, 
  Calendar, 
  Clock, 
  Bell,
  AlertTriangle,
  AlertCircle,
  Check,
  XCircle,
  Share2,
  Download,
  Stethoscope,
  User,
  FileText,
  Sparkles,
  Target,
  Shield,
  Loader2
} from 'lucide-react';

const MedicationDetailsModal = ({
  showDetails,
  setShowDetails,
  selectedMedication,
  getStatusColor,
  getStatusIcon,
  getAdherenceColor,
  markAdherence,
  discontinueMedication,
  isDoctor = false
}) => {
  const [discontinuing, setDiscontinuing] = useState(false);
  const [marking, setMarking] = useState(false);
  
  if (!selectedMedication) return null;

  const handleMarkAsTaken = async () => {
    setMarking(true);
    try {
      await markAdherence(selectedMedication.id, { 
        taken: true, 
        timestamp: new Date().toISOString() 
      });
      // Show success feedback
      setTimeout(() => setMarking(false), 1000);
    } catch (err) {
      console.error('Failed to mark adherence:', err);
      setMarking(false);
    }
  };

  const handleDiscontinue = async () => {
    if (!window.confirm('Are you sure you want to discontinue this medication?')) {
      return;
    }
    
    const reason = prompt('Please enter the reason for discontinuing:');
    if (!reason) return;
    
    setDiscontinuing(true);
    try {
      await discontinueMedication(selectedMedication.id, reason);
      setShowDetails(false);
    } catch (err) {
      console.error('Failed to discontinue:', err);
      alert('Failed to discontinue medication. Please try again.');
    } finally {
      setDiscontinuing(false);
    }
  };

  const handleShare = () => {
    const shareData = {
      title: `${selectedMedication.name || selectedMedication.genericName} - Medication Details`,
      text: `${selectedMedication.name || selectedMedication.genericName} - ${selectedMedication.strength}, ${selectedMedication.frequency}`
    };
    
    if (navigator.share) {
      navigator.share(shareData).catch(err => console.log('Share cancelled'));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `${shareData.title}\n${shareData.text}\n\nPrescribed by: ${selectedMedication.prescribedBy || 'Unknown'}`
      );
      alert('Medication details copied to clipboard!');
    }
  };

  const handleExport = () => {
    const data = {
      medication: selectedMedication.name || selectedMedication.genericName,
      generic_name: selectedMedication.genericName,
      brand_name: selectedMedication.brandName,
      strength: selectedMedication.strength,
      frequency: selectedMedication.frequency,
      instructions: selectedMedication.instructions,
      prescriber: selectedMedication.prescribedBy,
      hospital: selectedMedication.prescribedByHospital,
      start_date: selectedMedication.startDate,
      status: selectedMedication.status,
      exported_at: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(selectedMedication.name || selectedMedication.genericName).replace(/\s+/g, '_')}-details.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {showDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              {/* ✅ Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    selectedMedication.status === 'active' ? 'bg-teal-500' :
                    selectedMedication.status === 'completed' ? 'bg-blue-500' :
                    'bg-red-500'
                  }`}>
                    <Pill className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedMedication.name || selectedMedication.genericName}
                    </h2>
                    {selectedMedication.genericName && selectedMedication.name && (
                      <p className="text-gray-600">Generic: {selectedMedication.genericName}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1 ${getStatusColor(selectedMedication.status)}`}>
                        {getStatusIcon(selectedMedication.status)}
                        <span className="capitalize">{selectedMedication.status}</span>
                      </span>
                      
                      {/* ✅ AI Extraction Badge */}
                      {selectedMedication.extractionStatus === 'completed' && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center space-x-1">
                          <Sparkles className="h-4 w-4" />
                          <span>AI Extracted</span>
                          {selectedMedication.extractionConfidence && (
                            <span>({selectedMedication.extractionConfidence}%)</span>
                          )}
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ✅ Left Column */}
                <div className="space-y-6">
                  {/* Dosage Information */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Dosage Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <span className="text-gray-600">Strength</span>
                        <span className="font-semibold text-gray-900">{selectedMedication.strength}</span>
                      </div>
                      {selectedMedication.dosage && (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <span className="text-gray-600">Form</span>
                          <span className="font-semibold text-gray-900">{selectedMedication.dosage}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <span className="text-gray-600">Frequency</span>
                        <span className="font-semibold text-gray-900">{selectedMedication.frequency}</span>
                      </div>
                      {selectedMedication.frequencyTimesPerDay && (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <span className="text-gray-600">Times per Day</span>
                          <span className="font-semibold text-gray-900">{selectedMedication.frequencyTimesPerDay}x</span>
                        </div>
                      )}
                      {selectedMedication.duration && (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-semibold text-gray-900">{selectedMedication.duration}</span>
                        </div>
                      )}
                      {selectedMedication.route && (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <span className="text-gray-600">Route</span>
                          <span className="font-semibold text-gray-900 capitalize">{selectedMedication.route}</span>
                        </div>
                      )}
                    </div>
                  </div>



                  {/* ✅ Schedule */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Schedule</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl">
                          <Calendar className="h-5 w-5 text-teal-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Start Date</p>
                            <p className="text-sm text-gray-600">
                              {new Date(selectedMedication.startDate).toLocaleDateString('en-IN', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                timeZone: 'Asia/Kolkata'
                              })}
                            </p>
                          </div>
                        </div>

                        {selectedMedication.endDate && (
                          <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl">
                            <Calendar className="h-5 w-5 text-red-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">End Date</p>
                              <p className="text-sm text-gray-600">
                                {new Date(selectedMedication.endDate).toLocaleDateString('en-IN', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  timeZone: 'Asia/Kolkata'
                                })}
                              </p>
                            </div>
                          </div>
                        )}

                        {selectedMedication.lastTakenAt && (
                          <div className="flex items-center space-x-3 p-3 border border-green-200 bg-green-50 rounded-xl">
                            <Check className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Last Taken</p>
                              <p className="text-sm text-green-700">
                                {new Date(selectedMedication.lastTakenAt).toLocaleString('en-IN', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true,
                                  timeZone: 'Asia/Kolkata'
                                })}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>




                </div>

                {/* ✅ Right Column */}
                <div className="space-y-6">
                  {/* Instructions */}
                  {selectedMedication.instructions && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Instructions</h3>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-blue-900">{selectedMedication.instructions}</p>
                      </div>
                    </div>
                  )}

                  {/* ✅ Indication */}
                  {selectedMedication.indication && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Indication</h3>
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                        <p className="text-purple-900">{selectedMedication.indication}</p>
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

                  {/* ✅ Prescriber Info */}
                  {(selectedMedication.prescribedBy || selectedMedication.prescribedByHospital) && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Prescriber Information</h3>
                      <div className="p-4 border border-gray-200 rounded-xl space-y-3">
                        {selectedMedication.prescribedBy && (
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center">
                              <Stethoscope className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Doctor</p>
                              <p className="font-semibold text-gray-900">{selectedMedication.prescribedBy}</p>
                            </div>
                          </div>
                        )}
                        {selectedMedication.prescribedByHospital && (
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Hospital/Clinic</p>
                              <p className="font-semibold text-gray-900">{selectedMedication.prescribedByHospital}</p>
                            </div>
                          </div>
                        )}
                        {selectedMedication.sourceDocument && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-600" />
                            <p className="text-sm text-gray-700">Source: {selectedMedication.sourceDocument}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ✅ Additional Notes */}
                  {selectedMedication.notes && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Notes</h3>
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <p className="text-gray-700">{selectedMedication.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ✅ Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-200">
                {selectedMedication.status === 'active' && !isDoctor && (
<button
  onClick={handleMarkAsTaken}
  disabled={marking || selectedMedication.takenToday}
  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
>
  {selectedMedication.takenToday ? (
    <>
      <Check className="h-4 w-4" />
      <span>Taken Today ✓</span>
    </>
  ) : marking ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Marking...</span>
    </>
  ) : (
    <>
      <Check className="h-4 w-4" />
      <span>Mark as Taken</span>
    </>
  )}
</button>
                )}
                
                {selectedMedication.status === 'active' && !isDoctor && (
                  <button
                    onClick={handleDiscontinue}
                    disabled={discontinuing}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {discontinuing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Stopping...</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        <span>Stop Medication</span>
                      </>
                    )}
                  </button>
                )}
                
                <button 
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
                
                <button 
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MedicationDetailsModal;
