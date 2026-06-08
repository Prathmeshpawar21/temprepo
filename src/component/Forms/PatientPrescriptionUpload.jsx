/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  FileImage, 
  Upload,
  X, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Shield,
  Activity,
  File,
  Camera,
  Paperclip,
  Eye,
  Download
} from "lucide-react";
import api from "../../api/api";

const ACCEPTED_EXT = [".doc", ".docx", ".pdf", ".png", ".jpg", ".jpeg"];
const ACCEPTED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png", "image/jpeg", "image/jpg"
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function PatientPrescriptionUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationError, setValidationError] = useState("");
  
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const keycloakId = localStorage.getItem("keycloak_id");

  useEffect(() => {
    // Cleanup preview URL on unmount
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateFile = (file) => {
    if (!file) return "No file selected";
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB";
    }
    
    // Check file type
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!ACCEPTED_EXT.includes(ext) && !ACCEPTED_MIME.includes(file.type)) {
      return "Only PDF, Word documents, and images (PNG, JPG, JPEG) are allowed";
    }
    
    return null;
  };

  const createPreview = (file) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFileChange = (selectedFile) => {
    const error = validateFile(selectedFile);
    if (error) {
      setValidationError(error);
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    
    setValidationError("");
    setStatus("");
    setFile(selectedFile);
    createPreview(selectedFile);
  };

  const handleInputChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileChange(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setStatus("");
    setValidationError("");
    setUploadProgress(0);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setStatus("Preparing upload...");
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append("user_id", keycloakId);
      formData.append("file", file);

      const response = await api.post(
        "/patient/prescription-upload",
        formData,
        { 
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
            setStatus(`Uploading... ${percentCompleted}%`);
          }
        }
      );

      setStatus("Upload successful! Redirecting...");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Upload failed";
      setStatus(`Upload failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  const getFileIcon = (file) => {
    if (!file) return <File className="w-6 h-6" />;
    
    const ext = file.name.toLowerCase().split(".").pop();
    if (["jpg", "jpeg", "png"].includes(ext)) {
      return <FileImage className="w-6 h-6 text-blue-600" />;
    }
    if (ext === "pdf") {
      return <FileText className="w-6 h-6 text-red-600" />;
    }
    return <FileText className="w-6 h-6 text-emerald-600" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-gray-800 font-sans relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-emerald-200/20 to-teal-200/10 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-200/15 to-emerald-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/90 group"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-emerald-600 transition-colors" />
            <span className="text-sm font-medium text-gray-600 group-hover:text-emerald-600">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">AllCognix</h1>
              <p className="text-xs text-emerald-600 font-semibold">Prescription Upload</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {/* Title Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Upload Prescription
                <span className="text-emerald-600 ml-2 text-xl">(Optional)</span>
              </h2>
              {/* <p className="text-gray-600 text-lg max-w-lg mx-auto">
                Share your prescription documents or images to help our AI provide better recommendations
              </p> */}
            </motion.div>
          </div>

          {/* Upload Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-8"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".doc,.docx,.pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={handleInputChange}
            />

            {/* File Upload Area */}
            {!file ? (
              <motion.div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                whileHover={{ scale: 1.02 }}
                className={`
                  relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer
                  ${dragActive 
                    ? 'border-emerald-500 bg-emerald-50/50' 
                    : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30'
                  }
                `}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Upload className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {dragActive ? 'Drop your file here' : 'Choose file or drag & drop'}
                  </h3>
                  
                  {/* <p className="text-gray-600 mb-6">
                    Upload prescription documents or images
                  </p>
                   */}
                  <div className="flex flex-wrap justify-center gap-4 mb-6">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                      <FileText className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-gray-700">PDF</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Word</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                      <FileImage className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Images</span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <Paperclip className="w-5 h-5" />
                    Select File
                  </button>
                  
                  {/* <p className="text-xs text-gray-500 mt-4">
                    Maximum file size: 10MB • Supported: PDF, DOC, DOCX, PNG, JPG, JPEG
                  </p> */}
                </div>
              </motion.div>
            ) : (
              /* File Preview */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getFileIcon(file)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 truncate">
                          {file.name}
                        </h4>
                        <button
                          onClick={handleCancel}
                          className="flex-shrink-0 p-2 bg-red-100 hover:bg-red-200 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span className="capitalize">{file.type.split('/')[1] || 'Document'}</span>
                      </div>
                      
                      {/* Image Preview */}
                      {previewUrl && (
                        <div className="mt-4">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="max-w-full h-48 object-contain rounded-lg border border-gray-200"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upload Progress */}
                {loading && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Upload Progress</span>
                      <span className="font-semibold text-emerald-600">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full"
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {validationError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 font-medium">{validationError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status Message */}
            <AnimatePresence>
              {status && !validationError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`
                    mt-6 p-4 rounded-2xl flex items-center gap-3
                    ${status.includes('successful') || status.includes('success')
                      ? 'bg-emerald-50 border border-emerald-200'
                      : status.includes('failed') || status.includes('error')
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-blue-50 border border-blue-200'
                    }
                  `}
                >
                  {status.includes('successful') || status.includes('success') ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  ) : status.includes('failed') || status.includes('error') ? (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  ) : (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600 flex-shrink-0" />
                  )}
                  <span className={`font-medium ${
                    status.includes('successful') || status.includes('success')
                      ? 'text-emerald-800'
                      : status.includes('failed') || status.includes('error')
                      ? 'text-red-800'
                      : 'text-blue-800'
                  }`}>
                    {status}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <motion.button
                type="button"
                onClick={handleSkip}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                Skip for Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                type="button"
                onClick={handleUpload}
                disabled={!file || loading}
                whileHover={{ scale: (!file || loading) ? 1 : 1.02 }}
                whileTap={{ scale: (!file || loading) ? 1 : 0.98 }}
                className={`
                  flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
                  ${file && !loading
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload & Continue
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500"
          >
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Your prescription data is encrypted and secure</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(1deg); }
          66% { transform: translateY(-8px) rotate(-1deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(-1deg); }
          66% { transform: translateY(-10px) rotate(1deg); }
        }
        
        .animate-float { animation: float 20s infinite ease-in-out; }
        .animate-float-delayed { animation: float-delayed 25s infinite ease-in-out 5s; }
      `}</style>
    </div>
  );
}







