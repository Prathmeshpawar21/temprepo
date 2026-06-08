/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Trash2, RotateCcw, Loader2, FileText,
  AlertTriangle, Inbox, ChevronLeft, ChevronRight
} from 'lucide-react';

// ── helpers ──────────────────────────────────────────────────
const CATEGORY_COLORS = {
  prescription:       'bg-blue-100 text-blue-700',
  lab_report:         'bg-purple-100 text-purple-700',
  radiology:          'bg-green-100 text-green-700',
  discharge_summary:  'bg-orange-100 text-orange-700',
  vaccination_record: 'bg-pink-100 text-pink-700',
  insurance_document: 'bg-yellow-100 text-yellow-700',
  other:              'bg-gray-100 text-gray-700',
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
    timeZone: 'Asia/Kolkata',
  });
};

const formatSize = (bytes) => {
  if (!bytes) return '—';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};
// ─────────────────────────────────────────────────────────────

const TrashModal = ({
  isOpen,
  onClose,
  trashedDocuments,
  trashLoading,
  trashPagination,
  onFetchTrash,
  onRestore,
  onPermanentDelete,
}) => {
  const [confirmDeleteId, setConfirmDeleteId]   = useState(null);
  const [actionLoadingId, setActionLoadingId]   = useState(null);

  // Fetch trash whenever modal opens
  useEffect(() => {
    if (isOpen) onFetchTrash(1);
  }, [isOpen]);

  const handleRestore = async (documentId) => {
    setActionLoadingId(documentId);
    try {
      await onRestore(documentId);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePermanentDelete = async (documentId) => {
    setActionLoadingId(documentId);
    try {
      await onPermanentDelete(documentId, true); // permanent = true
      setConfirmDeleteId(null);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{   scale: 0.92, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
          >

            {/* ── Header ── */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-6 py-5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Trash</h2>
                  <p className="text-gray-300 text-sm">
                    {trashPagination.total} deleted document{trashPagination.total !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* ── Info banner ── */}
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-2 flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Trashed documents are kept in storage. Permanently delete to remove them completely.
              </p>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-y-auto p-6">

              {/* Loading */}
              {trashLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
                  <p className="text-gray-500 text-sm">Loading trash...</p>
                </div>

              /* Empty */
              ) : trashedDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <Inbox className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700">Trash is empty</p>
                    <p className="text-sm text-gray-500 mt-1">Soft-deleted documents will appear here</p>
                  </div>
                </div>

              /* Document list */
              ) : (
                <div className="space-y-3">
                  {trashedDocuments.map((doc) => {
                    const isActioning = actionLoadingId === doc.id;
                    const isConfirming = confirmDeleteId === doc.id;

                    return (
                      <motion.div
                        key={doc.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="border border-gray-200 rounded-2xl p-4 bg-gray-50 hover:bg-white hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-4">

                          {/* Icon */}
                          <div className="w-11 h-11 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-gray-500" />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {doc.title || doc.original_filename}
                            </p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize ${CATEGORY_COLORS[doc.category] || CATEGORY_COLORS.other}`}>
                                {doc.category.replace(/_/g, ' ')}
                              </span>
                              <span className="text-xs text-gray-400">
                                {doc.file_extension?.toUpperCase()} • {formatSize(doc.file_size)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              🗑️ Deleted {formatDate(doc.deleted_at)}
                            </p>
                          </div>

                          {/* Actions */}
                          {!isConfirming ? (
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {/* Restore */}
                              <button
                                onClick={() => handleRestore(doc.id)}
                                disabled={isActioning}
                                title="Restore document"
                                className="flex items-center gap-1.5 px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                              >
                                {isActioning ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <RotateCcw className="w-4 h-4" />
                                )}
                                Restore
                              </button>

                              {/* Delete forever */}
                              <button
                                onClick={() => setConfirmDeleteId(doc.id)}
                                disabled={isActioning}
                                title="Delete permanently"
                                className="p-2 hover:bg-red-100 text-red-500 hover:text-red-700 rounded-xl transition-all disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            /* Inline confirm */
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center gap-2 flex-shrink-0"
                            >
                              <span className="text-xs text-red-700 font-semibold">Delete forever?</span>
                              <button
                                onClick={() => handlePermanentDelete(doc.id)}
                                disabled={isActioning}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-1"
                              >
                                {isActioning
                                  ? <Loader2 className="w-3 h-3 animate-spin" />
                                  : 'Yes, delete'
                                }
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-100 transition-all"
                              >
                                Cancel
                              </button>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Pagination (only if more than 1 page) ── */}
            {trashPagination.total_pages > 1 && (
              <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 bg-white">
                <p className="text-sm text-gray-500">
                  Page {trashPagination.page} of {trashPagination.total_pages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onFetchTrash(trashPagination.page - 1)}
                    disabled={!trashPagination.has_prev || trashLoading}
                    className="p-2 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => onFetchTrash(trashPagination.page + 1)}
                    disabled={!trashPagination.has_next || trashLoading}
                    className="p-2 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TrashModal;
