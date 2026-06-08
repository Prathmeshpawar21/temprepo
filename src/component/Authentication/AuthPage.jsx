/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// AuthPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Heart,
  Stethoscope,
  ArrowRight
} from 'lucide-react';
import { useAuth } from './AuthContext';
import api from '../../api/api';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const [portal, setPortal] = useState(() => localStorage.getItem("portal") || "patient");
  
  const navigate = useNavigate();
  const { user, updateAuthState } = useAuth();
  const location = useLocation(); 

  const [showForgotPassword, setShowForgotPassword]   = useState(false);
  const [forgotEmail, setForgotEmail]                 = useState('');
  const [forgotStatus, setForgotStatus]               = useState(''); 
  const [forgotMessage, setForgotMessage]             = useState(''); 



useEffect(() => {
  // ✅ Read error from URL query parameter (for OAuth redirects)
  const errorFromUrl = searchParams.get('error');
  
  // Also check for error from navigation state (for manual login)
  const errorFromState = location.state?.error;
  
  const errorMsg = errorFromUrl || errorFromState;
  
  if (errorMsg) {
    console.log('🔍 Received error:', {
      fromUrl: errorFromUrl,
      fromState: errorFromState,
      finalError: errorMsg
    });
    
    // ✅ CHECK FOR ROLE MISMATCH
    const isPatientRoleMismatch = errorMsg.toLowerCase().includes('registered as a patient');
    const isDoctorRoleMismatch = errorMsg.toLowerCase().includes('registered as a doctor');
    
    if (isPatientRoleMismatch) {
      console.log('🚫 Patient role mismatch detected!');
      setError('This account is registered as a patient. Please use the patient portal.');
      
      // Auto-switch portal after 2.5s
      setTimeout(() => {
        setPortal('patient');
        localStorage.setItem('portal', 'patient');
        setError('Switched to patient portal. Please try logging in again.');
      }, 2500);
      
    } else if (isDoctorRoleMismatch) {
      console.log('🚫 Doctor role mismatch detected!');
      setError('This account is registered as a doctor. Please use the doctor portal.');
      
      // Auto-switch portal after 2.5s
      setTimeout(() => {
        setPortal('doctor');
        localStorage.setItem('portal', 'doctor');
        setError('Switched to doctor portal. Please try logging in again.');
      }, 2500);
      
    } else {
      // Generic error - just display it
      setError(errorMsg);
    }
    
    // ✅ Clear the URL query parameter to prevent re-triggering
    if (errorFromUrl) {
      setSearchParams({});
    }
    
    // ✅ Clear navigation state
    if (errorFromState) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }
}, [location, navigate, searchParams, setSearchParams]);


  useEffect(() => {
    localStorage.setItem("portal", portal);
  }, [portal]);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Redirect back if portal is missing
  if (!portal) return <Navigate to="/select-portal" replace />;

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!isLogin && !form.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!isLogin && !form.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!form.password) {
      errors.password = 'Password is required';
    } else if (!isLogin && form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear errors on input change
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  useEffect(() => {
    console.log('🔍 Environment Variables Check:', {
      KEYCLOAK_URL: import.meta.env.VITE_KEYCLOAK_URL,
      KEYCLOAK_REALM: import.meta.env.VITE_KEYCLOAK_REALM,
      KEYCLOAK_CLIENT_DOCTOR: import.meta.env.VITE_KEYCLOAK_CLIENT_DOCTOR,
      KEYCLOAK_CLIENT_PATIENT: import.meta.env.VITE_KEYCLOAK_CLIENT_PATIENT,
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      NODE_ENV: import.meta.env.NODE_ENV,
      MODE: import.meta.env.MODE
    });
  }, []);

  // Google Login Handler
  const handleGoogleLogin = async () => {
    try {
      console.log('🔵 Initiating Google OAuth via backend for portal:', portal);
      setIsSubmitting(true);
      
      // Store portal for later use
      localStorage.setItem('oauth_portal', portal);
      
      // Call backend to get OAuth URL
      const response = await api.post('/authentication/oauth/google/initiate', {
        portal: portal
      });
      
      console.log('✅ OAuth URL received from backend');
      
      const { auth_url } = response.data;
      
      if (!auth_url) {
        throw new Error('No OAuth URL received from backend');
      }
      
      console.log('🔗 Redirecting to Keycloak...');
      
      // Redirect to Keycloak
      window.location.href = auth_url;
      
    } catch (err) {
      console.error('❌ Google login initiation error:', err);
      setError(`Failed to initiate Google login: ${err.response?.data?.detail || err.message}`);
      setIsSubmitting(false);
    }
  };




  // ADD this function before handleSubmit:
const handleForgotPassword = async (e) => {
  e.preventDefault();

  if (!forgotEmail.trim() || !/\S+@\S+\.\S+/.test(forgotEmail)) {
    setForgotMessage('Please enter a valid email address.');
    setForgotStatus('error');
    return;
  }

  setForgotStatus('loading');
  setForgotMessage('');

  try {
    await api.post('/authentication/forgot-password', { email: forgotEmail });
    setForgotStatus('success');
    setForgotMessage(
      'If this email is registered, you will receive a password reset link shortly. Please check your inbox.'
    );
    setForgotEmail('');
  } catch (err) {
    // Always show success message — prevent email enumeration
    setForgotStatus('success');
    setForgotMessage(
      'If this email is registered, you will receive a password reset link shortly. Please check your inbox.'
    );
  }
};





  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      if (isLogin) {
        console.log('🚀 Starting login process:', { portal, email: form.email });

        const res = await api.post('/authentication/login', {
          username: form.email,
          password: form.password,
          portal,
        });

        console.log('✅ Login successful');
        const { user, access_token, refresh_token } = res.data;
        
        if (!user || !access_token) {
          throw new Error('Invalid response: missing user or token');
        }

        if (!user.keycloak_id) {
          throw new Error('Invalid response: missing keycloak_id');
        }

        updateAuthState(user, access_token, refresh_token);

        await new Promise(resolve => setTimeout(resolve, 100));

        if (!user.has_filled_intake) {
          const redirectPath = user.role === 'doctor' ? "/doctor-intake" : "/patient-intake";
          console.log(`📋 Redirecting to: ${redirectPath}`);
          navigate(redirectPath, { replace: true });
        } else {
          console.log('🏠 Redirecting to dashboard');
          navigate("/", { replace: true });
        }

      } else {
        await api.post('/authentication/register', {
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          password: form.password,
          role: portal,
        });
        
        setSuccessMessage('✅ Registration successful! Please log in with your credentials.');
        setIsLogin(true);
        setForm(prev => ({ 
          ...prev, 
          firstName: '', 
          lastName: '', 
          password: '' 
        }));
      }
    } catch (err) {
      console.error('❌ Authentication error:', err);
      
      // ✅ KEY FIX: Extract from ALL possible error fields
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.error ||
                          err.response?.data?.message || 
                          err.message || 
                          'An unexpected error occurred';
      
      console.log('🔍 Extracted error message:', errorMessage);
      
      // Check for role mismatch (case-insensitive)
      const lowerErrorMsg = errorMessage.toLowerCase();
      const isPatientRoleMismatch = lowerErrorMsg.includes('registered as a patient');
      const isDoctorRoleMismatch = lowerErrorMsg.includes('registered as a doctor');
      
      if (isPatientRoleMismatch) {
        console.log('🚫 Detected patient role mismatch!');
        setError('This account is registered as a patient. Please use the patient portal.');
        
        setTimeout(() => {
          setPortal('patient');
          setError('Switched to patient portal. Please try logging in again.');
        }, 2500);
        
      } else if (isDoctorRoleMismatch) {
        console.log('🚫 Detected doctor role mismatch!');
        setError('This account is registered as a doctor. Please use the doctor portal.');
        
        setTimeout(() => {
          setPortal('doctor');
          setError('Switched to doctor portal. Please try logging in again.');
        }, 2500);
        
      } else {
        // Generic error
        setError(`${isLogin ? 'Login' : 'Registration'} failed: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const portalConfig = {
    patient: {
      title: 'Patient Portal',
      icon: <Heart className="w-5 h-5" />,
      gradient: 'from-blue-500 to-emerald-500',
      description: 'Access records & connect with doctors'
    },
    doctor: {
      title: 'Doctor Portal',
      icon: <Stethoscope className="w-5 h-5" />,
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Manage patients and streamline your practice'
    }
  };

  const currentPortalConfig = portalConfig[portal];

  const inputVariants = {
    focus: { scale: 1.02, transition: { type: "spring", stiffness: 300 } },
    blur: { scale: 1 }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Portal Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-2xl">
          {Object.entries(portalConfig).map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() => setPortal(key)}
              className={`
                flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300
                ${portal === key
                  ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg transform scale-105`
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
                }
              `}
            >
              {config.icon}
              <span className="text-sm">{config.title}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          {currentPortalConfig.description}
        </p>
      </motion.div>

      {/* Google Sign In Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center gap-3 group shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Google SVG Logo */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-base">Continue with Google</span>
        </button>
      </motion.div>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-emerald-800 text-sm font-medium">{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          error.includes('registered as') ? (
            <RoleMismatchNotification error={error} portal={portal} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-start gap-3"
            >
              {/* <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" /> */}
              <p className="text-yellow-800 text-sm font-medium">{error}</p>
            </motion.div>
          )
        )}
      </AnimatePresence>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-6"
      >
        {/* Registration Fields */}
        <AnimatePresence>
          {!isLogin && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={inputVariants} whileFocus="focus" className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                    className={`
                      w-full pl-10 pr-4 py-3 bg-white border-2 rounded-xl transition-all duration-200 outline-none text-gray-700 placeholder-gray-400
                      ${validationErrors.firstName 
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
                      }
                    `}
                  />
                  {validationErrors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
                  )}
                </motion.div>

                <motion.div variants={inputVariants} whileFocus="focus" className="relative">
                  <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                    className={`
                      w-full pl-10 pr-4 py-3 bg-white border-2 rounded-xl transition-all duration-200 outline-none text-gray-700 placeholder-gray-400
                      ${validationErrors.lastName 
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
                      }
                    `}
                  />
                  {validationErrors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Field */}
        <motion.div variants={inputVariants} whileFocus="focus" className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className={`
              w-full pl-10 pr-4 py-3 bg-white border-2 rounded-xl transition-all duration-200 outline-none text-gray-700 placeholder-gray-400
              ${validationErrors.email 
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                : 'border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
              }
            `}
          />
          {validationErrors.email && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
          )}
        </motion.div>

        {/* Password Field */}
        <motion.div variants={inputVariants} whileFocus="focus" className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={`
              w-full pl-10 pr-12 py-3 bg-white border-2 rounded-xl transition-all duration-200 outline-none text-gray-700 placeholder-gray-400
              ${validationErrors.password 
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                : 'border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
              }
            `}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          {validationErrors.password && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
          )}
          {!isLogin && !validationErrors.password && form.password && (
            <p className="text-gray-500 text-xs mt-1">
              Password strength: {form.password.length >= 8 ? 'Strong' : form.password.length >= 6 ? 'Medium' : 'Weak'}
            </p>
          )}
        </motion.div>

{/* Forgot Password? */}
{isLogin && (
  <div className="flex justify-end -mt-2">
    <button
      type="button"
      onClick={() => {
        setShowForgotPassword(true);
        setForgotStatus('');
        setForgotMessage('');
        setForgotEmail(form.email); // pre-fill with typed email
      }}
      className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
    >
      Forgot Password?
    </button>


  </div>
)}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          className={`
            w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2
            ${isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : `bg-gradient-to-r ${currentPortalConfig.gradient} hover:shadow-xl text-white`
            }
          `}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
            </>
          ) : (
            <>
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>

        {/* Toggle Auth Mode */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-4 border-t border-gray-200"
        >
          <p className="text-gray-600 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            {' '}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccessMessage('');
                setValidationErrors({});
              }} 
              type="button" 
              className={`font-semibold hover:underline transition-colors bg-gradient-to-r ${currentPortalConfig.gradient} bg-clip-text text-transparent`}
            >
              {isLogin ? 'Sign up here' : 'Sign in here'}
            </button>
          </p>
        </motion.div>
      </motion.form>




      {/* ── Forgot Password Modal ───────────────────────────────────────────── */}
<AnimatePresence>
  {showForgotPassword && (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => { setShowForgotPassword(false); setForgotStatus(''); setForgotMessage(''); }}
        className="fixed inset-0 bg-white/50 backdrop-blur-2xl z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">

          {/* Close Button */}
          <button
            type="button"
            onClick={() => { setShowForgotPassword(false); setForgotStatus(''); setForgotMessage(''); }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Icon */}
          <div className={`w-12 h-12 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-r ${currentPortalConfig.gradient}`}>
            <Mail className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 text-center mb-1">
            Forgot Password?
          </h3>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your registered email and we'll send you a reset link.
          </p>

          {/* Success State */}
          {forgotStatus === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                {forgotMessage}
              </p>
              <button
                type="button"
                onClick={() => { setShowForgotPassword(false); setForgotStatus(''); setForgotMessage(''); }}
                className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${currentPortalConfig.gradient} hover:shadow-lg transition-all`}
              >
                Back to Login
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              {/* Error Message */}
              {forgotStatus === 'error' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{forgotMessage}</p>
                </div>
              )}

              {/* Email Input */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => { setForgotEmail(e.target.value); setForgotStatus(''); setForgotMessage(''); }}
                  placeholder="Your registered email"
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-gray-700 placeholder-gray-400 transition-all"
                  autoFocus
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={forgotStatus === 'loading'}
                className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${currentPortalConfig.gradient} hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {forgotStatus === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setShowForgotPassword(false); setForgotStatus(''); setForgotMessage(''); }}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>



    </div>
  );
};

const RoleMismatchNotification = ({ error, portal }) => {
  if (!error.includes('registered as')) return null;
  
  const isPatientError = error.includes('registered as a patient');
  const correctPortal = isPatientError ? 'patient' : 'doctor';
  const correctPortalName = isPatientError ? 'Patient' : 'Doctor';
  // const Icon = isPatientError ? Heart : Stethoscope;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="mb-6 p-5 bg-red-50 border-2 border-red-200 rounded-2xl"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {/* <Icon className="w-5 h-5 text-red-600" /> */}
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-red-800 mb-3">
            {error}
          </p>
          {portal === correctPortal && (
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Switched to {correctPortalName} Portal</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AuthPage;
