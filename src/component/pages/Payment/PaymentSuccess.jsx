/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/Payment/PaymentSuccess.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, ArrowRight, Crown, Sparkles } from 'lucide-react';
import { useSubscription } from '../../Authentication/SubscriptionContext';
import { verifyStripePayment } from '../../../api/stripeService';
import { toast } from 'react-hot-toast';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshSubscriptionData } = useSubscription();
  
  const [verifying, setVerifying] = useState(true);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(3);
  
  const verificationAttempted = useRef(false);

  // Verification effect
  useEffect(() => {
    if (verificationAttempted.current) {
      console.log('⏭️ Verification already attempted, skipping...');
      return;
    }
    
    verificationAttempted.current = true;
    let isMounted = true;
    
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        if (isMounted) {
          setError('No payment session found');
          setVerifying(false);
          toast.error('Invalid payment session');
        }
        return;
      }

      console.log('🔍 Verifying Stripe payment:', sessionId);

      try {
        const result = await verifyStripePayment(sessionId);
        
        if (!isMounted) return;
        
        if (result.success) {
          setPaymentDetails(result.data);
          setVerificationComplete(true);
          
          await refreshSubscriptionData();
          
          if (result.data.email_sent) {
            toast.success('🎉 Payment successful! Confirmation email sent to your inbox.');
          } else if (result.data.email_skipped_reason) {
            toast.success('🎉 Payment already verified!');
          } else {
            toast.success('🎉 Payment successful! Welcome to premium!');
          }
        } else {
          setError(result.error || 'Payment verification failed');
          toast.error('Payment verification failed');
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('❌ Verification error:', err);
        setError('An error occurred during verification');
        toast.error('Verification failed');
      } finally {
        if (isMounted) {
          setVerifying(false);
        }
      }
    };

    verifyPayment();
    
    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  // Auto-redirect countdown
  useEffect(() => {
    if (verificationComplete && !error) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            console.log('⏰ Redirecting to subscription page...');
            navigate('/subscription');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [verificationComplete, error, navigate]);

  // Loading state
  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center"
        >
          <div className="flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Verifying Payment...
          </h2>
          <p className="text-gray-600 mb-6">
            Please wait while we confirm your payment with Stripe.
          </p>
          
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-4xl">❌</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Verification Failed
          </h2>
          <p className="text-gray-600 mb-8">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/upgrade')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/subscription')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-12 max-w-lg w-full relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
          <Sparkles className="h-40 w-40 text-green-500" />
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative z-10"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="h-14 w-14 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">
            Payment Successful! 🎉
          </h1>

          <p className="text-gray-600 mb-8 text-center text-lg">
            Welcome to <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {paymentDetails?.subscription?.plan_name || 'Premium'}
            </span>
          </p>

          {paymentDetails && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Plan</span>
                <div className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">
                    {paymentDetails.subscription.plan_name}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Amount Paid</span>
                {/* ✅ USD Formatting */}
                <span className="font-bold text-gray-900 text-lg">
                  ${paymentDetails.payment.amount.toLocaleString()}
                  {/* ${(paymentDetails.payment.amount / 100).toFixed(2)} */}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Billing Cycle</span>
                <span className="font-semibold text-gray-900 capitalize">
                  {paymentDetails.subscription.billing_cycle}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold text-gray-900">
                  Stripe
                </span>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
              What you get:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {paymentDetails?.subscription?.plan_features?.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center"
                >
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </motion.li>
              )) || (
                <>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Unlimited AI consultations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Advanced analytics</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/subscription')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>View My Subscription</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Redirecting to subscription dashboard in {countdown} second{countdown !== 1 ? 's' : ''}...
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
