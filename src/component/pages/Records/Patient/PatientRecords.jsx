/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/Patient/PatientRecords.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Loader2, AlertCircle, Wifi, WifiOff, Trash2 } from 'lucide-react';

// Components
import RecordsHeader from './components/RecordsHeader';
import StatsGrid from './components/StatsGrid';
import SearchAndFilters from './components/SearchAndFilters';
import RecordsList from './components/RecordsList';
import Pagination from './components/Pagination';
import BulkActions from './components/BulkActions';
import EmptyState from './components/EmptyState';
import PrivacyNotice from './components/PrivacyNotice';

// Modals
import UploadModal from './modals/UploadModal';
import RecordDetailsModal from './modals/RecordDetailsModal';
import EditModal from './modals/EditModal';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import TrashModal from './modals/TrashModal';


// Hooks
import { usePatientRecords } from '../hooks/usePatientRecords';
import patientRecordsAPI from '../../../../api/patient/patient_records.api';

const PatientRecords = () => {
  const {
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
    refreshDocuments,
    refreshStatistics,
    trashedDocuments,
    trashLoading,
    trashPagination,
    fetchTrash,
    restoreDocument,
} = usePatientRecords();

  // UI States
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]); // For bulk actions
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [healthStatus, setHealthStatus] = useState('checking');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);


  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Health check on mount
  useEffect(() => {
    checkHealth();
    fetchCategories();
  }, []);

  /**
   * Health check
   */
  const checkHealth = async () => {
    try {
      await patientRecordsAPI.healthCheck();
      setHealthStatus('healthy');
    } catch (err) {
      setHealthStatus('error');
    }
  };

  /**
   * Fetch available categories
   */
  const fetchCategories = async () => {
    try {
      const categories = await patientRecordsAPI.getCategories();
      setAvailableCategories(categories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  /**
   * Handle refresh
   */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refreshDocuments(), refreshStatistics()]);
    setIsRefreshing(false);
  };

  /**
   * Handle view document
   */
  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setIsDetailsModalOpen(true);
  };

  /**
   * Handle edit document
   */
  const handleEditDocument = (document) => {
    setSelectedDocument(document);
    setIsEditModalOpen(true);
  };

  /**
   * Handle delete document
   */
  const handleDeleteDocument = (document) => {
    setSelectedDocument(document);
    setIsDeleteModalOpen(true);
  };

  /**
   * Handle bulk delete
   */
  const handleBulkDelete = async (permanent = false) => {
    try {
      await patientRecordsAPI.bulkDelete(selectedDocuments, permanent);
      setSelectedDocuments([]);
      await Promise.all([refreshDocuments(), refreshStatistics()]);
    } catch (err) {
      console.error('Bulk delete failed:', err);
    }
  };

  /**
   * Toggle document selection
   */
  const toggleDocumentSelection = (documentId) => {
    setSelectedDocuments(prev => {
      if (prev.includes(documentId)) {
        return prev.filter(id => id !== documentId);
      } else {
        return [...prev, documentId];
      }
    });
  };

  /**
   * Select all documents
   */
  const selectAllDocuments = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(documents.map(doc => doc.id));
    }
  };

  /**
   * Loading state
   */
  if (loading && !documents.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your records...</p>
        </div>
      </div>
    );
  }

  /**
   * Error state
   */
  if (error && !documents.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Failed to Load Records</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notifications */}
      <Toaster position="top-right" />

      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <RecordsHeader
          currentTime={currentTime}
          healthStatus={healthStatus}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onUploadClick={() => setIsUploadModalOpen(true)}
        />

        {/* ── Trash Button ── */}
        <div className="flex justify-end -mt-4">
          <button
            onClick={() => setIsTrashModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl transition-all"
          >
            <Trash2 className="w-4 h-4" />
            View Trash
            {trashPagination.total > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                {trashPagination.total}
              </span>
            )}
          </button>
        </div>



        {/* Statistics Grid */}
        <StatsGrid statistics={statistics} />

        {/* Search and Filters */}
        <SearchAndFilters
          filters={filters}
          onFiltersChange={updateFilters}
          onReset={resetFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          availableCategories={availableCategories}
        />

        {/* Bulk Actions Toolbar */}
        {selectedDocuments.length > 0 && (
          <BulkActions
            selectedCount={selectedDocuments.length}
            totalCount={documents.length}
            onSelectAll={selectAllDocuments}
            onClearSelection={() => setSelectedDocuments([])}
            onBulkDelete={handleBulkDelete}
          />
        )}

        {/* Records List */}
        {documents.length > 0 ? (
          <>
            <RecordsList
              documents={documents}
              viewMode={viewMode}
              selectedDocuments={selectedDocuments}
              onToggleSelection={toggleDocumentSelection}
              onView={handleViewDocument}
              onEdit={handleEditDocument}
              onDelete={handleDeleteDocument}
              onDownload={downloadDocument}
            />

            {/* Pagination */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.total_pages}
              hasNext={pagination.has_next}
              hasPrev={pagination.has_prev}
              onPageChange={changePage}
              totalItems={pagination.total}
            />
          </>
        ) : (
          <EmptyState onUploadClick={() => setIsUploadModalOpen(true)} />
        )}

        {/* Privacy Notice */}
        <PrivacyNotice />
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={uploadDocument}
        availableCategories={availableCategories}
      />

      <RecordDetailsModal
        isOpen={isDetailsModalOpen}
        document={selectedDocument}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedDocument(null);
        }}
        onEdit={() => {
          setIsDetailsModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={() => {
          setIsDetailsModalOpen(false);
          setIsDeleteModalOpen(true);
        }}
        onDownload={downloadDocument}
      />

      <EditModal
        isOpen={isEditModalOpen}
        document={selectedDocument}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDocument(null);
        }}
        onUpdate={updateDocument}
        availableCategories={availableCategories}
      />


      <TrashModal
      isOpen={isTrashModalOpen}
      onClose={() => setIsTrashModalOpen(false)}
      trashedDocuments={trashedDocuments}
      trashLoading={trashLoading}
      trashPagination={trashPagination}
      onFetchTrash={fetchTrash}
      onRestore={restoreDocument}
      onPermanentDelete={deleteDocument}  // reuses existing deleteDocument(id, permanent=true)
    />


      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        document={selectedDocument}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDocument(null);
        }}
        onConfirm={async (permanent) => {
          await deleteDocument(selectedDocument.id, permanent);
          setIsDeleteModalOpen(false);
          setSelectedDocument(null);
        }}
      />
    </div>
  );
};

export default PatientRecords;
