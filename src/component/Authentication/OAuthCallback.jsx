/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// OAuthCallback.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Activity, AlertCircle } from 'lucide-react';


const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');


  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');


        if (error) {
          console.error('❌ OAuth error:', error, errorDescription);
          
          const decodedError = decodeURIComponent(errorDescription || error);
          console.log('🔍 Decoded error:', decodedError);
          
          // ✅ CHECK FOR ROLE MISMATCH - Pass to AuthPage with portal info
          if (decodedError.includes('registered as a patient')) {
            console.log('🚫 Detected: User is patient trying doctor portal');
            
            navigate('/login', { 
            // navigate('/authentication', { 
              replace: true,
              state: { 
                error: 'Access denied. This account is registered as a patient. Please use the patient portal.',
                portal: 'patient',
                isOAuthError: true
              }
            });
            
          } else if (decodedError.includes('registered as a doctor')) {
            console.log('🚫 Detected: User is doctor trying patient portal');
            
            navigate('/login', { 
            // navigate('/authentication', { 
              replace: true,
              state: { 
                error: 'Access denied. This account is registered as a doctor. Please use the doctor portal.',
                portal: 'doctor',
                isOAuthError: true
              }
            });
            
          } else {
            // Generic error
            console.log('Generic OAuth error');
            setError(decodedError || 'Authentication failed');
            
            setTimeout(() => {
              navigate('/login', {
              // navigate('/authentication', {
                replace: true,
                state: { error: decodedError }
              });
            }, 2000);
          }
          
          return;
        }


        // If no error, shouldn't reach here (backend handles callback)
        console.warn('Reached OAuthCallback without error - redirecting...');
        setTimeout(() => navigate('/login', { replace: true }), 1000);
        // setTimeout(() => navigate('/authentication', { replace: true }), 1000);


      } catch (err) {
        console.error('❌ OAuth callback error:', err);
        
        const errorMessage = err.message || 'Failed to complete Google login';
        setError(errorMessage);
        
        setTimeout(() => {
          navigate('/login', { 
          // navigate('/authentication', { 
            replace: true,
            state: { error: errorMessage }
          });
        }, 2000);
      }
    };


    handleOAuthCallback();
  }, [searchParams, navigate]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto p-8"
      >
        {!error ? (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Processing Login
            </h2>
            <p className="text-gray-600 mb-6">Please wait...</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Redirecting...</span>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-3xl flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Authentication Error
            </h2>
            <p className="text-red-600 mb-6">{error}</p>
            <p className="text-gray-500 text-sm">
              Redirecting to login...
            </p>
          </>
        )}


        {/* Google Logo */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Secured by Google</span>
        </div>
      </motion.div>
    </div>
  );
};


export default OAuthCallback;
