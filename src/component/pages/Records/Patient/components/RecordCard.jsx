/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/Patient/components/RecordCard.jsx

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, 
  FlaskConical, 
  Activity, 
  FileText, 
  Syringe, 
  File,
  Download, 
  Edit3,
  Trash2,
  Clock,
  Target,
  ChevronRight
} from 'lucide-react';

const RecordCard = ({ 
  document, 
  viewMode, 
  isSelected,
  onToggleSelection,
  onView, 
  onEdit,
  onDelete,
  onDownload,
  index,
  selectionMode,
  onEnterSelectionMode
}) => {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimer = useRef(null);
  const LONG_PRESS_DURATION = 800; // 0.8 seconds

  const getCategoryIcon = (category) => {
    const icons = {
      prescription: Pill,
      test_result: FlaskConical,
      imaging: Activity,
      report: FileText,
      vaccination: Syringe,
    };
    const Icon = icons[category] || File;
    return <Icon className="h-5 w-5" />;
  };


  

  const getCategoryColor = (category) => {
    const colors = {
      prescription: 'bg-blue-50',
      lab_report: 'bg-purple-50',
      radiology: 'bg-green-50',
      discharge_summary: 'bg-yellow-50',
      vaccination_record: 'bg-pink-50',
      insurance_document: 'bg-yellow-50',
      other: 'bg-gray-50',
    };
    return colors[category] || 'bg-gray-800';
  };




  const getCategoryTextColor = (category) => {
    const colors = {
      prescription: 'text-blue-600',
      lab_report: 'text-purple-600',
      radiology: 'text-green-600',
      discharge_summary: 'text-yellow-600',
      vaccination_record: 'text-pink-600',
      insurance_document: 'text-yellow-600',
      other: 'text-gray-600',
    };
    return colors[category] || 'text-gray-800';
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Long press handlers
  const handleLongPressStart = (e) => {
    e.preventDefault();
    setIsLongPressing(true);
    
    longPressTimer.current = setTimeout(() => {
      // Vibrate on mobile devices
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      onEnterSelectionMode();
      setIsLongPressing(false);
    }, LONG_PRESS_DURATION);
  };

  const handleLongPressEnd = () => {
    setIsLongPressing(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleCardClick = () => {
    if (selectionMode) {
      onToggleSelection(document.id);
    } else {
      onView(document);
    }
  };

  if (viewMode === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`bg-white rounded-2xl shadow border overflow-hidden hover:shadow-md transition-all cursor-pointer group relative ${
          isSelected ? 'ring-2 ring-teal-500 border-teal-500' : 'border-gray-200'
        } ${isLongPressing ? 'scale-95' : ''}`}
        onClick={handleCardClick}
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onMouseLeave={handleLongPressEnd}
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
        onTouchCancel={handleLongPressEnd}
      >
        {/* Selection Checkbox - Only show in selection mode */}
        <AnimatePresence>
          {selectionMode && (
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute top-3 left-3 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelection(document.id)}
                className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4 min-w-0 overflow-hidden">
            {/* ✅ min-w-0 + overflow-hidden on every flex parent in the chain */}
            <div className="flex items-center space-x-3 min-w-0 overflow-hidden flex-1">
              {/* Icon — fixed size, never shrinks */}
              <div className={`w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center ${getCategoryColor(document.category)} shadow group-hover:scale-110 transition-transform`}>
                <div className={`${getCategoryTextColor(document.category)}`}>
                  {getCategoryIcon(document.category)}
                </div>
              </div>
              {/* Text — constrained to remaining space */}
              <div className="min-w-0 flex-1 overflow-hidden">
                <h3
                  className="text-lg font-semibold text-gray-900 truncate"
                  title={document.title || document.original_filename}
                >
                  {document.title || document.original_filename}
                </h3>
                <p className="text-sm text-gray-600 capitalize truncate">
                  {document.category.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center">
                <File className="h-4 w-4 mr-2" />
                File Type
              </span>
              <span className="font-medium text-gray-900">
                {document.file_extension?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Action buttons - Hide in selection mode */}
          {!selectionMode && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {new Date(document.created_at).toLocaleDateString()}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(document.id, document.original_filename);
                  }}
                  className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(document);
                  }}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit3 className="h-4 w-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(document);
                  }}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Selection mode date */}
          {selectionMode && (
            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {new Date(document.created_at).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // List View
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white rounded-2xl shadow border overflow-hidden hover:shadow-md transition-all cursor-pointer group flex items-center p-6 ${
        isSelected ? 'ring-2 ring-teal-500 border-teal-500' : 'border-gray-200'
      } ${isLongPressing ? 'scale-95' : ''}`}
      onClick={handleCardClick}
      onMouseDown={handleLongPressStart}
      onMouseUp={handleLongPressEnd}
      onMouseLeave={handleLongPressEnd}
      onTouchStart={handleLongPressStart}
      onTouchEnd={handleLongPressEnd}
      onTouchCancel={handleLongPressEnd}
    >
      {/* Selection Checkbox - Only show in selection mode */}
      <AnimatePresence>
        {selectionMode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={(e) => e.stopPropagation()} 
            className="mr-4"
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelection(document.id)}
              className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center space-x-4 flex-1">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getCategoryColor(document.category)} shadow`}>
           <div className={`${getCategoryTextColor(document.category)}`}>
            {getCategoryIcon(document.category)}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2 gap-2 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate min-w-0 flex-1" title={document.title || document.original_filename}>
              {document.title || document.original_filename}
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize flex-shrink-0">
              {document.category.replace('_', ' ')}
            </span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <span className="flex items-center">
              <File className="h-4 w-4 mr-1" />
              {document.file_extension?.toUpperCase()}
            </span>
            <span className="flex items-center">
              <Target className="h-4 w-4 mr-1" />
              {formatFileSize(document.file_size)}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {getRelativeTime(document.created_at)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Action buttons - Hide in selection mode */}
      {!selectionMode && (
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(document.id, document.original_filename);
            }}
            className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(document);
            }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit3 className="h-4 w-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(document);
            }}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors ml-2" />
        </div>
      )}
    </motion.div>
  );
};

export default RecordCard;
