/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/Patient/hooks/usePatientRecords.js
import { useState, useEffect, useCallback } from 'react';
import patientRecordsAPI from '../../../../api/patient/patient_records.api';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for managing patient records
 * Handles fetching, uploading, updating, and deleting documents
 */
export const usePatientRecords = () => {
  const [documents, setDocuments] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [trashedDocuments, setTrashedDocuments]   = useState([]);
  const [trashLoading, setTrashLoading]           = useState(false);
  const [trashPagination, setTrashPagination]     = useState({
    total: 0, page: 1, page_size: 20,
    total_pages: 0, has_next: false, has_prev: false,
  });

  
  // Filters state
  const [filters, setFilters] = useState({
    query: '',
    category: null,
    date_from: null,
    date_to: null,
    tags: [],
    page: 1,
    page_size: 20,
    sort_by: 'created_at',
    sort_order: 'desc',
  });
  
  // Pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    page_size: 20,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  });


  
  /**
   * Fetch documents with current filters
   */
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await patientRecordsAPI.listDocuments(filters);
      
      setDocuments(response.documents || []);
      setPagination({
        total: response.total,
        page: response.page,
        page_size: response.page_size,
        total_pages: response.total_pages,
        has_next: response.has_next,
        has_prev: response.has_prev,
      });
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      // setError(err.response?.data?.detail || 'Failed to load documents');
      // toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Fetch statistics
   */
  const fetchStatistics = useCallback(async () => {
    try {
      const stats = await patientRecordsAPI.getStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  }, []);

  /**
   * Upload document
   */
  const uploadDocument = async (file, metadata) => {
    try {
      const uploadedDoc = await patientRecordsAPI.uploadDocument(file, metadata);
      
      toast.success('✅ Document uploaded successfully!');
      
      // Refresh documents and stats
      await Promise.all([fetchDocuments(), fetchStatistics()]);
      
      return uploadedDoc;
    } catch (err) {
      console.error('Upload failed:', err);
      const errorMsg = err.response?.data?.detail || 'Failed to upload document';
      toast.error(errorMsg);
      throw err;
    }
  };

  /**
   * Update document
   */
  const updateDocument = async (documentId, updateData) => {
    try {
      const updatedDoc = await patientRecordsAPI.updateDocument(documentId, updateData);
      
      toast.success('✅ Document updated successfully!');
      
      // Update local state
      setDocuments(prev => 
        prev.map(doc => doc.id === documentId ? updatedDoc : doc)
      );
      
      return updatedDoc;
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('Failed to update document');
      throw err;
    }
  };

  /**
   * Delete document
   */
  const deleteDocument = async (documentId, permanent = false) => {
    try {
      await patientRecordsAPI.deleteDocument(documentId, permanent);

      toast.success(permanent ? '🗑️ Document permanently deleted' : '🗑️ Document deleted');

      // Remove from active documents list
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));

      // ✅ ADD THIS: If permanent, also remove from trash list
      if (permanent) {
        setTrashedDocuments(prev => prev.filter(doc => doc.id !== documentId));
      }

      await fetchStatistics();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete document');
      throw err;
    }
  };

/**
 * Download document — Bug 6 fix
 * Uses fetch → blob → object URL so the browser never navigates away
 */
const downloadDocument = async (documentId, filename) => {
  const toastId = toast.loading('⏳ Preparing download...');
  try {
    const { download_url, filename: serverFilename } =
      await patientRecordsAPI.getDownloadUrl(documentId);

    const downloadName = serverFilename || filename || 'download';

    // Fetch file as blob — browser stays on /records, no navigation
    const response = await fetch(download_url);
    if (!response.ok) throw new Error('Failed to fetch file');

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    // Trigger download via hidden anchor
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = downloadName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke after short delay to let download start
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

    toast.success('📥 Download started', { id: toastId });
  } catch (err) {
    console.error('Download failed:', err);
    toast.error('Failed to download document', { id: toastId });
    throw err;
  }
};




  const fetchTrash = useCallback(async (page = 1, page_size = 20) => {
  try {
    setTrashLoading(true);
    const response = await patientRecordsAPI.listTrash({ page, page_size });
    setTrashedDocuments(response.documents || []);
    setTrashPagination({
      total:       response.total,
      page:        response.page,
      page_size:   response.page_size,
      total_pages: response.total_pages,
      has_next:    response.has_next,
      has_prev:    response.has_prev,
    });
  } catch (err) {
    console.error('Failed to fetch trash:', err);
  } finally {
    setTrashLoading(false);
  }
}, []);

/**
 * Restore a document from trash back to active
 */
const restoreDocument = async (documentId) => {
  try {
    await patientRecordsAPI.restoreDocument(documentId);
    toast.success('♻️ Document restored successfully!');
    // Remove from trash list and refresh active docs + stats
    setTrashedDocuments(prev => prev.filter(doc => doc.id !== documentId));
    await Promise.all([fetchDocuments(), fetchStatistics()]);
  } catch (err) {
    console.error('Restore failed:', err);
    toast.error('Failed to restore document');
    throw err;
  }
};



  /**
   * Update filters
   */
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  /**
   * Reset filters
   */
  const resetFilters = () => {
    setFilters({
      query: '',
      category: null,
      date_from: null,
      date_to: null,
      tags: [],
      page: 1,
      page_size: 20,
      sort_by: 'created_at',
      sort_order: 'desc',
    });
  };

  /**
   * Change page
   */
  const changePage = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };


  // Initial fetch
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  useEffect(() => {
    fetchTrash();  // ← pre-load trash count on mount
  }, [fetchTrash]);


  return {
    documents,
    statistics,
    loading,
    error,
    filters,
    pagination,
    uploadDocument,
    updateDocument,
    deleteDocument,
    downloadDocument,
    updateFilters,
    resetFilters,
    changePage,
    refreshDocuments: fetchDocuments,
    refreshStatistics: fetchStatistics,
    trashedDocuments,
    trashLoading,
    trashPagination,
    fetchTrash,
  restoreDocument,
  };
};

export default usePatientRecords;



