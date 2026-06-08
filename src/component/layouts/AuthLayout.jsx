/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/layouts/AuthLayout.jsx

import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Activity, ArrowLeft, Shield, Zap, Heart, Users, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '../Authentication/AuthContext';

const AuthLayout = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [currentPortal, setCurrentPortal] = useState('');

  useEffect(() => {
    const portal = localStorage.getItem('portal');
    setCurrentPortal(portal || '');
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4">
            <Activity className="w-8 h-8 animate-pulse" />
          </div>
          <p className="text-emerald-700 font-medium">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // If user is already logged in, redirect to dashboard
  if (user) return <Navigate to="/" replace />;

  // If portal is not selected, redirect to selector
  if (!localStorage.getItem('portal')) {
    return <Navigate to="/select-portal" replace />;
  }

  const portalConfig = {
    patient: {
      title: 'Patient Portal',
      subtitle: 'Your health journey starts here',
      gradient: 'from-blue-500 to-emerald-500',
      bgGradient: 'from-blue-50/50 to-emerald-50/50',
      icon: <Heart className="w-4 h-4 sm:w-5" />,
      features: [
        { icon: <Activity className="w-3.5 h-3.5" />, text: 'AI Health Insights' },
        { icon: <Shield className="w-3.5 h-3.5" />, text: 'Secure & Private' },
        { icon: <Zap className="w-3.5 h-3.5" />, text: 'Instant Results' }
      ]
    },
    doctor: {
      title: 'Healthcare Provider Portal',
      subtitle: 'Advanced healthcare management',
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50/50 to-teal-50/50',
      icon: <Stethoscope className="w-4 h-4 sm:w-5" />,
      features: [
        { icon: <Users className="w-3.5 h-3.5" />, text: 'Patient Management' },
        { icon: <Zap className="w-3.5 h-3.5" />, text: 'AI Diagnostics' },
        { icon: <Shield className="w-3.5 h-3.5" />, text: 'HIPAA Compliant' }
      ]
    }
  };

  const config = portalConfig[currentPortal] || portalConfig.patient;

  const backgroundVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 1.2, ease: "easeOut" }
    }
  };

  const cardVariants = {
    initial: { y: 50, opacity: 0, scale: 0.9 },
    animate: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        duration: 0.8,
        delay: 0.2
      }
    }
  };

  const featureVariants = {
    initial: { x: -20, opacity: 0 },
    animate: (index) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: 0.5 + index * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-gray-800 font-sans relative overflow-hidden">
      {/* Enhanced Background Elements - Mobile Optimized */}
      <motion.div 
        variants={backgroundVariants}
        initial="initial"
        animate="animate"
        className="absolute inset-0 z-0 overflow-hidden"
      >
        {/* Animated Gradient Orbs - Smaller sizes */}
        <div className="absolute top-1/4 left-0 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-gradient-to-br from-emerald-200/30 to-blue-200/20 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-0 w-36 sm:w-52 md:w-64 h-36 sm:h-52 md:h-64 bg-gradient-to-br from-teal-200/25 to-emerald-200/30 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-48 md:w-60 h-32 sm:h-48 md:h-60 bg-gradient-to-br from-blue-200/20 to-cyan-200/25 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl animate-float-slow" />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-20" />
      </motion.div>

      {/* Back Button - HIDDEN ON MOBILE */}
      <motion.button
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() => window.history.back()}
        className="hidden md:flex absolute top-3 left-3 lg:top-4 lg:left-4 z-20 items-center gap-1.5 px-3 py-1.5 lg:px-3.5 lg:py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/90 group"
      >
        <ArrowLeft className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-600 group-hover:text-emerald-600 transition-colors" />
        <span className="text-xs lg:text-sm font-medium text-gray-600 group-hover:text-emerald-600">Back</span>
      </motion.button>


      {/* Main Content - Zoomed Out & Compact */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-3 pb-0 sm:px-4 lg:px-6 py-2 sm:py-8">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          
          {/* Left Side - Branding & Info - HIDDEN ON MOBILE */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block text-center lg:text-left"
          >
            {/* Logo - Smaller */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 lg:-top-1 lg:-right-1 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  AllCognix
                </h1>
                <p className="text-emerald-600 font-semibold text-[10px] lg:text-xs uppercase tracking-wider">
                  AI Health Platform
                </p>
              </div>
            </div>

            {/* Portal Specific Content - Compact */}
            <div className="mb-6">
              <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-3">
                Welcome to {config.title}
              </h2>
              <p className="text-base lg:text-lg text-gray-600 mb-6">
                {config.subtitle}
              </p>
              
              {/* Features List - Compact */}
              <div className="space-y-3">
                {config.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={featureVariants}
                    initial="initial"
                    animate="animate"
                    className="flex items-center gap-2.5"
                  >
                    <div className={`w-7 h-7 bg-gradient-to-r ${config.gradient} rounded-lg flex items-center justify-center text-white shadow-md`}>
                      {feature.icon}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Trust Indicators - Compact */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center lg:justify-start gap-4 text-xs text-gray-500"
            >
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-500" />
                <span>AI Powered</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Auth Form - SMALLER & Compact */}
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            className="w-full max-w-sm mx-auto"
          >
            {/* Mobile Logo - Smaller */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:hidden flex items-center justify-center gap-2.5 mb-4"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  AllCognix
                </h1>
                <p className="text-[9px] text-emerald-600 font-semibold uppercase tracking-wider">
                  AI Health Platform
                </p>
              </div>
            </motion.div>

            <div className={`bg-gradient-to-br ${config.bgGradient} p-0.5 rounded-xl sm:rounded-2xl shadow-2xl`}>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-inner">
                
                {/* Form Header - Smaller */}
                <div className="text-center mb-4 sm:mb-5">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 mx-auto bg-gradient-to-br ${config.gradient} rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-2.5 sm:mb-3 shadow-lg`}>
                    {config.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">
                    {location.pathname.includes('register') ? 'Create Account' : 'Welcome Back'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 px-2">
                    {location.pathname.includes('register') 
                      ? `Join thousands of ${currentPortal}s on AllCognix` 
                      : `Continue to your ${currentPortal} portal`
                    }
                  </p>
                </div>

                {/* Form Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Outlet />
                  </motion.div>
                </AnimatePresence>

              </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Footer - Smaller */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-0 left-0 right-0 z-10 p-2 sm:p-3 text-center"
      >
        <div className="text-[9px] sm:text-[10px] text-gray-500">
          © {new Date().getFullYear()} AllCognix. All rights reserved.
        </div>
      </motion.footer>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(-10px) rotate(-1deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(-1deg); }
          66% { transform: translateY(-25px) rotate(1deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(2deg); }
        }
        
        .animate-float { animation: float 20s infinite ease-in-out; }
        .animate-float-delayed { animation: float-delayed 25s infinite ease-in-out 5s; }
        .animate-float-slow { animation: float-slow 30s infinite ease-in-out 10s; }
        
        .bg-grid-slate-100 {
          background-image: linear-gradient(to right, rgb(241 245 249) 1px, transparent 1px),
                            linear-gradient(to bottom, rgb(241 245 249) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
