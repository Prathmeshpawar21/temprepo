/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/api/paymentService.js
import api from './api';

/**
 * ==================== PAYMENT SERVICES ====================
 * Stripe-only payment services (Razorpay removed)
 */

/**
 * Create Stripe Checkout Session for subscription
 * @param {string} planName - Plan name (basic, standard, pro)
 * @param {string} billingCycle - 'monthly' or 'yearly'
 * @returns {Promise<object>}
 */
export const createStripeCheckoutSession = async (planName, billingCycle = 'monthly') => {
  try {
    const response = await api.post('/payments/stripe/create-checkout-session', {
      plan_name: planName,
      billing_cycle: billingCycle
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Error creating Stripe checkout:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to create Stripe checkout'
    };
  }
};

/**
 * Verify Stripe payment after redirect
 * @param {string} sessionId - Stripe checkout session ID
 * @returns {Promise<object>}
 */
export const verifyStripeSessionPayment = async (sessionId) => {
  try {
    const response = await api.post('/payments/stripe/verify-payment', {
      session_id: sessionId
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Error verifying Stripe payment:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Payment verification failed'
    };
  }
};

/**
 * Get Stripe publishable key
 * @returns {Promise<string>}
 */
export const getStripePublishableKey = async () => {
  try {
    const response = await api.get('/payments/stripe/publishable-key');
    return response.data.publishable_key;
  } catch (error) {
    console.error('❌ Error fetching Stripe key:', error);
    return null;
  }
};

/**
 * Get user's payment history (Stripe only)
 * @param {number} limit - Number of payments to fetch
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

/**
 * Test Stripe connection
 * @returns {Promise<object>}
 */
export const testStripeConnection = async () => {
  try {
    const response = await api.get('/payments/stripe/test-connection');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Stripe test failed:', error);
    return { success: false, error: error.message };
  }
};

export default {
  createStripeCheckoutSession,
  verifyStripeSessionPayment,
  getStripePublishableKey,
  getPaymentHistory,
  testStripeConnection
};
