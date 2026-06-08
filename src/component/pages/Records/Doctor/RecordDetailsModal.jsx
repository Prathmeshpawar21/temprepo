/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/Doctor/RecordDetailsModal.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Edit, 
  Trash2, 
  Eye, 
  FileText,
  Calendar,
  User,
  Tag,
  Lock,
  Unlock,
  ExternalLink,
  Clock,
  AlertCircle,
  CheckCircle,
  Activity,
  Stethoscope,
  Pill,
  Heart,
  Phone,
  Mail,
  MapPin,
  Copy,
  Send,
  Archive,
  RefreshCw,
  MessageSquare,
  Video,
  Share2
} from 'lucide-react';
import { getCategoryInfo, getStatusColor, formatFileSize } from '../shared/recordsUtils.jsx';

const RecordDetailsModal = ({
  showDetailsModal,
  setShowDetailsModal,
  selectedRecord,
  deleteRecord,
  updateRecordStatus,
  scheduleFollowUp,
  isDoctor = true,
  selectedPatient
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [followUpForm, setFollowUpForm] = useState({
    date: '',
    time: '',
    type: 'in-person',
    notes: ''
  });
  const [newStatus, setNewStatus] = useState('');

  if (!selectedRecord) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRecord(selectedRecord.id);
      setShowDeleteConfirm(false);
      setShowDetailsModal(false);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await updateRecordStatus(selectedRecord.id, newStatus);
      setShowStatusDialog(false);
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleScheduleFollowUp = async () => {
    try {
      await scheduleFollowUp(selectedPatient.id, followUpForm);
      setShowFollowUpDialog(false);
      setFollowUpForm({ date: '', time: '', type: 'in-person', notes: '' });
    } catch (err) {
      console.error('Follow-up scheduling failed:', err);
    }
  };

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <AnimatePresence>
      {showDetailsModal && (
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
            className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-blue-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`w-16 h-16 ${getCategoryInfo(selectedRecord.category).color} rounded-2xl flex items-center justify-center shadow-md`}>
                    <div className={`${getCategoryInfo(selectedRecord.category).text}`}>
                      {getCategoryInfo(selectedRecord.category).icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">{selectedRecord.title}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedRecord.status)}`}>
                        {selectedRecord.status}
                      </span>
                      {selectedRecord.isUrgent && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200 flex items-center space-x-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>URGENT</span>
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{getCategoryInfo(selectedRecord.category).label}</p>
                    
                    {/* Patient Info */}
                    {selectedPatient && (
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {selectedPatient.name}
                        </span>
                        <span>{selectedPatient.age} years • {selectedPatient.gender}</span>
                      </div>
                    )}
                    

              <div className="flex items-center space-x-6 text-sm text-gray-600">
  <span className="flex items-center">
    <Calendar className="h-4 w-4 mr-1" />
    {new Date(selectedRecord.createdAt).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    })}
  </span>
  <span className="flex items-center">
    <Clock className="h-4 w-4 mr-1" />
    {new Date(selectedRecord.createdAt).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    })}
  </span>
</div>


                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-white/50 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-teal-100 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('clinical')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'clinical'
                      ? 'bg-teal-100 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Clinical Details
                </button>
                <button
                  onClick={() => setActiveTab('files')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'files'
                      ? 'bg-teal-100 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Files ({selectedRecord.files?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'history'
                      ? 'bg-teal-100 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  History
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowFollowUpDialog(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Follow-up</span>
                </button>
                <button
                  onClick={() => setShowStatusDialog(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Update Status</span>
                </button>
                <button
                  onClick={() => selectedRecord.files?.forEach(file => handleDownload(file.url, file.name))}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Description */}
                  {selectedRecord.description && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                      <p className="text-gray-700 leading-relaxed">{selectedRecord.description}</p>
                    </div>
                  )}

                  {/* Record and Patient Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Record Information */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-teal-600" />
                        Record Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Record ID</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-sm text-gray-900">{selectedRecord.id}</span>
                            <button
                              onClick={() => copyToClipboard(selectedRecord.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Category</span>
                          <span className="font-medium text-gray-900">{getCategoryInfo(selectedRecord.category).label}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Status</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedRecord.status)}`}>
                            {selectedRecord.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Files</span>
                          <span className="font-medium text-gray-900">{selectedRecord.files?.length || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Created</span>
                          <span className="font-medium text-gray-900">
                            {new Date(selectedRecord.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {selectedRecord.followUpDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-sm">Follow-up</span>
                            <span className="font-medium text-blue-600">
                              {new Date(selectedRecord.followUpDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Patient Information */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <User className="h-5 w-5 mr-2 text-blue-600" />
                        Patient Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Name</span>
                          <span className="font-medium text-gray-900">{selectedPatient?.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Age</span>
                          <span className="font-medium text-gray-900">{selectedPatient?.age} years</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Gender</span>
                          <span className="font-medium text-gray-900">{selectedPatient?.gender}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Condition</span>
                          <span className="font-medium text-gray-900">{selectedPatient?.condition}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Last Visit</span>
                          <span className="font-medium text-gray-900">
                            {new Date(selectedPatient?.lastVisit).toLocaleDateString()}
                          </span>
                        </div>
                        {selectedPatient?.phone && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-sm">Phone</span>
                            <a href={`tel:${selectedPatient.phone}`} className="font-medium text-teal-600 hover:text-teal-700">
                              {selectedPatient.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedRecord.tags && selectedRecord.tags.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedRecord.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'clinical' && (
                <div className="space-y-6">
                  {/* Diagnosis */}
                  {selectedRecord.diagnosis && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center">
                        <Stethoscope className="h-5 w-5 mr-2" />
                        Diagnosis
                      </h3>
                      <p className="text-purple-800 leading-relaxed">{selectedRecord.diagnosis}</p>
                    </div>
                  )}

                  {/* Treatment Plan */}
                  {selectedRecord.treatment && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center">
                        <Pill className="h-5 w-5 mr-2" />
                        Treatment Plan
                      </h3>
                      <p className="text-green-800 leading-relaxed">{selectedRecord.treatment}</p>
                    </div>
                  )}

                  {/* Clinical Notes */}
                  {selectedRecord.notes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
                        <Activity className="h-5 w-5 mr-2" />
                        Clinical Notes
                      </h3>
                      <p className="text-blue-800 leading-relaxed whitespace-pre-line">{selectedRecord.notes}</p>
                    </div>
                  )}

                  {/* No clinical data message */}
                  {!selectedRecord.diagnosis && !selectedRecord.treatment && !selectedRecord.notes && (
                    <div className="text-center py-12">
                      <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No clinical information available for this record</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'files' && (
                <div className="space-y-4">
                  {selectedRecord.files && selectedRecord.files.length > 0 ? (
                    selectedRecord.files.map((file, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between hover:shadow-md transition-shadow group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                            <FileText className="h-6 w-6 text-teal-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{file.name}</h4>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                              <span>{formatFileSize(file.size)}</span>
                              <span>{file.type}</span>
                              <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => window.open(file.url, '_blank')}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(file.url, file.name)}
                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No files attached to this record</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                    
                    {selectedRecord.history && selectedRecord.history.length > 0 ? (
                      selectedRecord.history.map((event, index) => (
                        <div key={index} className="relative flex items-start space-x-4 mb-6">
                          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center z-10 shadow">
                            <Clock className="h-5 w-5 text-teal-600" />
                          </div>
                          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{event.action}</h4>
                              <span className="text-sm text-gray-600">
                                {new Date(event.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{event.description}</p>
                            {event.user && (
                              <p className="text-xs text-gray-500 mt-2">By: Dr. {event.user}</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No history available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Follow-up Dialog */}
            <AnimatePresence>
              {showFollowUpDialog && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">Schedule Follow-up</h3>
                      <button
                        onClick={() => setShowFollowUpDialog(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          value={followUpForm.date}
                          onChange={(e) => setFollowUpForm(prev => ({ ...prev, date: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Time
                        </label>
                        <input
                          type="time"
                          value={followUpForm.time}
                          onChange={(e) => setFollowUpForm(prev => ({ ...prev, time: e.target.value }))}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Type
                        </label>
                        <select
                          value={followUpForm.type}
                          onChange={(e) => setFollowUpForm(prev => ({ ...prev, type: e.target.value }))}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="in-person">In-Person Visit</option>
                          <option value="video">Video Consultation</option>
                          <option value="phone">Phone Call</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Notes
                        </label>
                        <textarea
                          value={followUpForm.notes}
                          onChange={(e) => setFollowUpForm(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Add follow-up instructions..."
                          rows={3}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      
                      <div className="flex space-x-3 pt-4">
                        <button
                          onClick={() => setShowFollowUpDialog(false)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleScheduleFollowUp}
                          disabled={!followUpForm.date || !followUpForm.time}
                          className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                        >
                          <Calendar className="h-4 w-4" />
                          <span>Schedule</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status Update Dialog */}
            <AnimatePresence>
              {showStatusDialog && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">Update Record Status</h3>
                      <button
                        onClick={() => setShowStatusDialog(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Current Status
                        </label>
                        <div className={`px-4 py-3 rounded-xl border ${getStatusColor(selectedRecord.status)}`}>
                          {selectedRecord.status}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          New Status
                        </label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="">Select new status...</option>
                          <option value="active">Active</option>
                          <option value="pending">Pending Review</option>
                          <option value="completed">Completed</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                      
                      <div className="flex space-x-3 pt-4">
                        <button
                          onClick={() => setShowStatusDialog(false)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleStatusUpdate}
                          disabled={!newStatus}
                          className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span>Update</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Delete Confirmation */}
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Delete Record?</h3>
                        <p className="text-gray-600 text-sm">This action cannot be undone</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-6">
                      Are you sure you want to delete <span className="font-semibold">"{selectedRecord.title}"</span>? 
                      All associated files and history will be permanently removed from the patient's records.
                    </p>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete Record'}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecordDetailsModal;
