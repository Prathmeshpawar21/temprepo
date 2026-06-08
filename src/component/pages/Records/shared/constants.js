/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/shared/constants.js

import { 
  Pill, 
  FlaskConical, 
  Activity, 
  FileText, 
  Syringe, 
  Shield,
  File
} from 'lucide-react';

/**
 * Document Categories with Icons and Colors
 * ✅ MATCHES BACKEND SCHEMA EXACTLY
 */
export const DOCUMENT_CATEGORIES = {
  prescription: {
    value: 'prescription',
    label: 'Prescription',
    description: 'Prescriptions from doctors',
    icon: Pill,
    color: 'blue',
    bgColor: 'bg-blue-500',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    gradient: 'from-blue-400 to-blue-600',
  },
  lab_report: {  // ✅ FIXED: was 'test_result'
    value: 'lab_report',
    label: 'Lab Report',
    description: 'Lab tests, blood work, pathology',
    icon: FlaskConical,
    color: 'purple',
    bgColor: 'bg-purple-500',
    bgLight: 'bg-purple-50',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    gradient: 'from-purple-400 to-purple-600',
  },
  radiology: {  // ✅ FIXED: was 'imaging'
    value: 'radiology',
    label: 'Radiology',
    description: 'X-rays, CT, MRI, ultrasound',
    icon: Activity,
    color: 'green',
    bgColor: 'bg-green-500',
    bgLight: 'bg-green-50',
    textColor: 'text-green-600',
    borderColor: 'border-green-200',
    gradient: 'from-green-400 to-green-600',
  },
  discharge_summary: {  // ✅ FIXED: was 'report'
    value: 'discharge_summary',
    label: 'Discharge Summary',
    description: 'Hospital discharge summaries',
    icon: FileText,
    color: 'teal',
    bgColor: 'bg-teal-500',
    bgLight: 'bg-teal-50',
    textColor: 'text-teal-600',
    borderColor: 'border-teal-200',
    gradient: 'from-teal-400 to-teal-600',
  },
  vaccination_record: {  // ✅ FIXED: was 'vaccination'
    value: 'vaccination_record',
    label: 'Vaccination Record',
    description: 'Immunization records',
    icon: Syringe,
    color: 'pink',
    bgColor: 'bg-pink-500',
    bgLight: 'bg-pink-50',
    textColor: 'text-pink-600',
    borderColor: 'border-pink-200',
    gradient: 'from-pink-400 to-pink-600',
  },
  insurance_document: {  // ✅ FIXED: was 'insurance'
    value: 'insurance_document',
    label: 'Insurance Document',
    description: 'Insurance documents, claims',
    icon: Shield,
    color: 'yellow',
    bgColor: 'bg-yellow-500',
    bgLight: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    borderColor: 'border-yellow-200',
    gradient: 'from-yellow-400 to-yellow-600',
  },
  // ✅ REMOVED: 'emergency' (doesn't exist in backend)
  other: {
    value: 'other',
    label: 'Other',
    description: 'Other medical documents',
    icon: File,
    color: 'gray',
    bgColor: 'bg-gray-500',
    bgLight: 'bg-gray-50',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-200',
    gradient: 'from-gray-400 to-gray-600',
  },
};

/**
 * Category list for dropdowns
 */
export const CATEGORY_LIST = Object.values(DOCUMENT_CATEGORIES);

/**
 * Get category config by value
 * ✅ ADDED FALLBACK FOR OLD VALUES
 */
export const getCategoryConfig = (categoryValue) => {
  // Direct match
  if (DOCUMENT_CATEGORIES[categoryValue]) {
    return DOCUMENT_CATEGORIES[categoryValue];
  }
  
  // Fallback mapping for old category values (for existing data)
  const fallbackMapping = {
    'test_result': 'lab_report',
    'imaging': 'radiology',
    'report': 'discharge_summary',
    'vaccination': 'vaccination_record',
    'insurance': 'insurance_document',
    'emergency': 'other',
  };
  
  const mappedValue = fallbackMapping[categoryValue];
  return DOCUMENT_CATEGORIES[mappedValue] || DOCUMENT_CATEGORIES.other;
};

/**
 * Accepted file types for upload
 */
export const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
};

/**
 * Max file sizes (in bytes)
 */
export const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024, // 10MB
  pdf: 25 * 1024 * 1024, // 25MB
  document: 15 * 1024 * 1024, // 15MB
  default: 10 * 1024 * 1024, // 10MB
};

/**
 * Sort options for document list
 */
export const SORT_OPTIONS = [
  { value: 'created_at', label: 'Upload Date' },
  { value: 'updated_at', label: 'Last Modified' },
  { value: 'title', label: 'Title (A-Z)' },
  { value: 'category', label: 'Category' },
  { value: 'file_size', label: 'File Size' },
  { value: 'document_date', label: 'Document Date' },
];

/**
 * Items per page options
 */
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100];

/**
 * Default pagination settings
 */
export const DEFAULT_PAGINATION = {
  page: 1,
  page_size: 20,
  sort_by: 'created_at',
  sort_order: 'desc',
};

/**
 * Privacy and security information
 */
export const PRIVACY_INFO = [
  'All medical records are encrypted and stored securely',
  'Only you and authorized healthcare providers can access your records',
  'We comply with HIPAA regulations to protect your privacy',
  'Keep your login credentials secure and never share them',
  'Report any unauthorized access immediately to our support team',
];

/**
 * Upload guidelines
 */
export const UPLOAD_GUIDELINES = [
  'Supported formats: PDF, Images (JPG, PNG, GIF, WEBP), Word documents',
  'Maximum file size: 10MB per document',
  'Ensure documents are clear and legible',
  'Remove any sensitive information not related to your medical care',
  'Add relevant tags and notes to help organize your records',
];

/**
 * Common medical tags for suggestions
 */
export const SUGGESTED_TAGS = [
  'urgent',
  'follow-up',
  'chronic',
  'acute',
  'routine',
  'pre-op',
  'post-op',
  'annual',
  'referral',
  'consultation',
  'emergency',
  'preventive',
  'diagnostic',
  'treatment',
];
