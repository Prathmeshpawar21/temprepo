/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Medication/Patient/PatientMedications.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Authentication/AuthContext';
import { 
  Pill, 
  Clock, 
  Calendar, 
  AlertCircle, 
  Search, 
  Plus,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Bell,
  Target,
  TrendingUp,
  Activity,
  Shield,
  BarChart3,
  ChevronRight,
  Check,
  MoreHorizontal,
  User,
  Stethoscope,
  Sparkles,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useMedications from '../hooks/useMedications';
import AddMedicationModal from './AddMedicationModal';
import MedicationDetailsModal from './MedicationDetailsModal';

const PatientMedications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // ✅ Use custom hook for medications
  const {
    medications,
    stats,
    loading,
    error,
    pagination,
    fetchMedications,
    createMedication,
    updateMedication,
    stopMedication,
    deleteMedication,
    markAdherence,
    markDoseSkipped,
    refresh,
    clearError
  } = useMedications();
  
  // Local UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // New medication form
  const [newMedication, setNewMedication] = useState({
    name: '',
    genericName: '',
    dosage: '',
    strength: '',
    frequency: '',
    duration: '',
    startDate: '',
    instructions: '',
    warnings: [],
    sideEffects: [],
    notes: '',
    prescribedBy: '',
    prescribedByHospital: ''
  });

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // ✅ Fetch medications on filter change
useEffect(() => {
  fetchMedications({
    status: statusFilter === 'all' ? undefined : statusFilter,
    page: 1,
    page_size: 50
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [statusFilter]);

  // ✅ Handle add medication
  const handleAddMedication = async (medicationData) => {
    try {
      await createMedication(medicationData);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('Failed to add medication:', err);
      throw err;
    }
  };

  // ✅ Handle discontinue medication
  const handleDiscontinue = async (medicationId, reason) => {
    try {
      await stopMedication(medicationId, reason);
    } catch (err) {
      console.error('Failed to discontinue medication:', err);
      throw err;
    }
  };

  const resetForm = () => {
    setNewMedication({
      name: '',
      genericName: '',
      dosage: '',
      strength: '',
      frequency: '',
      duration: '',
      startDate: '',
      instructions: '',
      warnings: [],
      sideEffects: [],
      notes: '',
      prescribedBy: '',
      prescribedByHospital: ''
    });
  };

  // ✅ Client-side search filter
  const filteredMedications = useMemo(() => {
    let result = medications;

    if (statusFilter !== 'all') {
      result = result.filter(
        med => med.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(med =>
        med.name?.toLowerCase().includes(search) ||
        med.genericName?.toLowerCase().includes(search) ||
        med.prescribedBy?.toLowerCase().includes(search) ||
        med.prescribedByHospital?.toLowerCase().includes(search)
      );
    }

    return result;
  }, [medications, searchTerm, statusFilter]);

  // ✅ Helper functions
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-teal-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case 'stopped':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'stopped':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAdherenceColor = (adherence) => {
    if (!adherence) return 'text-gray-600';
    if (adherence >= 90) return 'text-green-600';
    if (adherence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Enhanced Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center shadow-md">
              <Pill className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                My Medications
              </h1>
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
              onClick={refresh}
              disabled={loading}
              className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all shadow-md"
            >
              <Plus className="h-5 w-5" />
              <span>Add Medication</span>
            </button>
          </div>
        </motion.header>

        {/* ✅ Statistics Cards - Using Real Backend Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
{[
  {
    label: 'Total',
    value: stats.total,
    icon:  <Pill />,
    color: 'bg-purple-50',
    text:  'text-purple-600',
  },
  {
    label: 'Active',
    value: stats.active,
    icon:  <CheckCircle2 />,
    color: 'bg-teal-50',
    text:  'text-teal-600',
  },
  {
    label: 'Stopped',
    value: stats.discontinued,
    icon:  <XCircle />,
    color: 'bg-red-50',
    text:  'text-red-600',
  },
  {
    label: 'Recently Added',
    value: stats.recently_added,
    icon:  <Sparkles />,
    color: 'bg-yellow-50',
    text:  'text-yellow-600',
  },
  {
    // ✅ Today's doses taken / total
    label: 'Today\'s Doses',
    value: `${stats.todays_doses_taken}/${stats.todays_doses_total}`,
    icon:  <Bell />,
    color: 'bg-blue-50',
    text:  'text-blue-600',
  },
  {
    // ✅ Today's adherence %
    label: 'Today\'s Adherence',
    value: `${stats.todays_adherence_percentage}%`,
    icon:  <TrendingUp />,
    color: stats.todays_adherence_percentage >= 80 ? 'bg-green-50' : 'bg-orange-50',
    text:  stats.todays_adherence_percentage >= 80 ? 'text-green-600' : 'text-orange-600',
  },
].map((stat, index) => (
  <motion.div
    key={stat.label}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-2xl p-4 border border-gray-200 shadow hover:shadow-md transition-all cursor-pointer group"
  >
    <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3 ${stat.text} shadow group-hover:scale-110 transition-transform`}>
      {stat.icon}
    </div>
    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
    <p className="text-sm text-gray-600">{stat.label}</p>
  </motion.div>
))}

        </motion.div>



        {/* ✅ Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6"
          >
            <div className="flex items-start space-x-4">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">Error</h3>
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search medications, doctors, hospitals..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            
            <div className="flex bg-white rounded-2xl p-1 border border-gray-200">
              {['grid', 'list'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded-xl transition-colors capitalize ${
                    viewMode === mode 
                      ? 'bg-teal-100 text-teal-700 shadow' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {mode === 'grid' ? <BarChart3 className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex bg-white rounded-2xl p-1 border border-gray-200">
              {['all', 'active', 'completed', 'stopped'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                    statusFilter === status 
                      ? 'bg-teal-100 text-teal-700 shadow' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ✅ Main Content - Medications Grid/List */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }
        >
          {loading && medications.length === 0 ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-teal-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Loading medications...</p>
              </div>
            </div>
          ) : filteredMedications.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl p-12 text-center">
              <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No medications found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? `No medications match "${searchTerm}"`
                  : statusFilter === 'all' 
                    ? "You don't have any medications yet"
                    : `No ${statusFilter} medications to display`
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all"
                >
                  Add Your First Medication
                </button>
              )}
            </div>
          ) : (
            filteredMedications.map((medication, index) => (
              <motion.div
                key={medication.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setSelectedMedication(medication);
                  setShowDetails(true);
                }}
                className={`bg-white rounded-2xl shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group ${
                  viewMode === 'list' ? 'flex items-center p-6' : 'block'
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    {/* ✅ Grid View */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow group-hover:scale-110 transition-transform ${
                            medication.status === 'active' ? 'bg-teal-500' :
                            medication.status === 'completed' ? 'bg-blue-500' :
                            'bg-red-500'
                          }`}>
                            <Pill className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {medication.name || medication.genericName}
                            </h3>
                            <p className="text-sm text-gray-600">{medication.strength}</p>
                          </div>
                        </div>
                        
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(medication.status)}`}>
                          {getStatusIcon(medication.status)}
                          <span className="capitalize">{medication.status}</span>
                        </span>
                      </div>

                      {/* ✅ AI Extraction Badge */}
                      {medication.extractionStatus === 'completed' && (
                        <div className="mb-4">
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200">
                            <Sparkles className="h-3 w-3" />
                            <span>AI Extracted</span>
                            {medication.extractionConfidence && (
                              <span className="ml-1">({medication.extractionConfidence}%)</span>
                            )}
                          </span>
                        </div>
                      )}

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            Frequency
                          </span>
                          <span className="font-medium text-gray-900">{medication.frequency || 'Not specified'}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Started
                          </span>
                          <span className="font-medium text-gray-900">
                            {new Date(medication.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {medication.duration && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center">
                              <Target className="h-4 w-4 mr-2" />
                              Duration
                            </span>
                            <span className="font-medium text-gray-900">{medication.duration}</span>
                          </div>
                        )}
                      </div>

                      {/* ✅ Progress Bar */}
                      {medication.status === 'active' && medication.progress !== null && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{medication.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${medication.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600 flex items-center space-x-1">
                          <Stethoscope className="h-4 w-4" />
                          <span>{medication.prescribedBy || 'Self-added'}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {medication.status === 'active' && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      if (!medication.takenToday) {
        markAdherence(medication.id, { dose_number: 1 });
      }
    }}
    disabled={medication.takenToday}
    className={`p-2 rounded-lg transition-colors ${
      medication.takenToday
        ? 'text-green-600 bg-green-100 cursor-not-allowed'   // ✅ already taken
        : 'text-gray-400 hover:bg-green-100 hover:text-green-600'
    }`}
    title={medication.takenToday ? 'Already taken today ✓' : 'Mark as taken'}
  >
    <Check className="h-4 w-4" />
  </button>
)}
                          
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* ✅ Instructions */}
                    {medication.instructions && (
                      <div className="px-6 pb-6">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                          <p className="text-sm text-blue-900">{medication.instructions}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* ✅ Hospital Badge */}
                    {medication.prescribedByHospital && (
                      <div className="px-6 pb-6">
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <User className="h-3 w-3" />
                          <span>{medication.prescribedByHospital}</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* ✅ List View */}
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow ${
                        medication.status === 'active' ? 'bg-teal-500' :
                        medication.status === 'completed' ? 'bg-blue-500' :
                        'bg-red-500'
                      }`}>
                        <Pill className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {medication.name || medication.genericName}
                            </h3>
                            {medication.extractionStatus === 'completed' && (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                                <Sparkles className="h-3 w-3" />
                                <span>AI</span>
                              </span>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(medication.status)}`}>
                            {getStatusIcon(medication.status)}
                            <span className="capitalize">{medication.status}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            {medication.strength}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {medication.frequency || 'As needed'}
                          </span>
                          <span className="flex items-center">
                            <Stethoscope className="h-4 w-4 mr-1" />
                            {medication.prescribedBy || 'Self-added'}
                          </span>
                          {medication.prescribedByHospital && (
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {medication.prescribedByHospital}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
    {medication.status === 'active' && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      if (!medication.takenToday) {
        markAdherence(medication.id, { dose_number: 1 });
      }
    }}
    disabled={medication.takenToday}
    className={`p-2 rounded-lg transition-colors ${
      medication.takenToday
        ? 'text-green-600 bg-green-100 cursor-not-allowed'   // ✅ already taken
        : 'text-gray-400 hover:bg-green-100 hover:text-green-600'
    }`}
    title={medication.takenToday ? 'Already taken today ✓' : 'Mark as taken'}
  >
    <Check className="h-4 w-4" />
  </button>
)}
                      
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </>
                )}
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Health Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-6"
        >
          <div className="flex items-start space-x-4">
            <Shield className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-amber-900 mb-2">Important Medical Notice</h4>
              <div className="text-sm text-amber-800 space-y-2">
                <p>• Always follow your healthcare provider's instructions exactly as prescribed</p>
                <p>• Report any side effects or adverse reactions to your doctor immediately</p>
                <p>• Do not stop, start, or change your medication without consulting your healthcare provider</p>
                <p>• Keep all medications in their original containers and store as directed</p>
                <p>• This app is for tracking purposes only and does not replace professional medical advice</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ✅ Modals */}
      <AddMedicationModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        newMedication={newMedication}
        setNewMedication={setNewMedication}
        addMedication={handleAddMedication}
        resetForm={resetForm}
        setError={() => {}}
      />

      <MedicationDetailsModal
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        selectedMedication={selectedMedication}
        getStatusColor={getStatusColor}
        getStatusIcon={getStatusIcon}
        getAdherenceColor={getAdherenceColor}
        markAdherence={markAdherence}
        discontinueMedication={handleDiscontinue}
        isDoctor={false}
      />
    </div>
  );
};

export default PatientMedications;
