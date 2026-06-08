/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// Components/ConsultHistory/ListView.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // ✅ NEW
import { toast } from 'react-hot-toast'; // ✅ NEW
import {
  Clock,
  ChevronDown,
  FileText,
  User,
  Calendar,
  Bookmark,
  BookmarkCheck,
  Stethoscope,
  Star,
  MessageSquare,
  Phone,
  Video,
  MapPin,
  Target,
  Heart,
  Eye,
  Download,
  Share2,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Trash2,
  Info,
  PlayCircle, // ✅ NEW - Resume icon
  Loader2 // ✅ NEW - Loading icon

} from 'lucide-react';
import EmptyState from './EmptyState';
// ✅ NEW: Import resume API function
// import { resumeConsultation } from '../../../api/consultation_history.api';

const ListView = ({ 
  filteredAndSortedConsultations, 
  expandedId, 
  toggleExpand, 
  toggleBookmark, 
  resetFilters ,
  onResume,        // ✅ from useConsultations hook (handles API + navigate)
  globalResuming,
  onDelete,  
}) => {
  const navigate = useNavigate(); // ✅ NEW
  const [resumingId, setResumingId] = useState(null); // ✅ NEW - Track which consultation is being resumed
  const [deletingId,     setDeletingId]     = useState(null); // API in-flight
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // waiting for confirm

  
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700'; // ✅ FIXED: Added in-progress
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'rescheduled': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-300" />;
      case 'high': return <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-300" />;
      case 'normal': return <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-300" />;
      default: return <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-300" />;
    }
  };

  // ✅ NEW: Handle Resume Chat
// REPLACE the entire handleResumeChat function with:
const handleResumeChat = async (consult, e) => {
  e.stopPropagation();
  if (resumingId || globalResuming) return;

  setResumingId(consult.id);
  toast.loading('Loading previous conversation...', { id: `resume-${consult.id}` });

  try {
    await onResume(consult.id);   // ✅ hook handles API + navigate internally
    toast.success('Conversation loaded!', { id: `resume-${consult.id}` });
  } catch (err) {
    toast.error(
      err?.response?.data?.detail || err?.message || 'Failed to resume',
      { id: `resume-${consult.id}` }
    );
  } finally {
    setResumingId(null);
  }
};


const handleDelete = async (consultId, e) => {
  e.stopPropagation();

  // First click → show inline confirm
  if (confirmDeleteId !== consultId) {
    setConfirmDeleteId(consultId);
    return;
  }

  // Second click (confirmed) → call API
  setDeletingId(consultId);
  setConfirmDeleteId(null);
  try {
    await onDelete(consultId);
    toast.success('Consultation deleted');
  } catch (err) {
    toast.error(err?.message || 'Failed to delete');
  } finally {
    setDeletingId(null);
  }
};


// Cancel confirm on outside interaction
const cancelDelete = (e) => {
  e.stopPropagation();
  setConfirmDeleteId(null);
};




  if (filteredAndSortedConsultations.length === 0) {
    return <EmptyState resetFilters={resetFilters} />;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <ul>
        {filteredAndSortedConsultations.map((consult, index) => {
          const isExpanded = expandedId === consult.id;
          const isResuming = resumingId === consult.id;
          
          return (
            <motion.li
              key={consult.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-all duration-200"
            >
              {/* Expanded Content - Mobile Responsive */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 pt-2 space-y-4 sm:space-y-6">
                      
                      {/* ✅ NEW: Resume Chat Button (at top of expanded section) */}
                      <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg sm:rounded-xl border border-teal-200">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-teal-100 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-teal-600" />
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-gray-900">
                              Continue this consultation
                            </h5>
                            <p className="text-xs text-gray-600">
                              Resume from where you left off • {consult.messageCount || 0} messages
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleResumeChat(consult, e)}
                          disabled={isResuming}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                        >
                          {isResuming ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Loading...</span>
                            </>
                          ) : (
                            <>
                              <PlayCircle className="h-4 w-4" />
                              <span>Resume Chat</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Doctor Info & Quick Actions - Mobile Stacked */}
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Stethoscope className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base sm:text-lg font-bold text-gray-600 truncate">{consult.doctor}</h4>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{consult.doctorSpecialty}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${
                                      i < Math.floor(consult.doctorRating || 0)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] sm:text-xs text-gray-600">{consult.doctorRating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Consultation Details Grid - Mobile Single Column */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Diagnosis</h5>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border ${getSeverityColor(consult.severity)}`}>
                                {consult.diagnosis}
                              </span>
                              {getPriorityIcon(consult.priority)}
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Duration & Cost</h5>
                            <div className="space-y-1">
                              <p className="text-xs sm:text-sm text-gray-900 flex items-center">
                                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-gray-500 flex-shrink-0" />
                                <span className="truncate">{consult.duration}</span>
                              </p>
                              <p className="text-xs sm:text-sm text-gray-900 flex items-center">
                                <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-gray-500 flex-shrink-0" />
                                <span className="truncate">{consult.cost}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Location</h5>
                            <p className="text-xs sm:text-sm text-gray-900 flex items-center">
                              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-gray-500 flex-shrink-0" />
                              <span className="truncate">{consult.location}</span>
                            </p>
                          </div>
                          
                          {consult.nextFollowUp && (
                            <div>
                              <h5 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Follow-up</h5>
                              <p className="text-xs sm:text-sm text-gray-900 flex items-center">
                                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-gray-500 flex-shrink-0" />
                                <span className="truncate">{new Date(consult.nextFollowUp).toLocaleDateString()}</span>
                              </p>
                            </div>
                          )}
                        </div>

                        <div>
                          <h5 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Tags</h5>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {consult.tags?.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-0.5 sm:py-1 bg-teal-100 text-teal-700 text-[10px] sm:text-xs rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Doctor's Notes */}
                      <div>
                        <h5 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 sm:mb-3">Doctor's Notes</h5>
                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-l-4 border-teal-500">
                          <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">{consult.notes}</p>
                        </div>
                      </div>

                      {/* Prescriptions - Mobile Grid */}
                      {consult.prescriptions && consult.prescriptions.length > 0 && (
                        <div>
                          <h5 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 sm:mb-3">Prescriptions</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            {consult.prescriptions.map((prescription, prescIndex) => (
                              <div key={prescIndex} className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200">
                                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                  <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-blue-900 truncate">{prescription}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Documents - Mobile Single Column */}
                      {consult.documents && consult.documents.length > 0 && (
                        <div>
                          <h5 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 sm:mb-3">Documents & Reports</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {consult.documents.map((doc) => (
                              <motion.div
                                key={doc.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group p-3 sm:p-4 bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:shadow-md hover:border-teal-300 transition-all cursor-pointer"
                                onClick={() => doc.url && window.open(doc.url, '_blank')}
                              >
                                <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                                  <div className="p-1.5 sm:p-2 bg-teal-100 rounded-lg flex-shrink-0">
                                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                                    <p className="text-[10px] sm:text-xs text-gray-500">{doc.size}</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] sm:text-xs text-gray-500 truncate">
                                    {new Date(doc.date).toLocaleDateString()}
                                  </span>
                                  <div className="flex space-x-0.5 sm:space-x-1 flex-shrink-0 ml-2">
                                    <button className="p-1 sm:p-1.5 text-gray-400 hover:text-teal-600 transition-colors">
                                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </button>
                                    <button className="p-1 sm:p-1.5 text-gray-400 hover:text-teal-600 transition-colors">
                                      <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </button>
                                    <button className="p-1 sm:p-1.5 text-gray-400 hover:text-teal-600 transition-colors">
                                      <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Always Visible Summary - Mobile Responsive */}
              <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
                  {/* Left Side - Consultation Info */}
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white flex-shrink-0">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-800" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Title and Status */}
                      <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-1.5">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate">
                          {consult.type}
                        </h3>
                        {/* <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full font-medium ${getStatusColor(consult.status)} flex-shrink-0`}>
                          {consult.status}
                        </span> */}
                        {/* ✅ Show severity badge if high */}

                        {consult.severity === 'high' && (
                          <span className="px-2 py-0.5 text-[10px] bg-red-100 text-red-600 rounded-full font-semibold flex-shrink-0">
                            High Priority
                          </span>
                        )}
                        {/* <div className="flex-shrink-0">
                          {getPriorityIcon(consult.priority)}
                        </div> */}
                      </div>
                      
                      {/* Details - Stack on Mobile */}
                      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-600">
                        <span className="flex items-center truncate">
                          <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{consult.doctor}</span>
                        </span>

                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {new Date(consult.date).toLocaleDateString('en-IN', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric',
                              timeZone: 'Asia/Kolkata'
                            })}
                          </span>
                        </span>


                        {/* <span className="flex items-center">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                          {consult.time}
                        </span> */}
                        {/* ✅ Show message count */}
                        {consult.messageCount > 0 && (
                          <span className="flex items-center text-teal-600 font-medium">
                            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                            {consult.messageCount} messages
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Action Buttons */}
                  <div className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3 flex-shrink-0">
                    {/* ✅ NEW: Quick Resume Button (visible when not expanded) */}
                    {!isExpanded && (
                      <button
                        onClick={(e) => handleResumeChat(consult, e)}
                        disabled={isResuming}
                        className="hidden sm:flex items-center space-x-1 px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors text-xs font-medium disabled:opacity-50"
                        title="Resume this conversation"
                      >
                        {isResuming ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <PlayCircle className="h-3.5 w-3.5" />
                        )}
                        <span>Resume</span>
                      </button>
                    )}



                      {/* ✅ DELETE BUTTON with inline confirm */}
                        {confirmDeleteId === consult.id ? (
                          // Confirm state — show Yes / Cancel
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {/* <span className="text-xs text-red-600 font-medium hidden sm:inline">Delete?</span> */}
                            <button
                              onClick={(e) => handleDelete(consult.id, e)}
                              disabled={deletingId === consult.id}
                              className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                              Yes
                            </button>
                            <button
                              onClick={cancelDelete}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => handleDelete(consult.id, e)}
                            disabled={deletingId === consult.id}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            title="Delete consultation"
                          >
                            {deletingId === consult.id
                              ? <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                              : <Trash2 className="h-4 w-4" />}
                          </button>
                        )}
                        
                    
                    {/* Bookmark Button */}
                    {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(consult.id);
                      }}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                    >
                      {consult.isBookmarked ? (
                        <BookmarkCheck className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-current" />
                      ) : (
                        <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button> */}
                    
                    {/* Document Count */}
                    {/* <div className="hidden sm:flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-500">
                      <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>{consult.documents?.length || 0}</span>
                    </div> */}
                    
                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => toggleExpand(consult.id)}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-teal-600 transition-colors"
                    >
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                      </motion.div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
};

export default ListView;

