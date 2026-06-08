/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// // frontend/src/component/pages/Records/Patient/RecordDetailsModal.jsx

// import React from 'react';
// import { X, Download, ExternalLink, FileText, Calendar, Clock, File, Target } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { getCategoryColors } from '../shared/constants';

// const RecordDetailsModal = ({ isOpen, onClose, document, onDownload }) => {
//   if (!document) return null;

//   // ✅ FIXED: Use getCategoryColors from constants
//   const getCategoryGradient = (category) => {
//     const colors = getCategoryColors(category);
//     return `from-${colors.gradient}`;
//   };

//   // Alternative: Direct gradient mapping
//   const getCategoryColor = (category) => {
//     const gradients = {
//       prescription: 'from-blue-400 to-blue-600',
//       lab_report: 'from-purple-400 to-purple-600',           // ✅ FIXED
//       radiology: 'from-green-400 to-green-600',              // ✅ FIXED
//       discharge_summary: 'from-teal-400 to-teal-600',        // ✅ FIXED
//       vaccination_record: 'from-pink-400 to-pink-600',       // ✅ FIXED
//       insurance_document: 'from-yellow-400 to-yellow-600',   // ✅ ADDED
//       other: 'from-gray-400 to-gray-600',
//     };
//     return gradients[category] || 'from-gray-400 to-gray-600';
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
//   };

// const formatDateTime = (dateString) => {
//   if (!dateString) return 'N/A';
//   const date = new Date(dateString);
//   return date.toLocaleString('en-IN', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//     timeZone: 'Asia/Kolkata'
//   });
// };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//           onClick={onClose}
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0, y: 20 }}
//             animate={{ scale: 1, opacity: 1, y: 0 }}
//             exit={{ scale: 0.9, opacity: 0, y: 20 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//           >
            
//             {/* Header */}
//             <div className={`bg-gradient-to-r ${getCategoryColor(document.category)} px-6 py-6 flex items-start justify-between`}>
//               <div className="flex items-start gap-4 flex-1 min-w-0">
//                 <div className="w-14 h-14 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
//                   <FileText className="w-8 h-8 text-white" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h2 className="text-2xl font-bold text-white mb-2 break-words">
//                     {document.title || document.original_filename}
//                   </h2>
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <span className="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm text-white text-sm font-semibold rounded-lg capitalize">
//                       {document.category.replace(/_/g, ' ')}
//                     </span>
//                     <span className="text-white text-opacity-90 text-sm">
//                       {document.file_extension?.toUpperCase()} • {formatFileSize(document.file_size)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
              
//               <button
//                 onClick={onClose}
//                 className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors flex-shrink-0"
//               >
//                 <X className="w-6 h-6 text-white" />
//               </button>
//             </div>

//             {/* Body */}
//             <div className="flex-1 overflow-y-auto p-6">
              
//               {/* Actions */}
//               <div className="flex gap-3 mb-6">
//                 <button
//                   onClick={() => onDownload(document.id, document.original_filename)}
//                   className="flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all shadow-lg hover:shadow-xl"
//                 >
//                   <Download className="w-5 h-5" />
//                   Download
//                 </button>
//                 {document.download_url && (
//                   <a
//                     href={document.download_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
//                   >
//                     <ExternalLink className="w-5 h-5" />
//                     Open
//                   </a>
//                 )}
//               </div>

//               {/* File Information */}
//               <div className="space-y-6">
//                 <div>
//                   <h3 className="text-lg font-bold text-gray-900 mb-4">File Information</h3>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//                       <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
//                         <FileText className="w-4 h-4" />
//                         <span className="font-semibold">Filename</span>
//                       </div>
//                       <p className="text-sm text-gray-900 font-medium break-all">
//                         {document.original_filename}
//                       </p>
//                     </div>

//                     <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//                       <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
//                         <Target className="w-4 h-4" />
//                         <span className="font-semibold">File Size</span>
//                       </div>
//                       <p className="text-sm text-gray-900 font-medium">
//                         {formatFileSize(document.file_size)}
//                       </p>
//                     </div>

//                     <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//                       <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
//                         <Clock className="w-4 h-4" />
//                         <span className="font-semibold">Uploaded</span>
//                       </div>
//                       <p className="text-sm text-gray-900 font-medium">
//                         {formatDateTime(document.created_at)}
//                       </p>
//                     </div>

//                     <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//                       <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
//                         <File className="w-4 h-4" />
//                         <span className="font-semibold">Type</span>
//                       </div>
//                       <p className="text-sm text-gray-900 font-medium">
//                         {document.file_extension?.toUpperCase()} Document
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {document.document_date && (
//                   <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//                     <div className="flex items-center gap-2 text-blue-900 mb-2">
//                       <Calendar className="w-5 h-5" />
//                       <span className="font-semibold">Document Date</span>
//                     </div>
//                     <p className="text-blue-800">
//                       {formatDateTime(document.document_date)}
//                     </p>
//                   </div>
//                 )}

//                 {document.notes && (
//                   <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
//                     <h4 className="font-semibold text-amber-900 mb-2">Notes</h4>
//                     <p className="text-amber-800 text-sm whitespace-pre-wrap">
//                       {document.notes}
//                     </p>
//                   </div>
//                 )}
//               </div>

//             </div>

//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default RecordDetailsModal;
