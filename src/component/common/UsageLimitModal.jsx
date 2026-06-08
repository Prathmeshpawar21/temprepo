/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Crown, 
  Building, 
  Check, 
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react';
import { useSubscription } from '../Authentication/SubscriptionContext';

const UsageLimitModal = ({ 
  isOpen, 
  onClose, 
  onRetry
}) => {
  const navigate = useNavigate();
  const { subscription, usageStats, plans, getRemainingCalls } = useSubscription();

  // Get premium and enterprise plans for upgrade options
  const premiumPlan = plans.find(plan => plan.name === 'premium');
  const enterprisePlan = plans.find(plan => plan.name === 'enterprise');

  const handleUpgrade = () => {
    navigate('/upgrade');
    onClose();
  };

  const handleViewSubscription = () => {
    navigate('/subscription');
    onClose();
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-full">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Usage Limit Reached</h3>
                <p className="text-sm opacity-90">You've used all your monthly consultations</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Current Usage Stats */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {subscription?.plan?.display_name || 'Free Plan'}
                  </div>
                  <div className="text-gray-500">Current Plan</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {usageStats?.current_month_calls || 0}/{subscription?.plan?.monthly_api_calls || 5}
                  </div>
                  <div className="text-gray-500">API Calls Used</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Monthly Usage</span>
                  <span>100% Used</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full w-full"></div>
                </div>
              </div>
            </div>

            {/* Upgrade Options */}
            <div className="space-y-4 mb-6">
              <h4 className="font-semibold text-gray-900 text-center mb-4">
                Upgrade for Unlimited Access
              </h4>
              
              {/* Premium Plan */}
              {premiumPlan && (
                <div className="border-2 border-purple-200 rounded-xl p-4 bg-purple-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Crown className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-purple-900">{premiumPlan.display_name}</h5>
                        <p className="text-sm text-purple-700">Most Popular Choice</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-purple-600">
                        ₹{premiumPlan.monthly_price}
                      </div>
                      <div className="text-sm text-purple-700">per month</div>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    {premiumPlan.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-purple-800">
                        <Check className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Enterprise Plan */}
              {enterprisePlan && (
                <div className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-blue-900">{enterprisePlan.display_name}</h5>
                        <p className="text-sm text-blue-700">For Professionals</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">
                        ₹{enterprisePlan.monthly_price}
                      </div>
                      <div className="text-sm text-blue-700">per month</div>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    {enterprisePlan.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-blue-800">
                        <Check className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg"
              >
                <Crown className="h-5 w-5" />
                <span>Upgrade Now</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleViewSubscription}
                  className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                >
                  View Usage
                </button>
                
                <button
                  onClick={onClose}
                  className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Retry Section */}
            {onRetry && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleRetry}
                  className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center space-x-2 py-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Try again (if you just upgraded)</span>
                </button>
              </div>
            )}

            {/* Support Note */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Need help? Contact our support team for assistance with your subscription.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UsageLimitModal;
