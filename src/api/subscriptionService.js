/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/api/subscriptionService.js
import api from './api';

/**
 * ==================== SUBSCRIPTION SERVICES ====================
 * All subscription-related API calls (plans, usage, history)
 */

/**
 * Get all available subscription plans (public, no auth required)
 * @returns {Promise<object>} { success: true, plans: [], currency: 'USD' }
 */
export const getSubscriptionPlans = async () => {
  try {
    const response = await api.get('/subscription/plans');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Error fetching plans:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to fetch plans'
    };
  }
};

/**
 * Get current user's subscription
 * @returns {Promise<object>}
 */
export const getMySubscription = async () => {
  try {
    const response = await api.get('/subscription/my-subscription');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Error fetching subscription:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to fetch subscription'
    };
  }
};

/**
 * Get usage statistics for current month
 * @returns {Promise<object>}
 */
export const getUsageStats = async () => {
  try {
    const response = await api.get('/subscription/usage-stats');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Error fetching usage stats:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to fetch usage stats'
    };
  }
};

/**
 * Get user analytics
 * @param {number} days - Number of days to fetch (default: 30)
 * @returns {Promise<object>}
 */
export const getUserAnalytics = async (days = 30) => {
  try {
    const response = await api.get('/subscription/analytics', {
      params: { days }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Error fetching analytics:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to fetch analytics'
    };
  }
};

/**
 * Cancel current subscription
 * @returns {Promise<object>}
 */ 
export const cancelSubscription = async (reason = 'user_requested') => {
  try {
    const response = await api.post('/payments/razorpay/cancel-subscription', {
      reason   // ← sends body so backend logs the reason correctly
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Error cancelling subscription:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to cancel subscription'
    };
  }
};
/**
 * Get payment history
 * @param {number} limit - Number of payments to fetch (default: 20)
 * @returns {Promise<object>}
 */
export const getPaymentHistory = async (limit = 20) => {
  try {
    const response = await api.get('/payments/payment-history', {
      params: { limit }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Error fetching payment history:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to fetch payment history'
    };
  }
};

export default {
  getSubscriptionPlans,
  getMySubscription,
  getUsageStats,
  getUserAnalytics,
  cancelSubscription,
  getPaymentHistory
};
