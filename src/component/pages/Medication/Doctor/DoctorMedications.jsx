/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Medication/Doctor/DoctorMedications.jsx

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
  Bell,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Users,
  TrendingUp,
  Activity,
  Target,
  Shield,
  BarChart3,
  ChevronRight,
  X,
  Check,
  Stethoscope,
  FileText,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import api from '../../../../api/api'; // ⚠️ COMMENTED - Uncomment when backend ready
import PrescribeMedicationModal from './PrescribeMedicationModal';
import DoctorMedicationDetailsModal from './DoctorMedicationDetailsModal';

const DoctorMedications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // ⚠️ COMMENTED - Uncomment when backend is ready
  // const [medications, setMedications] = useState([]);
  // const [loading, setLoading] = useState(false);
  
  // ✅ MOCK DATA - Remove when backend is ready
  const [loading, setLoading] = useState(false);
  const [medications, setMedications] = useState([
    {
      id: 1,
      patientId: 101,
      patientName: 'Sarah Johnson',
      patientAge: 45,
      patientGender: 'Female',
      name: 'Metformin',
      genericName: 'Metformin Hydrochloride',
      strength: '500mg',
      frequency: 'twice-daily',
      duration: 'Long-term',
      startDate: '2026-01-01',
      status: 'active',
      instructions: 'Take with meals',
      warnings: ['Monitor blood sugar levels', 'Report any unusual symptoms'],
      sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset'],
      adherence: 92,
      nextDose: '2026-01-21T19:00:00',
      progress: 85,
      prescribedDate: '2026-01-01',
      notes: 'Patient managing diabetes well'
    },
    {
      id: 2,
      patientId: 102,
      patientName: 'Rajesh Kumar',
      patientAge: 52,
      patientGender: 'Male',
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      strength: '10mg',
      frequency: 'once-daily',
      duration: '3 months',
      startDate: '2026-01-15',
      status: 'active',
      instructions: 'Take in the morning',
      warnings: ['Monitor blood pressure', 'Avoid potassium supplements'],
      sideEffects: ['Dizziness', 'Dry cough', 'Headache'],
      adherence: 88,
      nextDose: '2026-01-22T08:00:00',
      progress: 45,
      prescribedDate: '2026-01-15',
      notes: 'Blood pressure improving'
    },
    {
      id: 3,
      patientId: 103,
      patientName: 'Priya Sharma',
      patientAge: 38,
      patientGender: 'Female',
      name: 'Amoxicillin',
      genericName: 'Amoxicillin Trihydrate',
      strength: '500mg',
      frequency: 'three-times-daily',
      duration: '7 days',
      startDate: '2026-01-18',
      endDate: '2026-01-25',
      status: 'active',
      instructions: 'Complete full course',
      warnings: ['Report any allergic reactions immediately'],
      sideEffects: ['Mild stomach upset', 'Rash (if allergic)'],
      adherence: 95,
      nextDose: '2026-01-21T14:00:00',
      progress: 60,
      prescribedDate: '2026-01-18',
      notes: 'Treating respiratory infection'
    }
  ]);

  const [patients, setPatients] = useState([
    { id: 101, name: 'Sarah Johnson', age: 45, gender: 'Female', lastVisit: '2026-01-20' },
    { id: 102, name: 'Rajesh Kumar', age: 52, gender: 'Male', lastVisit: '2026-01-19' },
    { id: 103, name: 'Priya Sharma', age: 38, gender: 'Female', lastVisit: '2026-01-18' }
  ]);
  
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showPrescribeModal, setShowPrescribeModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptionTemplates, setPrescriptionTemplates] = useState([]);

  // New prescription form
  const [newPrescription, setNewPrescription] = useState({
    patientId: '',
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
    interactions: [],
    notes: ''
  });

  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    frequency: 'all',
    patient: 'all',
    adherence: 'all'
  });

  // Real-time updates
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // ⚠️ COMMENTED - Uncomment when backend is ready
  // useEffect(() => {
  //   fetchMedications();
  //   fetchPatients();
  //   fetchPrescriptionTemplates();
  //   fetchNotifications();
  // }, []);

  // ⚠️ COMMENTED - Uncomment when backend is ready
  // const fetchMedications = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await api.get('/medications/prescribed');
  //     setMedications(response.data);
  //   } catch (err) {
  //     setError('Failed to fetch medications');
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ⚠️ COMMENTED - Uncomment when backend is ready
  // const fetchPatients = async () => {
  //   try {
  //     const response = await api.get('/doctors/patients');
  //     setPatients(response.data);
  //   } catch (err) {
  //     console.error('Failed to fetch patients:', err);
  //   }
  // };

  // ⚠️ COMMENTED - Uncomment when backend is ready
  // const fetchPrescriptionTemplates = async () => {
  //   try {
  //     const response = await api.get('/medications/templates');
  //     setPrescriptionTemplates(response.data);
  //   } catch (err) {
  //     console.error('Failed to fetch templates:', err);
  //   }
  // };

  // ⚠️ COMMENTED - Uncomment when backend is ready
  // const fetchNotifications = async () => {
  //   try {
  //     const response = await api.get('/medications/notifications');
  //     setNotifications(response.data);
  //   } catch (err) {
  //     console.error('Failed to fetch notifications:', err);
  //   }
  // };

  // ⚠️ MOCK FUNCTION - Replace with real API call
  const prescribeMedication = async (medicationData) => {
    try {
      // ⚠️ COMMENTED - Uncomment when backend is ready
      // const response = await api.post('/medications/prescribe', medicationData);
      // await Promise.all([
      //   api.post('/medications/send-prescription', {
      //     medicationId: response.data.id,
      //     method: 'email'
      //   }),
      //   api.post('/medications/send-reminder', {
      //     medicationId: response.data.id,
      //     type: 'initial'
      //   })
      // ]);
      // setMedications(prev => [...prev, response.data]);
      
      // ✅ MOCK: Simulate successful prescription
      const newMed = {
        id: medications.length + 1,
        ...medicationData,
        status: 'active',
        adherence: 0,
        prescribedDate: new Date().toISOString()
      };
      setMedications(prev => [...prev, newMed]);
      
      setShowPrescribeModal(false);
      resetForm();
      
      return newMed;
    } catch (err) {
      throw new Error('Failed to prescribe medication');
    }
  };

  // ⚠️ MOCK FUNCTION - Replace with real API call
  const updateMedication = async (medicationId, updateData) => {
    try {
      // ⚠️ COMMENTED - Uncomment when backend is ready
      // const response = await api.patch(`/medications/${medicationId}`, updateData);
      
      setMedications(prev => 
        prev.map(med => 
          med.id === medicationId 
            ? { ...med, ...updateData }
            : med
        )
      );
      
      return updateData;
    } catch (err) {
      throw new Error('Failed to update medication');
    }
  };

  // ⚠️ MOCK FUNCTION - Replace with real API call
  const discontinueMedication = async (medicationId, reason) => {
    try {
      // ⚠️ COMMENTED - Uncomment when backend is ready
      // const response = await api.patch(`/medications/${medicationId}/discontinue`, { reason });
      
      setMedications(prev => 
        prev.map(med => 
          med.id === medicationId 
            ? { ...med, status: 'discontinued', discontinueReason: reason }
            : med
        )
      );
      
      return { success: true };
    } catch (err) {
      throw new Error('Failed to discontinue medication');
    }
  };

  // ⚠️ MOCK FUNCTION - Replace with real refresh
  const refresh = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const resetForm = () => {
    setNewPrescription({
      patientId: '',
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
      interactions: [],
      notes: ''
    });
  };

  // Filter medications
  const filteredMedications = useMemo(() => {
    return medications.filter(med => {
      const matchesSearch = searchTerm === '' || 
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.patientName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || med.status === filters.status;
      const matchesFrequency = filters.frequency === 'all' || med.frequency === filters.frequency;
      
      return matchesSearch && matchesStatus && matchesFrequency;
    });
  }, [medications, searchTerm, filters]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = medications.length;
    const active = medications.filter(med => med.status === 'active').length;
    const completed = medications.filter(med => med.status === 'completed').length;
    const discontinued = medications.filter(med => med.status === 'discontinued').length;
    const dueToday = medications.filter(med => {
      if (med.status !== 'active' || !med.nextDose) return false;
      return new Date(med.nextDose).toDateString() === new Date().toDateString();
    }).length;
    
    const adherenceRate = medications.length > 0 
      ? Math.round(medications.reduce((sum, med) => sum + (med.adherence || 0), 0) / medications.length)
      : 0;

    return { total, active, completed, discontinued, dueToday, adherenceRate };
  }, [medications]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-teal-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-teal-500" />;
      case 'discontinued':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'discontinued':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAdherenceColor = (adherence) => {
    if (adherence >= 90) return 'text-green-600';
    if (adherence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Enhanced Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Pill className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Patient Medications
              </h1>
              <p className="text-gray-600 mt-1">
                Manage prescriptions and monitor patient adherence
              </p>


            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
  <span className="flex items-center">
    <Clock className="h-4 w-4 mr-1" />
    {/* ✅ IST 12hr */}
    {currentTime.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    })}
  </span>
  <span className="flex items-center">
    <Calendar className="h-4 w-4 mr-1" />
    {/* ✅ Indian date */}
    {currentTime.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    })}
  </span>
  <span className="flex items-center text-emerald-600 font-semibold">
    <Users className="h-4 w-4 mr-1" />
    {patients.length} Active Patients
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
              onClick={() => setShowPrescribeModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
            >
              <Plus className="h-5 w-5" />
              <span>Prescribe Medication</span>
            </button>
          </div>
        </motion.header>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {[
            { label: 'Total', value: stats.total, icon: <Pill />, color: 'bg-purple-50', text: 'text-purple-600'},
            { label: 'Active', value: stats.active, icon: <CheckCircle2 />, color: 'bg-emerald-50', text: 'text-emerald-600'},
            { label: 'Completed', value: stats.completed, icon: <Target />, color: 'bg-orange-50', text: 'text-orange-600'},
            { label: 'Discontinued', value: stats.discontinued, icon: <XCircle />, color: 'bg-yellow-50', text: 'text-yellow-600'},
            { label: 'Due Today', value: stats.dueToday, icon: <Bell />, color: 'bg-blue-50', text: 'text-blue-600' },
            { label: 'Adherence', value: `${stats.adherenceRate}%`, icon: <TrendingUp />, color: 'bg-indigo-50', text: 'text-indigo-600' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow hover:shadow-md transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4 ${stat.text} shadow group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
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
                placeholder="Search medications, patients..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                      ? 'bg-emerald-100 text-emerald-700 shadow' 
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
              {['all', 'active', 'completed', 'discontinued'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilters(prev => ({ ...prev, status }))}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                    filters.status === status 
                      ? 'bg-emerald-100 text-emerald-700 shadow' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mock Data Indicator */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Using mock data - Backend not connected</span>
          </div>
          {filteredMedications.length > 0 && (
            <span className="text-gray-500">{filteredMedications.length} prescription{filteredMedications.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {/* Main Content */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }
        >
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredMedications.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No prescriptions found</h3>
              <p className="text-gray-600 mb-6">
                {filters.status === 'all' 
                  ? "No prescriptions yet"
                  : `No ${filters.status} prescriptions to display`
                }
              </p>
              <button
                onClick={() => setShowPrescribeModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Prescribe First Medication
              </button>
            </div>
          ) : (
            filteredMedications.map((medication, index) => (
              <motion.div
                key={medication.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setSelectedMedication(medication);
                  setShowDetails(true);
                }}
                className={`bg-white rounded-2xl shadow border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group ${
                  viewMode === 'list' ? 'flex items-center p-6' : 'block'
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            medication.status === 'active' ? 'bg-emerald-500' :
                            medication.status === 'completed' ? 'bg-blue-500' :
                            'bg-red-500'
                          } shadow group-hover:scale-110 transition-transform`}>
                            <Pill className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{medication.name}</h3>
                            <p className="text-sm text-gray-600">{medication.strength}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(medication.status)}`}>
                            {getStatusIcon(medication.status)}
                            <span className="ml-1 capitalize">{medication.status}</span>
                          </span>
                          {medication.adherence !== undefined && (
                            <div className="mt-2">
                              <span className={`text-xs font-medium ${getAdherenceColor(medication.adherence)}`}>
                                {medication.adherence}% adherence
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Patient Info */}
                      <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-emerald-600" />
                          <span className="font-semibold text-emerald-900">{medication.patientName}</span>
                        </div>
                        <p className="text-xs text-emerald-700 mt-1">
                          {medication.patientAge} years • {medication.patientGender}
                        </p>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            Frequency
                          </span>
                          <span className="font-medium text-gray-900">{medication.frequency}</span>
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
                        
                        {medication.nextDose && medication.status === 'active' && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-emerald-600 flex items-center">
                              <Bell className="h-4 w-4 mr-2" />
                              Next dose
                            </span>
                            <span className="font-medium text-emerald-700">
                              {new Date(medication.nextDose).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {medication.status === 'active' && medication.progress && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{medication.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${medication.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          Prescribed {new Date(medication.prescribedDate).toLocaleDateString()}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {medication.instructions && (
                      <div className="px-6 pb-6">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                          <p className="text-sm text-blue-900">{medication.instructions}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        medication.status === 'active' ? 'bg-emerald-500' :
                        medication.status === 'completed' ? 'bg-blue-500' :
                        'bg-red-500'
                      } shadow`}>
                        <Pill className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{medication.name}</h3>
                            <p className="text-sm text-gray-600">
                              Patient: <span className="font-semibold text-emerald-700">{medication.patientName}</span>
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(medication.status)}`}>
                            {getStatusIcon(medication.status)}
                            <span className="ml-1 capitalize">{medication.status}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            {medication.strength}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {medication.frequency}
                          </span>
                          {medication.adherence !== undefined && (
                            <span className={`flex items-center font-semibold ${getAdherenceColor(medication.adherence)}`}>
                              <TrendingUp className="h-4 w-4 mr-1" />
                              {medication.adherence}% adherence
                            </span>
                          )}
                          {medication.nextDose && medication.status === 'active' && (
                            <span className="flex items-center text-emerald-600">
                              <Bell className="h-4 w-4 mr-1" />
                              Next: {new Date(medication.nextDose).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
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
              <h4 className="text-lg font-bold text-amber-900 mb-2">Important Prescribing Notice</h4>
              <div className="text-sm text-amber-800 space-y-2">
                <p>• Always verify patient allergies and drug interactions before prescribing</p>
                <p>• Ensure proper dosage and administration instructions are clearly documented</p>
                <p>• Monitor patient adherence and adjust treatment plans as necessary</p>
                <p>• Follow evidence-based guidelines and maintain accurate medical records</p>
                <p>• Report adverse drug reactions to appropriate regulatory authorities</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <PrescribeMedicationModal
        showPrescribeModal={showPrescribeModal}
        setShowPrescribeModal={setShowPrescribeModal}
        newPrescription={newPrescription}
        setNewPrescription={setNewPrescription}
        prescribeMedication={prescribeMedication}
        resetForm={resetForm}
        setError={setError}
        patients={patients}
      />

      <DoctorMedicationDetailsModal
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        selectedMedication={selectedMedication}
        getStatusColor={getStatusColor}
        getStatusIcon={getStatusIcon}
        getAdherenceColor={getAdherenceColor}
        updateMedication={updateMedication}
        discontinueMedication={discontinueMedication}
        isDoctor={true}
      />
    </div>
  );
};

export default DoctorMedications;
