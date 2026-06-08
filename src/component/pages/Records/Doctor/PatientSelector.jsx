/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/Doctor/PatientSelector.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  User, 
  Calendar, 
  ChevronRight,
  Search,
  Filter,
  Heart,
  Activity,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Stethoscope
} from 'lucide-react';
import { getStatusColor } from '../shared/recordsUtils.jsx';

const PatientSelector = ({ patients, loading, onSelectPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('lastVisit'); // 'lastVisit', 'name', 'age'

  // Filter and sort patients
  const filteredPatients = patients
    .filter(patient => {
      const matchesSearch = searchTerm === '' || 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || 
        patient.status.toLowerCase() === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'age') {
        return b.age - a.age;
      } else {
        return new Date(b.lastVisit) - new Date(a.lastVisit);
      }
    });

  // Calculate quick stats
  const stats = {
    total: patients.length,
    active: patients.filter(p => p.status.toLowerCase() === 'active').length,
    pending: patients.filter(p => p.status.toLowerCase() === 'pending').length,
    critical: patients.filter(p => p.isCritical).length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-md border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center shadow-md">
              <Users className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>
              <p className="text-gray-600 mt-1">Select a patient to view their medical records</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Total Patients</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Active</p>
                  <p className="text-2xl font-bold text-green-900">{stats.active}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700 font-medium">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700 font-medium">Critical</p>
                  <p className="text-2xl font-bold text-red-900">{stats.critical}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-md border border-gray-200 p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patients by name or condition..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>

            {/* Filter by Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
              <option value="discharged">Discharged</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="lastVisit">Recent Visit</option>
              <option value="name">Name (A-Z)</option>
              <option value="age">Age</option>
            </select>
          </div>
        </motion.div>

        {/* Patient List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {filteredPatients.length} Patient{filteredPatients.length !== 1 ? 's' : ''}
              </h2>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {searchTerm ? 'No patients found' : 'No patients assigned'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'Try adjusting your search criteria'
                    : "You don't have any patients assigned yet"
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onSelectPatient(patient)}
                    className="p-6 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-teal-300 transition-all cursor-pointer group relative"
                  >
                    {/* Critical Badge */}
                    {patient.isCritical && (
                      <div className="absolute top-4 right-4">
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                      </div>
                    )}

                    {/* Patient Avatar and Info */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-md">
                        <User className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate group-hover:text-teal-600 transition-colors">
                          {patient.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {patient.age} years • {patient.gender}
                        </p>
                      </div>
                    </div>

                    {/* Patient Details */}
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <Stethoscope className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600 truncate">{patient.condition}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">
                          Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                        </span>
                      </div>
                      {patient.nextAppointment && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-600">
                            Next: {new Date(patient.nextAppointment).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Contact Info */}
                    {(patient.phone || patient.email) && (
                      <div className="space-y-1 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-200">
                        {patient.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-3 w-3" />
                            <span>{patient.phone}</span>
                          </div>
                        )}
                        {patient.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{patient.email}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Status and Records Count */}
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status.toLowerCase())}`}>
                        {patient.status}
                      </span>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600">{patient.recordCount || 0} records</span>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
                      </div>
                    </div>

                    {/* Urgent indicator */}
                    {patient.hasUrgentRecords && (
                      <div className="mt-3 flex items-center space-x-2 text-xs text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                        <AlertCircle className="h-3 w-3" />
                        <span className="font-medium">Has urgent records</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientSelector;
