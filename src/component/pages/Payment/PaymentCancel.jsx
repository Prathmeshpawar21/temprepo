/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/Payment/PaymentCancel.jsx
// ✅ NO CHANGES NEEDED - Already perfect
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <XCircle className="h-12 w-12 text-yellow-600" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-8">
          Your payment was cancelled. No charges have been made to your account.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm">
            What happened?
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• You closed the payment window</li>
            <li>• Payment was manually cancelled</li>
            <li>• Session timed out</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/upgrade')}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Try Again</span>
          </button>
          
          <button
            onClick={() => navigate('/subscription')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Need help? <button onClick={() => navigate('/support')} className="text-blue-600 hover:underline">Contact Support</button>
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentCancel;
