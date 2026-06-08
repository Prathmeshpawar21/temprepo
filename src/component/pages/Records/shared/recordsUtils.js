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


/**
 * Format file size to human-readable format
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format date to readable format
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format datetime to readable format
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toUpperCase() : '';
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Validate file size
 */
export const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

/**
 * Validate file type
 */
export const validateFileType = (file, acceptedTypes) => {
  const fileType = file.type;
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  
  // Check MIME type
  if (acceptedTypes[fileType]) {
    return true;
  }
  
  // Check extension
  for (const mimeType in acceptedTypes) {
    if (acceptedTypes[mimeType].includes(fileExtension)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Get file validation errors
 */
export const getFileValidationError = (file, maxSize, acceptedTypes) => {
  if (!file) {
    return 'No file selected';
  }
  
  if (!validateFileSize(file, maxSize)) {
    return `File size exceeds ${formatFileSize(maxSize)}`;
  }
  
  if (!validateFileType(file, acceptedTypes)) {
    return 'File type not supported';
  }
  
  return null;
};

/**
 * Convert ISO date to input date format (YYYY-MM-DD)
 */
export const toInputDate = (isoString) => {
  if (!isoString) return '';
  return isoString.split('T')[0];
};

/**
 * Convert input date to ISO format
 */
export const toISODate = (inputDate) => {
  if (!inputDate) return null;
  return new Date(inputDate).toISOString();
};

/**
 * Group documents by category
 */
export const groupByCategory = (documents) => {
  return documents.reduce((acc, doc) => {
    const category = doc.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(doc);
    return acc;
  }, {});
};

/**
 * Sort documents
 */
export const sortDocuments = (documents, sortBy, sortOrder = 'desc') => {
  const sorted = [...documents].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    // Handle dates
    if (sortBy.includes('date') || sortBy === 'created_at' || sortBy === 'updated_at') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    
    // Handle strings
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
  
  return sorted;
};

/**
 * Filter documents by search query
 */
export const filterDocuments = (documents, query) => {
  if (!query) return documents;
  
  const lowerQuery = query.toLowerCase();
  
  return documents.filter(doc => {
    return (
      doc.title?.toLowerCase().includes(lowerQuery) ||
      doc.original_filename?.toLowerCase().includes(lowerQuery) ||
      doc.category?.toLowerCase().includes(lowerQuery) ||
      doc.notes?.toLowerCase().includes(lowerQuery) ||
      doc.doctor_name?.toLowerCase().includes(lowerQuery) ||
      doc.hospital_name?.toLowerCase().includes(lowerQuery) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  });
};

/**
 * Parse tags string to array
 */
export const parseTags = (tagsString) => {
  if (!tagsString) return [];
  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
};

/**
 * Format tags array to string
 */
export const formatTags = (tagsArray) => {
  if (!tagsArray || !Array.isArray(tagsArray)) return '';
  return tagsArray.join(', ');
};

/**
 * Check if document is recent (uploaded in last 7 days)
 */
export const isRecentDocument = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

/**
 * Get health status color
 */
export const getHealthStatusColor = (status) => {
  const colors = {
    healthy: 'text-green-600',
    checking: 'text-gray-400',
    error: 'text-red-600',
  };
  return colors[status] || colors.checking;
};

/**
 * Download file from URL
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
