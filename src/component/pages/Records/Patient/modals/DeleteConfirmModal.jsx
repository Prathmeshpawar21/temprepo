/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/Patient/modals/DeleteConfirmModal.jsx

import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DeleteConfirmModal = ({ isOpen, document, onClose, onConfirm }) => {
  const [deleteType, setDeleteType] = useState('soft'); // 'soft' or 'permanent'
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm(deleteType === 'permanent');
    } finally {
      setDeleting(false);
    }
  };

  if (!document) return null;

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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
          >
            {/* Header */}
            <div className="bg-red-50 border-b border-red-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-red-900">Delete Document?</h2>
                  <p className="text-sm text-red-700">This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={deleting}
                className="p-2 hover:bg-red-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-red-600" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              
              {/* Document Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                {/* <p className="text-sm text-gray-600 mb-1">You are about to delete:</p> */}
                <p className="font-semibold text-gray-900 break-words">
                  {document.title || document.original_filename}
                </p>
                <p className="text-sm text-gray-600 mt-1 capitalize">
                  {document.category.replace('_', ' ')} • {document.file_extension?.toUpperCase()}
                </p>
              </div>

              {/* Delete Options */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">Choose deletion type:</p>
                
                {/* Soft Delete Option */}
                <label className="flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50">
                  <input
                    type="radio"
                    name="deleteType"
                    value="soft"
                    checked={deleteType === 'soft'}
                    onChange={(e) => setDeleteType(e.target.value)}
                    className="mt-1 w-5 h-5 text-orange-500 focus:ring-orange-500"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-semibold text-gray-900">Soft Delete (Recommended)</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Move to trash. Can be recovered later if needed.
                    </p>
                  </div>
                </label>

                {/* Permanent Delete Option */}
                <label className="flex items-start p-4 border-2 border-red-300 rounded-xl cursor-pointer transition-all hover:bg-red-50">
                  <input
                    type="radio"
                    name="deleteType"
                    value="permanent"
                    checked={deleteType === 'permanent'}
                    onChange={(e) => setDeleteType(e.target.value)}
                    className="mt-1 w-5 h-5 text-red-500 focus:ring-red-500"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-semibold text-red-900">Permanent Delete</p>
                    <p className="text-sm text-red-700 mt-1">
                      Delete forever. This cannot be undone.
                    </p>
                  </div>
                </label>
              </div>

              {/* Warning */}
              {deleteType === 'permanent' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-800">
                      <p className="font-semibold mb-1">Warning!</p>
                      <p>
                        Permanently deleted documents cannot be recovered. Make sure you have a backup 
                        if you need this document in the future.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={deleting}
                  className={`flex-1 px-6 py-3 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                    deleteType === 'permanent'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      {deleteType === 'permanent' ? 'Delete Forever' : 'Move to Trash'}
                    </>
                  )}
                </button>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
