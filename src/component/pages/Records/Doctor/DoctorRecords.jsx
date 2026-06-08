/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/Doctor/DoctorRecords.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Authentication/AuthContext';
import { 
  Search, 
  Filter, 
  FileText, 
  Download, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Calendar, 
  AlertCircle, 
  User,
  Users,
  Upload,
  Eye,
  Edit,
  Trash2,
  Share2,
  Archive,
  Star,
  BookmarkCheck,
  Bookmark,
  Clock,
  Activity,
  TrendingUp,
  BarChart3,
  Shield,
  RefreshCw,
  MoreHorizontal,
  X,
  Grid3x3,
  List,
  AlignJustify,
  Tag,
  Phone,
  MessageSquare,
  Stethoscope,
  Heart,
  Pill
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../../api/api';
import PatientSelector from './PatientSelector';
import DoctorUploadModal from './DoctorUploadModal';
import RecordDetailsModal from './RecordDetailsModal';
import { 
  recordCategories, 
  getCategoryInfo, 
  getStatusColor, 
  formatFileSize,
  calculateRecordStats,
  filterRecords as filterRecordsUtil
} from '../shared/recordsUtils.jsx';

const DoctorRecords = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // States
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'grid', 'alignjustify'
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: '',
    description: '',
    tags: [],
    notes: '',
    diagnosis: '',
    treatment: '',
    followUpDate: '',
    isUrgent: false,
    files: []
  });

  // Filters
  const [filters, setFilters] = useState({
    category: 'all',
    dateRange: 'all',
    status: 'all',
    priority: 'all',
    tags: []
  });

  // Real-time updates
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch patients and records on mount
  useEffect(() => {
    fetchPatients();
  }, []);

  // Fetch records when patient is selected
  useEffect(() => {
    if (selectedPatient) {
      fetchRecords(selectedPatient.id);
    }
  }, [selectedPatient]);

  // API Functions
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await api.get('/doctor/patients');
      setPatients(response.data);
    } catch (err) {
      setError('Failed to fetch patients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async (patientId) => {
    setLoading(true);
    try {
      const response = await api.get(`/doctor/patients/${patientId}/records`);
      setRecords(response.data);
    } catch (err) {
      setError('Failed to fetch records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const uploadRecord = async (formData) => {
    try {
      const response = await api.post(
        `/doctor/patients/${selectedPatient.id}/records`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Trigger MCP integrations
      await Promise.all([
        // OCR and document processing
        api.post('/records/process-document', {
          recordId: response.data.id,
          patientId: selectedPatient.id
        }),
        // Send notification to patient
        api.post('/records/notify', {
          recordId: response.data.id,
          type: 'upload',
          recipientId: selectedPatient.id
        }),
        // Generate clinical summary if applicable
        api.post('/records/generate-summary', {
          recordId: response.data.id
        })
      ]);

      setRecords(prev => [...prev, response.data]);
      setShowUploadModal(false);
      resetUploadForm();
      
      return response.data;
    } catch (err) {
      throw new Error('Failed to upload record');
    }
  };

  const updateRecordStatus = async (recordId, status) => {
    try {
      const response = await api.patch(`/records/${recordId}`, { status });
      setRecords(prev => 
        prev.map(r => r.id === recordId ? response.data : r)
      );
      return response.data;
    } catch (err) {
      throw new Error('Failed to update record');
    }
  };

  const scheduleFollowUp = async (patientId, details) => {
    try {
      const response = await api.post(
        `/doctor/patients/${patientId}/follow-up`,
        details
      );
      
      // Send notification to patient
      await api.post('/records/notify', {
        type: 'follow-up',
        recipientId: patientId,
        details
      });
      
      return response.data;
    } catch (err) {
      throw new Error('Failed to schedule follow-up');
    }
  };

  const deleteRecord = async (recordId) => {
    try {
      await api.delete(`/records/${recordId}`);
      setRecords(prev => prev.filter(record => record.id !== recordId));
      return true;
    } catch (err) {
      throw new Error('Failed to delete record');
    }
  };

  const resetUploadForm = () => {
    setUploadForm({
      title: '',
      category: '',
      description: '',
      tags: [],
      notes: '',
      diagnosis: '',
      treatment: '',
      followUpDate: '',
      isUrgent: false,
      files: []
    });
  };

  // Filter records
  const filteredRecords = useMemo(() => {
    return filterRecordsUtil(records, searchTerm, filters, true);
  }, [records, searchTerm, filters]);

  // Calculate statistics
  const stats = useMemo(() => {
    return calculateRecordStats(records);
  }, [records]);

  if (!selectedPatient) {
    return <PatientSelector patients={patients} loading={loading} onSelectPatient={setSelectedPatient} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`p-4 md:p-8 max-w-7xl mx-auto space-y-8 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        
        {/* Enhanced Header with Patient Info */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 p-6 rounded-2xl border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200 shadow-md'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center shadow-md">
              <Users className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Patient Records</h1>
              <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage and view patient medical records securely
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                      {currentTime.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true, 
      timeZone: 'Asia/Kolkata' 
    })}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
               {currentTime.toLocaleDateString('en-IN', {
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 border rounded-xl transition-all ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                  : 'bg-white border-gray-200 hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => {
                fetchPatients();
                fetchRecords(selectedPatient.id);
              }}
              className={`p-3 border rounded-xl transition-all ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                  : 'bg-white border-gray-200 hover:bg-gray-100'
              }`}
            >
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all shadow-md"
            >
              <Plus className="h-5 w-5" />
              <span>Add Record</span>
            </button>
          </div>
        </motion.header>

        {/* Patient Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl shadow-md border overflow-hidden ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center shadow">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {selectedPatient.age} years • {selectedPatient.gender} • {selectedPatient.condition}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Last visit: {new Date(selectedPatient.lastVisit).toLocaleDateString()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedPatient.status.toLowerCase())}`}>
                    {selectedPatient.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className={`p-2 rounded-xl transition-colors ${
                isDarkMode
                  ? 'text-gray-400 hover:text-teal-400 hover:bg-gray-700'
                  : 'text-gray-500 hover:text-teal-600 hover:bg-teal-100'
              }`}>
                <Phone className="h-5 w-5" />
              </button>
              <button className={`p-2 rounded-xl transition-colors ${
                isDarkMode
                  ? 'text-gray-400 hover:text-teal-400 hover:bg-gray-700'
                  : 'text-gray-500 hover:text-teal-600 hover:bg-teal-100'
              }`}>
                <MessageSquare className="h-5 w-5" />
              </button>
              <button
                onClick={() => setSelectedPatient(null)}
                className={`px-4 py-2 border rounded-xl transition-colors ${
                  isDarkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Back to Patients
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
        >
          {recordCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl p-4 border shadow hover:shadow-md transition-all cursor-pointer group ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 hover:border-teal-500'
                  : 'bg-white border-gray-200'
              }`}
              onClick={() => setFilters(prev => ({ ...prev, category: category.id }))}
            >
              <div className={`w-10 h-10 ${category.color} rounded-xl flex items-center justify-center mb-3 ${category.text} shadow group-hover:scale-110 transition-transform`}>
                {category.icon}
              </div>
              <p className="text-lg font-bold">{stats.byCategory[category.id] || 0}</p>
              <p className={`text-xs leading-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {category.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patient records..."
                className={`w-full pl-12 pr-4 py-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200'
                }`}
              />
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
            </div>
            <div className={`flex rounded-2xl p-1 border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              {['list', 'grid', 'alignjustify'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded-xl transition-colors capitalize ${
                    viewMode === mode
                      ? 'bg-teal-100 text-teal-700 shadow'
                      : isDarkMode
                      ? 'text-gray-400 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {mode === 'list' && <List className="h-5 w-5" />}
                  {mode === 'grid' && <Grid3x3 className="h-5 w-5" />}
                  {mode === 'alignjustify' && <AlignJustify className="h-5 w-5" />}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-3 border rounded-2xl transition-all ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                  : 'bg-white border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              {filters.category !== 'all' && (
                <div className="w-2 h-2 bg-teal-500 rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Records Display */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className={`rounded-2xl p-12 text-center border ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}>
              <FileText className={`w-16 h-16 mx-auto mb-4 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-300'
              }`} />
              <h3 className="text-xl font-bold mb-2">No records found</h3>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {filters.category !== 'all'
                  ? `No ${getCategoryInfo(filters.category).label.toLowerCase()} records to display`
                  : "No medical records found for this patient"
                }
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all"
              >
                Add First Record
              </button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredRecords.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setSelectedRecord(record);
                    setShowDetailsModal(true);
                  }}
                  className={`rounded-2xl shadow border overflow-hidden hover:shadow-md transition-all cursor-pointer group ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 ${getCategoryInfo(record.category).color} rounded-xl flex items-center justify-center shadow`}>
                            <div className={getCategoryInfo(record.category).text}>
                              {getCategoryInfo(record.category).icon}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">{record.title}</h3>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {getCategoryInfo(record.category).label}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode
                              ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700'
                              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>

                      {record.description && (
                        <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {record.description}
                        </p>
                      )}

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Date</span>
                          <span className="font-medium">
                            {new Date(record.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Files</span>
                          <span className="font-medium">{record.files?.length || 0}</span>
                        </div>
                        {record.isUrgent && (
                          <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Priority</span>
                            <span className="font-medium text-red-600">Urgent</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                        {record.tags?.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Tag className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">{record.tags.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // List View
                    <div className="p-6 flex items-center space-x-4">
                      <div className={`w-12 h-12 ${getCategoryInfo(record.category).color} rounded-xl flex items-center justify-center shadow flex-shrink-0`}>
                        <div className={getCategoryInfo(record.category).text}>
                          {getCategoryInfo(record.category).icon}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-bold truncate">{record.title}</h3>
                            {record.isUrgent && (
                              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)} flex-shrink-0 ml-2`}>
                            {record.status}
                          </span>
                        </div>
                        <div className={`flex items-center space-x-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span>{getCategoryInfo(record.category).label}</span>
                          <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                          <span>{record.files?.length || 0} files</span>
                          {record.diagnosis && <span>Diagnosis: {record.diagnosis}</span>}
                        </div>
                      </div>
                      
                      <ChevronRight className={`h-5 w-5 flex-shrink-0 transition-colors ${
                        isDarkMode
                          ? 'text-gray-500 group-hover:text-teal-400'
                          : 'text-gray-400 group-hover:text-teal-600'
                      }`} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Health Records Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border rounded-2xl p-6 ${
            isDarkMode
              ? 'bg-teal-900/20 border-teal-800/30'
              : 'bg-teal-50 border-teal-200'
          }`}
        >
          <div className="flex items-start space-x-4">
            <Shield className="h-6 w-6 text-teal-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className={`text-lg font-bold mb-2 ${
                isDarkMode ? 'text-teal-300' : 'text-teal-900'
              }`}>
                Privacy & Security
              </h4>
              <div className={`text-sm space-y-2 ${
                isDarkMode ? 'text-teal-200' : 'text-teal-800'
              }`}>
                <p>• Patient records are confidential and protected by HIPAA regulations</p>
                <p>• All access is logged and monitored for security compliance</p>
                <p>• Only authorized healthcare providers can access patient information</p>
                <p>• Records are encrypted both in transit and at rest</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <DoctorUploadModal
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
        uploadForm={uploadForm}
        setUploadForm={setUploadForm}
        uploadRecord={uploadRecord}
        resetUploadForm={resetUploadForm}
        setError={setError}
        selectedPatient={selectedPatient}
      />

      <RecordDetailsModal
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
        selectedRecord={selectedRecord}
        deleteRecord={deleteRecord}
        updateRecordStatus={updateRecordStatus}
        scheduleFollowUp={scheduleFollowUp}
        isDoctor={true}
        selectedPatient={selectedPatient}
      />
    </div>
  );
};

export default DoctorRecords;
