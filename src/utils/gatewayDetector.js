/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// Detect India via timezone (no network call, instant, reliable)
const INDIA_TIMEZONES = new Set(['Asia/Calcutta', 'Asia/Kolkata']);

export const isIndianUser = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (INDIA_TIMEZONES.has(tz)) return true;
    const locale = navigator.language || '';
    return locale.startsWith('en-IN') || locale === 'hi';
  } catch {
    return false;
  }
};

export const getDefaultGateway = () => isIndianUser() ? 'razorpay' : 'stripe';
export const getCurrencyCode   = (gw) => gw === 'razorpay' ? 'INR' : 'USD';
export const getCurrencySymbol = (gw) => gw === 'razorpay' ? '₹'   : '$';

export const formatAmount = (amount, gw) => {
  const sym    = getCurrencySymbol(gw);
  const locale = gw === 'razorpay' ? 'en-IN' : 'en-US';
  return `${sym}${amount.toLocaleString(locale)}`;
};
