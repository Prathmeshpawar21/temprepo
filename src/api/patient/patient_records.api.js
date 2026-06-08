/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/api/patient/patient_records.api.js
import api from '../api';

const BASE_URL = '/patient-records';

/**
 * Patient Records API Service
 * Handles all document management operations
 */
export const patientRecordsAPI = {
  /**
   * Upload a new document
   * @param {File} file - Document file
   * @param {Object} metadata - Document metadata
   * @returns {Promise<Object>} Uploaded document
   */
  uploadDocument: async (file, metadata) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', metadata.category);
      
      if (metadata.title) formData.append('title', metadata.title);
      if (metadata.notes) formData.append('notes', metadata.notes);
      if (metadata.tags?.length) formData.append('tags', metadata.tags.join(','));
      if (metadata.doctor_name) formData.append('doctor_name', metadata.doctor_name);
      if (metadata.hospital_name) formData.append('hospital_name', metadata.hospital_name);
      if (metadata.document_date) formData.append('document_date', metadata.document_date);

      const response = await api.post(`${BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  },

  /**
   * List documents with filters and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Paginated document list
   */
  listDocuments: async (params = {}) => {
    try {
      const response = await api.get(`${BASE_URL}/list`, { params });
      return response.data;
    } catch (error) {
      console.error('List documents failed:', error);
      throw error;
    }
  },

  /**
   * Get single document by ID
   * @param {number} documentId - Document ID
   * @returns {Promise<Object>} Document details
   */
  getDocument: async (documentId) => {
    try {
      const response = await api.get(`${BASE_URL}/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('Get document failed:', error);
      throw error;
    }
  },

  /**
   * Update document metadata
   * @param {number} documentId - Document ID
   * @param {Object} updateData - Updated metadata
   * @returns {Promise<Object>} Updated document
   */
  updateDocument: async (documentId, updateData) => {
    try {
      const response = await api.patch(`${BASE_URL}/${documentId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Update document failed:', error);
      throw error;
    }
  },

  /**
   * Delete document
   * @param {number} documentId - Document ID
   * @param {boolean} permanent - Permanent delete flag
   * @returns {Promise<Object>} Delete result
   */
  deleteDocument: async (documentId, permanent = false) => {
    try {
      const response = await api.delete(`${BASE_URL}/${documentId}`, {
        params: { permanent },
      });
      return response.data;
    } catch (error) {
      console.error('Delete document failed:', error);
      throw error;
    }
  },

  /**
   * Bulk delete documents
   * @param {Array<number>} documentIds - Array of document IDs
   * @param {boolean} permanent - Permanent delete flag
   * @returns {Promise<Object>} Bulk delete result
   */
  bulkDelete: async (documentIds, permanent = false) => {
    try {
      const response = await api.post(`${BASE_URL}/bulk-delete`, {
        document_ids: documentIds,
        permanent,
      });
      return response.data;
    } catch (error) {
      console.error('Bulk delete failed:', error);
      throw error;
    }
  },

  /**
   * Get download URL for document
   * @param {number} documentId - Document ID
   * @param {number} expiration - URL expiration in seconds
   * @returns {Promise<Object>} Download URL and metadata
   */
  getDownloadUrl: async (documentId, expiration = 3600) => {
    try {
      const response = await api.get(`${BASE_URL}/${documentId}/download`, {
        params: { expiration },
      });
      return response.data;
    } catch (error) {
      console.error('Get download URL failed:', error);
      throw error;
    }
  },

  /**
   * Get document statistics
   * @returns {Promise<Object>} Statistics overview
   */
  getStatistics: async () => {
    try {
      const response = await api.get(`${BASE_URL}/stats/overview`);
      return response.data;
    } catch (error) {
      console.error('Get statistics failed:', error);
      throw error;
    }
  },

  /**
   * Get available categories
   * @returns {Promise<Array<string>>} List of categories
   */
  getCategories: async () => {
    try {
      const response = await api.get(`${BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Get categories failed:', error);
      throw error;
    }
  },


  /**
   * List soft-deleted (trashed) documents
   * @param {Object} params - page, page_size
   * @returns {Promise<Object>} Paginated trash list
   */
  listTrash: async (params = {}) => {
    try {
      const response = await api.get(`${BASE_URL}/trash`, { params });
      return response.data;
    } catch (error) {
      console.error('List trash failed:', error);
      throw error;
    }
  },


  /**
   * Restore a soft-deleted document from trash
   * @param {number} documentId - Document ID
   * @returns {Promise<Object>} Restored document
   */
  restoreDocument: async (documentId) => {
    try {
      const response = await api.post(`${BASE_URL}/${documentId}/restore`);
      return response.data;
    } catch (error) {
      console.error('Restore document failed:', error);
      throw error;
    }
  },



  /**
   * Health check
   * @returns {Promise<Object>} Service health status
   */
  healthCheck: async () => {
    try {
      const response = await api.get(`${BASE_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },
};

export default patientRecordsAPI;
