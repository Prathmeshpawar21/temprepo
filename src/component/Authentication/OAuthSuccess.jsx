/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/Authentication/OAuthSuccess.jsx

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateAuthState } = useAuth();
  const [status, setStatus] = useState('Completing login...');
  const [error, setError] = useState('');

  useEffect(() => {
    const completeOAuthLogin = async () => {
      try {
        console.log('🔵 OAuthSuccess component mounted');
        console.log('🔍 Current URL:', window.location.href);
        
        // Extract parameters from URL
        const token             = searchParams.get('token');
        const refresh_token     = searchParams.get('refresh_token');   // ← ADD
        const keycloak_id       = searchParams.get('keycloak_id');
        const email             = searchParams.get('email');
        const role              = searchParams.get('role');
        const has_filled_intake = searchParams.get('has_filled_intake') === 'true';

        console.log('📊 Extracted params:', {
          hasToken: !!token,
          tokenLength: token?.length,
          keycloak_id,
          email,
          role,
          has_filled_intake
        });

        // Validate required parameters is here
        if (!token || !keycloak_id || !email) {
          console.error('❌ Missing required parameters');
          throw new Error('Missing authentication data from backend');
        }

        console.log('✅ OAuth success - logging in user:', email);
        setStatus('Login successful! Setting up your account...');

        // Create user object
        const user = {
          keycloak_id,
          email,
          role,
          has_filled_intake,
          full_name: email.split('@')[0],
          first_name: email.split('@')[0],
          last_name: ''
        };

        console.log('🔄 Updating auth state...');

        // Update auth state
        await updateAuthState(user, token, refresh_token);

        console.log('✅ Auth state updated successfully');

        // Verify token was saved
        const savedToken = localStorage.getItem('access_token');
        console.log('✅ Token saved:', !!savedToken);

        console.log('✅ Auth state updated successfully');

        // Small delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Redirect based on user state
        if (!has_filled_intake) {
          const redirectPath = role === 'doctor' ? '/doctor-intake' : '/patient-intake';
          console.log(`📋 Redirecting to intake form: ${redirectPath}`);
          setStatus('Redirecting to intake form...');
          navigate(redirectPath, { replace: true });
        } else {
          console.log('🏠 Redirecting to dashboard');
          setStatus('Redirecting to dashboard...');
          navigate('/', { replace: true });
        }

      } catch (err) {
        console.error('❌ OAuth completion error:', err);
        setError(err.message || 'Authentication failed');
        
        // Redirect to login after error
        setTimeout(() => {
          navigate('/authentication', { 
            state: { error: `Authentication failed: ${err.message}` }
          });
        }, 3000);
      }
    };

    completeOAuthLogin();
  }, [searchParams, navigate, updateAuthState]);

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
              {status.includes('successful') || status.includes('Redirecting') ? (
                <CheckCircle className="w-10 h-10 text-white" />
              ) : (
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {status.includes('successful') ? 'Success!' : 'Almost There...'}
            </h2>
            <p className="text-gray-600 mb-6">{status}</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Setting up your account...</span>
            </div>

            {/* Google Logo */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Authenticated via Google</span>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-3xl flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Authentication Failed
            </h2>
            <p className="text-red-600 mb-6">{error}</p>
            <p className="text-gray-500 text-sm">
              Redirecting to login page...
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default OAuthSuccess;
