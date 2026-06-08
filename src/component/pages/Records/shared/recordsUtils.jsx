/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/shared/recordsUtils.js

import { 
  FileText, 
  TestTube, 
  Pill, 
  Camera, 
  Stethoscope, 
  Shield, 
  Lock, 
  AlertCircle 
} from 'lucide-react';

/**
 * Record Categories Configuration
 */
export const recordCategories = [
  { id: 'medical-reports', label: 'Medical Reports', icon: <FileText />, color: 'bg-blue-50', text: 'text-blue-600' },
  { id: 'test-results', label: 'Test Results', icon: <TestTube />, color: 'bg-purple-50', text: 'text-purple-600' },
  { id: 'prescriptions', label: 'Prescriptions', icon: <Pill />, color: 'bg-green-50', text: 'text-green-600' },
  { id: 'imaging', label: 'Medical Imaging', icon: <Camera />, color: 'bg-orange-50', text: 'text-orange-600' },
  { id: 'consultations', label: 'Consultations', icon: <Stethoscope />, color: 'bg-teal-50', text: 'text-teal-600' },
  { id: 'vaccinations', label: 'Vaccinations', icon: <Shield />, color: 'bg-indigo-50', text: 'text-indigo-600' },
  { id: 'insurance', label: 'Insurance', icon: <Lock />, color: 'bg-yellow-50', text: 'text-yellow-600' },
  { id: 'emergency', label: 'Emergency', icon: <AlertCircle />, color: 'bg-red-50', text: 'text-red-600' }
];

/**
 * Get category information by ID
 */
export const getCategoryInfo = (categoryId) => {
  return recordCategories.find(cat => cat.id === categoryId) || 
         { label: 'Other', icon: <FileText />, color: 'bg-gray-50', text: 'text-gray-600' };
};

/**
 * Get status color classes
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'active': 
      return 'bg-green-100 text-green-700 border-green-200';
    case 'pending': 
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'archived': 
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'expired': 
      return 'bg-red-100 text-red-700 border-red-200';
    default: 
      return 'bg-blue-100 text-blue-700 border-blue-200';
  }
};

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file type icon class
 */
export const getFileTypeIcon = (fileType) => {
  if (fileType?.includes('image')) return 'text-blue-600';
  if (fileType?.includes('pdf')) return 'text-red-600';
  if (fileType?.includes('doc')) return 'text-blue-600';
  return 'text-gray-600';
};

/**
 * Calculate statistics from records
 */
export const calculateRecordStats = (records) => {
  const total = records.length;
  
  const byCategory = recordCategories.reduce((acc, cat) => {
    acc[cat.id] = records.filter(r => r.category === cat.id).length;
    return acc;
  }, {});
  
  const recent = records.filter(r => 
    new Date(r.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;
  
  const shared = records.filter(r => r.isShared).length;
  
  return { total, byCategory, recent, shared };
};

/**
 * Filter records based on criteria
 */
export const filterRecords = (records, searchTerm, filters, isDoctor = false) => {
  return records.filter(record => {
    const matchesSearch = searchTerm === '' || 
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (isDoctor ? record.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) : 
       record.providerName?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filters.category === 'all' || record.category === filters.category;
    const matchesStatus = filters.status === 'all' || record.status === filters.status;
    
    const matchesTags = filters.tags.length === 0 || 
      filters.tags.every(tag => record.tags?.includes(tag));

    return matchesSearch && matchesCategory && matchesStatus && matchesTags;
  });
};
