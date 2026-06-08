/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/api/stripeService.js
import api from './api';

/**
 * ==================== STRIPE PAYMENT SERVICES ====================
 * Stripe-only payment integration for USD subscriptions
 */

/**
 * Create Stripe Checkout Session for subscription upgrade
 * @param {string} planName - Plan name (basic, standard, pro)
 * @param {string} billingCycle - 'monthly' or 'yearly'
 * @returns {Promise<object>}
 */
export const createStripeCheckout = async (planName, billingCycle = 'monthly') => {
  try {
    console.log(`💳 Creating Stripe checkout: ${planName} (${billingCycle})`);
    
    const response = await api.post('/payments/stripe/create-checkout-session', {
      plan_name: planName,
      billing_cycle: billingCycle
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Error creating Stripe checkout:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.detail || 'Failed to create checkout session'
    };
  }
};

/**
 * Verify Stripe payment after checkout completion
 * @param {string} sessionId - Stripe checkout session ID
 * @returns {Promise<object>}
 */
export const verifyStripePayment = async (sessionId) => {
  try {
    console.log(`🔍 Verifying Stripe payment: ${sessionId}`);
    
    const response = await api.post('/payments/stripe/verify-payment', {
      session_id: sessionId
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Error verifying Stripe payment:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.detail || 'Payment verification failed'
    };
  }
};

/**
 * Get Stripe publishable key
 * @returns {Promise<string|null>}
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
 * Test Stripe connection (for debugging)
 * @returns {Promise<object>}
 */
export const testStripeConnection = async () => {
  try {
    const response = await api.get('/payments/stripe/test-connection');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Stripe connection test failed:', error);
    return { success: false, error: error.message };
  }
};

export default {
  createStripeCheckout,
  verifyStripePayment,
  getStripePublishableKey,
  testStripeConnection
};
