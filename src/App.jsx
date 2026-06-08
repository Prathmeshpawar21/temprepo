/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/
// App.jsx
import React from 'react';
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './component/Authentication/AuthContext';

import ProtectedRoute from './component/layouts/ProtectedRoute';
import { LoadingScreen } from './component/layouts/ProtectedRoute';

import PortalSelector from './component/Authentication/PortalSelector';
import ErrorBoundary from './component/layouts/ErrorBoundary'; 

import AuthLayout from './component/layouts/AuthLayout';
import Sidebar from './component/layouts/Sidebar';
import AuthPage from './component/Authentication/AuthPage';

import Dashboard from './component/pages/Dashboard/Dashboard';
import Record from './component/pages/Records/Record';
import Appointments from './component/pages/Appointment/Appointments';
import Medications from './component/pages/Medication/Medications';
import Profile from './component/pages/Profiles/Profile';
// import NewConsult from './component/pages/Consult/NewConsult_Old';

import NewVoiceConsult from './component/pages/VoiceConsult/NewVoiceConsult';

import ConsultHistory from './component/pages/ConsultHistory/ConsultHistory';

import NotFound from './component/pages/NotFound';

// Forms
import PatientIntakeForm from './component/Forms/PatientIntakeForm';
import PatientPrescriptionUpload from './component/Forms/PatientPrescriptionUpload';
import DoctorIntakeForm from './component/Forms/DoctorIntakeView';

// Payment
// import UpgradeToPro from './component/pages/Payment/UpgradeToPro';

import { SubscriptionProvider } from './component/Authentication/SubscriptionContext'; 
import SubscriptionDashboard from './component/pages/Subscription/SubscriptionDashboard';
import PaymentSuccess from './component/pages/Payment/PaymentSuccess';
import PaymentCancel from './component/pages/Payment/PaymentCancel';

import OAuthCallback from './component/Authentication/OAuthCallback';
import OAuthSuccess from './component/Authentication/OAuthSuccess';

import HelpSupport from './component/pages/HelpSupport/HelpSupport';
import About from './component/pages/About/About';

// ✅ Video Call
import VideoCallPage from './component/pages/VideoCall/VideoCallPage';

// ✅ NEW: Pathway 2 Booking Flow
import BookAppointment from './component/pages/Bookings/BookAppointment';

// Testing Routes
import TestingWrapper from './component/pages/Consult/TestingWrapper';

// Google Analytics
import { trackPageView } from "./utils/ga";
import SubscriptionGuard from "./component/Authentication/SubscriptionGuard";


// App wrapper to handle loading state
const AppContent = () => {
  const location = useLocation();
  
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  const { isLoading } = useAuth();
  
  if (isLoading) return <LoadingScreen />;
  
  return (
    <SubscriptionProvider>
      <Routes>
        {/* Auth routes */}
        <Route path="/select-portal" element={<PortalSelector />} />
        <Route path="/login" element={<AuthLayout />}>
          <Route index element={<AuthPage />} />
        </Route> 

        <Route path="/auth/callback" element={<OAuthCallback />} /> 
        <Route path="/auth/success" element={<OAuthSuccess />} />

        {/* ✅ Intake forms with role protection */}
        <Route 
          path="/patient-intake" 
          element={
            <ProtectedRoute requiredRole="patient">
              <PatientIntakeForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patient-upload-prescription" 
          element={
            <ProtectedRoute requiredRole="patient">
              <PatientPrescriptionUpload />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor-intake" 
          element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorIntakeForm />
            </ProtectedRoute>
          } 
        /> 

        {/* ✅ Protected Routes with role-based access */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Sidebar />
            </ProtectedRoute>
          }
        >
          {/* ✅ Dashboard - Both roles can access */}
          <Route index element={
              <SubscriptionGuard requiredPlan="Free">
                <Dashboard />
            </SubscriptionGuard>
          } />
          

          {/* <Route path="/test-booking" element={<TestingWrapper />} />    */}
          
          {/* ✅ NEW CONSULT - Patient only */}
          <Route 
            path="/new-consult" 
            element={
               <SubscriptionGuard requiredPlan="Standard">
              <ProtectedRoute requiredRole="patient">
                {/* <NewConsult /> */}
                <NewVoiceConsult />
              </ProtectedRoute>
              </SubscriptionGuard>
            } 
          />

          {/* ✅ CONSULT HISTORY - Patient only */}
          <Route 
            path="/consult-history" 
            element={
               <SubscriptionGuard requiredPlan="Free">
                  <ProtectedRoute requiredRole="patient">
                    <ConsultHistory />
                  </ProtectedRoute>
              </SubscriptionGuard>
            } 
          />
          
          {/* ✅ APPOINTMENTS - Both roles */}
          <Route path="/appointments" element={
               <SubscriptionGuard requiredPlan="Basic">
                 <Appointments />
              </SubscriptionGuard>
            } />
          
          {/* ✅ MEDICATIONS - Both roles */}
          <Route path="/medications" element={
               <SubscriptionGuard requiredPlan="Pro">
                <Medications /> 
              </SubscriptionGuard>
            } />
          
          {/* ✅ RECORDS - Both roles */}
          <Route path="/records" element={
               <SubscriptionGuard requiredPlan="Standard">
                  <Record />
              </SubscriptionGuard>
           } />
          
          {/* ✅ PROFILE - Both roles */}
          <Route path="/profile" element={<Profile />} />


       
          <Route path="/profile" element={<Profile />} />
          <Route path="/help-support" element={<HelpSupport />} />
          <Route path="/about" element={<About />} />

          {/* ✅ SUBSCRIPTION & PAYMENT - Both roles */}
          
          <Route path="/subscription" element={<SubscriptionDashboard />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />

          {/* ✅ VIDEO CALL - Both roles can join (Outside Sidebar) */}
         
          
          <Route
          path="/book-appointment/*"
          element={
               <SubscriptionGuard requiredPlan="Basic">
                  <ProtectedRoute requiredRole="patient">
                    <BookAppointment />
                  </ProtectedRoute>
             </SubscriptionGuard>
          }
        />


          <Route path="*" element={<NotFound />} />
        </Route>



        {/* ✅ NEW: PATHWAY 2 BOOKING FLOW - Patient only (Outside Sidebar) */}
        <Route
            path="/video-call/:appointmentId"
            element={
                <SubscriptionGuard requiredPlan="Basic">
                  <ProtectedRoute>
                    <VideoCallPage />
                  </ProtectedRoute>
              </SubscriptionGuard>
            }
          />



      </Routes>
    </SubscriptionProvider>
  );
};



function App() {
  return (
     <ErrorBoundary>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
     </ErrorBoundary>
  );
}

export default App;




