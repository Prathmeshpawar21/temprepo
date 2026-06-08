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
  User, 
  Calendar, 
  Heart, 
  FileText, 
  Pill, 
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Activity,
  ArrowLeft,
  Shield,
  Clock
} from 'lucide-react';
import api from '../../api/api';

const PatientIntakeForm = () => {
  const [formData, setFormData] = useState({
    user_id: "",           
    age: "",
    gender: "",
    symptoms: "",
    past_conditions: "",
    medications: "",
    allergies: "",
  });
  
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const keycloakId = localStorage.getItem("keycloak_id");
    console.log("Keycloak ID from localStorage: ", keycloakId);

    if (!keycloakId) {
      setStatus("User ID not found.");
      setLoading(false);
      return;
    }

    setFormData(prev => ({ ...prev, user_id: keycloakId }));

    api.get(`/intake-form/patient/${keycloakId}`)
      .then(res => {
        if (res.data.has_filled_intake) {
          navigate("/new-consult");
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Check error:", err);
        setLoading(false);
      });
  }, [navigate]);

  const formSteps = [
    {
      title: "Personal Information",
      description: "Basic details about you",
      fields: ["age", "gender"],
      icon: <User className="w-6 h-6" />
    },
    {
      title: "Current Health",
      description: "What brings you here today",
      fields: ["symptoms"],
      // icon: <Heart className="w-6 h-6" />
    },
    // {
    //   title: "Medical History",
    //   description: "Your health background",
    //   fields: ["past_conditions", "medications", "allergies"],
    //   icon: <FileText className="w-6 h-6" />
    // }
  ];

  const fieldConfig = {
    age: {
      label: "Age",
      type: "number",
      placeholder: "Enter your age",
      icon: <Calendar className="w-5 h-5" />,
      required: true,
      min: 1,
      max: 120
    },
    gender: {
      label: "Gender",
      type: "select",
      placeholder: "Select your gender",
      icon: <User className="w-5 h-5" />,
      required: true,
      options: [
        { value: "", label: "Select Gender" },
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
        { value: "prefer_not_to_say", label: "Prefer not to say" }
      ]
    },
    symptoms: {
      label: "Current Symptoms",
      type: "textarea",
      placeholder: "Describe your current symptoms in detail...",
      // icon: <Heart className="w-5 h-5" />,
      required: true,
      rows: 4
    },
    past_conditions: {
      label: "Past Medical Conditions",
      type: "textarea",
      placeholder: "List any previous medical conditions, surgeries, or chronic illnesses...",
      // icon: <FileText className="w-5 h-5" />,
      required: false,
      rows: 3
    },
    medications: {
      label: "Current Medications",
      type: "textarea",
      placeholder: "List all medications you're currently taking (include dosages if known)...",
      // icon: <Pill className="w-5 h-5" />,
      required: false,
      rows: 3
    },
    allergies: {
      label: "Known Allergies",
      type: "textarea",
      placeholder: "List any known allergies (medications, foods, environmental)...",
      // icon: <AlertTriangle className="w-5 h-5" />,
      required: false,
      rows: 3
    }
  };

  const validateCurrentStep = () => {
    const currentFields = formSteps[currentStep].fields;
    const errors = {};
    
    currentFields.forEach(field => {
      const config = fieldConfig[field];
      const value = formData[field];
      
      if (config.required && !value.trim()) {
        errors[field] = `${config.label} is required`;
      } else if (field === 'age' && value) {
        const age = parseInt(value);
        if (age < 1 || age > 120) {
          errors[field] = 'Please enter a valid age between 1 and 120';
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
    setStatus("Submitting your information...");

    try {
      const response = await api.post("/intake-form/patient", formData);
      setStatus("Successfully submitted!");
      console.log("Response:", response.data);
      
      // Wait a moment before redirecting
      setTimeout(() => {
        navigate("/patient-upload-prescription");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error.response?.data?.detail || error.message || 'Submission failed';
      setStatus(`Error: ${errorMessage}`);
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
        <p className="text-gray-600">Please wait while we verify your information...</p>
      </motion.div>
    </div>
  );

  const renderField = (fieldName) => {
    const config = fieldConfig[fieldName];
    const hasError = validationErrors[fieldName];

    const baseInputClasses = `
      w-full p-4 pr-4 py-4 bg-white border-2 rounded-2xl transition-all duration-300 outline-none text-gray-700 placeholder-gray-400
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
          {/* <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {config.icon}
          </div> */}
          
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
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">AllCognix</h1>
              <p className="text-xs text-emerald-600 font-semibold">Patient Intake</p>
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
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                    ${index <= currentStep 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                    }
                  `}>
                    {index < currentStep ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < formSteps.length - 1 && (
                    <div className={`
                      w-16 h-1 mx-4 rounded-full transition-all duration-300
                      ${index < currentStep ? 'bg-emerald-500' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                {formSteps[currentStep].icon}
                {formSteps[currentStep].title}
              </h2>
              <p className="text-gray-600">{formSteps[currentStep].description}</p>
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
                        Complete Intake
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
                    ${status.includes('Success') || status.includes('successfully')
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : status.includes('Error') || status.includes('failed')
                      ? 'bg-red-50 border border-red-200 text-red-800'
                      : 'bg-blue-50 border border-blue-200 text-blue-800'
                    }
                  `}
                >
                  {status.includes('Success') || status.includes('successfully') ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : status.includes('Error') || status.includes('failed') ? (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  ) : (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  )}
                  <span className="font-medium">{status}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500"
          >
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Your health information is encrypted and secure</span>
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

export default PatientIntakeForm;






































