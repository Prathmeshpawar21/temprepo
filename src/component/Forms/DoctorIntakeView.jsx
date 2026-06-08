/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  GraduationCap, 
  MapPin, 
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Activity,
  Shield,
  AlertTriangle,
  User,
  Building,
  Calendar,
  FileText
} from 'lucide-react';
import api from '../../api/api';

const DoctorIntakeForm = () => {
  const [formData, setFormData] = useState({
    user_id: "",
    specialization: "",
    experience_years: "",
    clinic_address: "",
    license_number: "",
  });

  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});



  
useEffect(() => {
  // Enhanced auth checking with multiple fallbacks
  let keycloakId = localStorage.getItem("keycloak_id");
  let token = localStorage.getItem("access_token");
  let userStr = localStorage.getItem("user");
  
  console.log("🔍 DoctorIntakeForm Auth Debug:", {
    hasKeycloakId: !!keycloakId,
    hasToken: !!token,
    hasUser: !!userStr,
    keycloakId,
    tokenLength: token ? token.length : 0
  });

  // Try to extract keycloak_id from user object if direct storage failed
  if (!keycloakId && userStr) {
    try {
      const user = JSON.parse(userStr);
      keycloakId = user.keycloak_id;
      if (keycloakId) {
        console.log("🔧 Recovered keycloak_id from user object:", keycloakId);
        localStorage.setItem("keycloak_id", keycloakId);
      }
    } catch (e) {
      console.error("❌ Error parsing user from localStorage:", e);
    }
  }

  // If still no auth data, redirect to login
  if (!keycloakId || !token) {
    console.error("❌ Missing authentication data. Redirecting to login...");
    setStatus("Please login to continue.");
    setLoading(false);
    
    setTimeout(() => {
      window.location.href = '/auth';
    }, 1500);
    return;
  }

  setFormData((prev) => ({ ...prev, user_id: keycloakId }));

  // Check intake status with enhanced error handling
  const checkIntakeStatus = async () => {
    try {
      console.log("🔍 Checking doctor intake status...");
      const res = await api.get(`/intake-form/doctor/${keycloakId}`);
      
      console.log("  Intake check successful:", res.data);
      if (res.data.has_filled_intake) {
        navigate("/new-consult");
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("❌ Doctor intake check error:", err);
      
      if (err.response?.status === 401) {
        setStatus("Session expired. Please login again.");
        setTimeout(() => {
          localStorage.clear();
          window.location.href = '/auth';
        }, 2000);
      } else {
        // Assume intake not filled, show form
        console.log("ℹ️ Assuming intake not completed, showing form...");
        setLoading(false);
      }
    }
  };

  // Small delay to ensure API interceptor has token
  setTimeout(checkIntakeStatus, 100);

}, [navigate]);

  const formSteps = [
    {
      title: "Professional Details",
      description: "Your medical specialization and experience",
      fields: ["specialization", "experience_years"],
      icon: <Stethoscope className="w-6 h-6" />
    },
    {
      title: "Practice Information",
      description: "Your clinic details and credentials",
      fields: ["clinic_address", "license_number"],
      icon: <Building className="w-6 h-6" />
    }
  ];

  const fieldConfig = {
    specialization: {
      label: "Medical Specialization",
      type: "select",
      placeholder: "Select your specialization",
      icon: <Stethoscope className="w-5 h-5" />,
      required: true,
      options: [
        { value: "", label: "Select Specialization" },
        { value: "cardiology", label: "Cardiology" },
        { value: "dermatology", label: "Dermatology" },
        { value: "emergency_medicine", label: "Emergency Medicine" },
        { value: "endocrinology", label: "Endocrinology" },
        { value: "family_medicine", label: "Family Medicine" },
        { value: "gastroenterology", label: "Gastroenterology" },
        { value: "general_practice", label: "General Practice" },
        { value: "gynecology", label: "Gynecology" },
        { value: "internal_medicine", label: "Internal Medicine" },
        { value: "neurology", label: "Neurology" },
        { value: "oncology", label: "Oncology" },
        { value: "orthopedics", label: "Orthopedics" },
        { value: "pediatrics", label: "Pediatrics" },
        { value: "psychiatry", label: "Psychiatry" },
        { value: "radiology", label: "Radiology" },
        { value: "surgery", label: "Surgery" },
        { value: "urology", label: "Urology" },
        { value: "other", label: "Other" }
      ]
    },
    experience_years: {
      label: "Years of Experience",
      type: "number",
      placeholder: "Years in practice",
      icon: <GraduationCap className="w-5 h-5" />,
      required: true,
      min: 0,
      max: 60
    },
    clinic_address: {
      label: "Clinic Address",
      type: "textarea",
      placeholder: "Enter your complete clinic address...",
      icon: <MapPin className="w-5 h-5" />,
      required: true,
      rows: 4
    },
    license_number: {
      label: "Medical License Number",
      type: "text",
      placeholder: "Enter your medical license number",
      icon: <Award className="w-5 h-5" />,
      required: true
    }
  };

  const validateCurrentStep = () => {
    const currentFields = formSteps[currentStep].fields;
    const errors = {};
    
    currentFields.forEach(field => {
      const config = fieldConfig[field];
      const value = formData[field];
      
      if (config.required && !value.toString().trim()) {
        errors[field] = `${config.label} is required`;
      } else if (field === 'experience_years' && value) {
        const years = parseInt(value);
        if (years < 0 || years > 60) {
          errors[field] = 'Please enter valid years of experience (0-60)';
        }
      } else if (field === 'license_number' && value) {
        if (value.length < 3) {
          errors[field] = 'Please enter a valid license number';
        }
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, formSteps.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    setStatus("Submitting your professional information...");

    try {
      const response = await api.post("/intake-form/doctor", formData);
      setStatus("Professional profile submitted successfully!");
      console.log("Doctor intake submit response:", response.data);
      
      // Wait a moment before redirecting
      setTimeout(() => {
        navigate("/new-consult");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error.response?.data?.detail || error.message || 'Submission failed';
      setStatus(`Submission failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg">
          <Activity className="w-8 h-8 animate-pulse" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Checking Your Status</h3>
        <p className="text-gray-600">Verifying your professional credentials...</p>
      </motion.div>
    </div>
  );

  const renderField = (fieldName) => {
    const config = fieldConfig[fieldName];
    const hasError = validationErrors[fieldName];

    const baseInputClasses = `
      w-full pl-12 pr-4 py-4 bg-white border-2 rounded-2xl transition-all duration-300 outline-none text-gray-700 placeholder-gray-400
      ${hasError 
        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
        : 'border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
      }
    `;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          {config.icon}
          {config.label}
          {config.required && <span className="text-red-500">*</span>}
        </label>
        
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {config.icon}
          </div>
          
          {config.type === 'select' ? (
            <select
              name={fieldName}
              value={formData[fieldName]}
              onChange={handleChange}
              className={baseInputClasses}
              required={config.required}
            >
              {config.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : config.type === 'textarea' ? (
            <textarea
              name={fieldName}
              value={formData[fieldName]}
              onChange={handleChange}
              placeholder={config.placeholder}
              rows={config.rows}
              className={baseInputClasses}
              required={config.required}
              style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
            />
          ) : (
            <input
              type={config.type}
              name={fieldName}
              value={formData[fieldName]}
              onChange={handleChange}
              placeholder={config.placeholder}
              className={baseInputClasses}
              required={config.required}
              min={config.min}
              max={config.max}
            />
          )}
        </div>
        
        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-2 flex items-center gap-1"
          >
            <AlertTriangle className="w-4 h-4" />
            {hasError}
          </motion.p>
        )}
      </motion.div>
    );
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
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">AllCognix</h1>
              <p className="text-xs text-emerald-600 font-semibold">Doctor Registration</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {formSteps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                    ${index <= currentStep 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                    }
                  `}>
                    {index < currentStep ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  {index < formSteps.length - 1 && (
                    <div className={`
                      w-24 h-1 mx-4 rounded-full transition-all duration-300
                      ${index < currentStep ? 'bg-emerald-500' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                {formSteps[currentStep].icon}
                {formSteps[currentStep].title}
              </h2>
              <p className="text-gray-600 text-lg">{formSteps[currentStep].description}</p>
            </div>
          </div>

          {/* Form Card */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-8"
          >
            <form onSubmit={currentStep === formSteps.length - 1 ? handleSubmit : undefined} className="space-y-6">
              <input type="hidden" name="user_id" value={formData.user_id} />
              
              {formSteps[currentStep].fields.map(fieldName => (
                <div key={fieldName}>
                  {renderField(fieldName)}
                </div>
              ))}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-6">
                {currentStep > 0 && (
                  <motion.button
                    type="button"
                    onClick={handlePrev}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Previous
                  </motion.button>
                )}

                {currentStep < formSteps.length - 1 ? (
                  <motion.button
                    type="button"
                    onClick={handleNext}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className={`
                      flex-1 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2
                      ${isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Complete Registration
                        <CheckCircle2 className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </form>

            {/* Status Message */}
            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`
                    mt-6 p-4 rounded-2xl flex items-center gap-3
                    ${status.includes('successfully') || status.includes('success')
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : status.includes('failed') || status.includes('Submission failed')
                      ? 'bg-red-50 border border-red-200 text-red-800'
                      : 'bg-blue-50 border border-blue-200 text-blue-800'
                    }
                  `}
                >
                  {status.includes('successfully') || status.includes('success') ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : status.includes('failed') || status.includes('Submission failed') ? (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  ) : (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  )}
                  <span className="font-medium">{status}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Professional Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500"
          >
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Your professional credentials are verified and secure</span>
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
};

export default DoctorIntakeForm;

