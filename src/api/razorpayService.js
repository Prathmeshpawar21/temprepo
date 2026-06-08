/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

import api from './api';

/** Create Razorpay order for subscription upgrade */
export const createRazorpayOrder = async (planName, billingCycle = 'monthly') => {
  try {
    console.log(`🔷 Creating Razorpay order: ${planName} (${billingCycle})`);
    const response = await api.post('/payments/razorpay/create-order', {
      plan_name: planName,
      billing_cycle: billingCycle
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Razorpay order error:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to create Razorpay order'
    };
  }
};

/** Verify HMAC signature + upgrade subscription */
export const verifyRazorpayPayment = async (orderId, paymentId, signature) => {
  try {
    console.log(`🔍 Verifying Razorpay: ${orderId}`);
    const response = await api.post('/payments/razorpay/verify-payment', {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Razorpay verify error:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Payment verification failed'
    };
  }
};

/** Get Razorpay Key ID for frontend checkout */
export const getRazorpayKey = async () => {
  try {
    const response = await api.get('/payments/razorpay/key');
    return response.data.key_id;
  } catch (error) {
    console.error('❌ Error fetching Razorpay key:', error);
    return null;
  }
};

export default { createRazorpayOrder, verifyRazorpayPayment, getRazorpayKey };
