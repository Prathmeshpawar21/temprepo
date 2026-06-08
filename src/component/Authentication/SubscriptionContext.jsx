// /*************************************************************************
// * Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
// * All rights reserved.
// * This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
// * Unauthorized copying, sharing, or use of this code is prohibited.
// * The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
// * Author: prathamesh@allcognix.com
// * Date: 16-03-2026
// *************************************************************************/


// src/component/Authentication/SubscriptionContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';
import {
  isIndianUser,
  getDefaultGateway,
  getCurrencySymbol,
} from '../../utils/gatewayDetector';

import {
  getSubscriptionPlans,
  getMySubscription,
  getUsageStats,
  getPaymentHistory,
  cancelSubscription,
} from '../../api/subscriptionService';

import {
  createStripeCheckout,
  verifyStripePayment,
} from '../../api/stripeService';

import { verifyRazorpayPayment } from '../../api/razorpayService';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const { user, isAuthenticated, userProfile } = useAuth();

  const [subscription,    setSubscription]    = useState(null);
  const [usageStats,      setUsageStats]      = useState(null);
  const [plans,           setPlans]           = useState([]);
  const [paymentHistory,  setPaymentHistory]  = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [dataFetched,     setDataFetched]     = useState(false);

  // ✅ FIX: Stable memoized values — won't cause re-renders
  const isIndian       = React.useMemo(() => isIndianUser(),      []);
  const gateway        = React.useMemo(() => getDefaultGateway(), []);
  const currencySymbol = getCurrencySymbol(gateway);


  // ============= FETCH FUNCTIONS =============

  // ✅ FIX 1: Wrapped in useCallback so it can safely be used
  //    in useEffect dependency arrays without infinite loops.
  //    isIndian is a stable useMemo value so this is created once.
  const fetchPlans = useCallback(async () => {
    try {
      console.log('🔄 Fetching subscription plans (USD)...');
      const result = await getSubscriptionPlans();

      if (!result.success) throw new Error(result.error);

      const rawPlans = result.data.plans;

      const enhancedPlans = rawPlans.map(plan => ({
        ...plan,
        isFreePlan:      plan.monthly_price === 0,
        isPaidPlan:      plan.monthly_price > 0,
        hasYearlyOption: plan.yearly_price > 0,

        // ✅ USD + INR Formatting
        monthlyFormatted: isIndian && plan.razorpay_price_inr_monthly
          ? `₹${plan.razorpay_price_inr_monthly.toLocaleString('en-IN')}`
          : `$${plan.monthly_price.toLocaleString()}`,
        yearlyFormatted: plan.yearly_price > 0
          ? `$${plan.yearly_price.toLocaleString()}`
          : null,
        razorpayMonthlyFormatted: plan.razorpay_price_inr_monthly
          ? `₹${plan.razorpay_price_inr_monthly.toLocaleString('en-IN')}`
          : null,
        razorpayYearlyFormatted: plan.razorpay_price_inr_yearly
          ? `₹${plan.razorpay_price_inr_yearly.toLocaleString('en-IN')}`
          : null,

        callsDisplay:  plan.monthly_api_calls === 0  ? 'Unlimited' : plan.monthly_api_calls.toLocaleString(),
        tokensDisplay: plan.monthly_token_limit === 0 ? 'Unlimited' : plan.monthly_token_limit.toLocaleString(),

        planColor: plan.name === 'pro'      ? 'gradient'
                 : plan.name === 'standard' ? 'purple'
                 : plan.name === 'basic'    ? 'blue'
                 : 'green',

        gradientClass: plan.name === 'pro'      ? 'from-indigo-600 to-purple-600'
                     : plan.name === 'standard' ? 'from-purple-500 to-pink-500'
                     : plan.name === 'basic'    ? 'from-blue-500 to-cyan-500'
                     : 'from-green-500 to-emerald-500',

        badge:      plan.is_popular        ? 'Most Popular'  : plan.monthly_price === 0 ? 'Free Forever' : null,
        badgeColor: plan.is_popular        ? 'purple'        : plan.monthly_price === 0 ? 'green'        : null,

        yearlySavings:          plan.yearly_savings           || 0,
        yearlyDiscountPercent:  plan.yearly_discount_percent  || 0,
        yearlyMonthlyCost:      plan.pricing_display?.yearly?.monthly_equivalent || 0,
      }));

      setPlans(enhancedPlans);
      console.log('✅ Plans loaded:', enhancedPlans.length, enhancedPlans.map(p => p.name));

    } catch (err) {
      console.error('❌ Error fetching plans:', err);
      setError('Failed to load subscription plans');
    }
  }, [isIndian]); // isIndian is a stable useMemo — this is created once


  // ✅ FIX 1: Wrapped in useCallback with ALL deps declared.
  //    This replaces both the old function AND the isFirstMount ref pattern.
  //    Effect 2 below can now safely list this in its dep array.
  const fetchUserSubscriptionData = useCallback(async (forceReload = false) => {
    const userId = userProfile?.keycloak_id || user?.keycloak_id;

    if (!isAuthenticated || !userId) {
      setSubscription(null);
      setUsageStats(null);
      setPaymentHistory([]);
      setDataFetched(false);
      return;
    }

    if (dataFetched && !forceReload) {
      console.log('📊 Data already fetched, skipping...');
      return;
    }

    try {
      console.log('🔄 Fetching user subscription data for:', userId);
      if (!forceReload) setLoading(true);

      const [subscriptionResult, usageResult, historyResult] = await Promise.all([
        getMySubscription(),
        getUsageStats(),
        getPaymentHistory(20).catch(() => ({ success: true, data: { payments: [] } })),
      ]);

      // ── SUBSCRIPTION ────────────────────────────────────────────────────
      if (subscriptionResult.success) {
        const raw = subscriptionResult.data.subscription;

        setSubscription({
          ...raw,
          isBasic:    raw.plan.name === 'basic',
          isStandard: raw.plan.name === 'standard',
          isPro:      raw.plan.name === 'pro',
          isFree:     raw.plan.name === 'free',
          isPaidPlan: raw.plan.monthly_price > 0,

          planColor: raw.plan.name === 'pro' || raw.plan.name === 'standard'
            ? 'purple'
            : raw.plan.name === 'basic' ? 'blue' : 'green',

          gradientClass: raw.plan.name === 'pro'      ? 'from-indigo-600 to-purple-600'
                       : raw.plan.name === 'standard' ? 'from-purple-500 to-pink-500'
                       : raw.plan.name === 'basic'    ? 'from-blue-500 to-cyan-500'
                       : 'from-green-500 to-emerald-500',

          startDateFormatted:   new Date(raw.start_date).toLocaleDateString('en-US'),
          endDateFormatted:     raw.end_date           ? new Date(raw.end_date).toLocaleDateString('en-US')           : null,
          nextBillingFormatted: raw.next_billing_date  ? new Date(raw.next_billing_date).toLocaleDateString('en-US')  : null,

          callsLimitDisplay:  raw.plan.monthly_api_calls  === 0 ? 'Unlimited' : `${raw.plan.monthly_api_calls.toLocaleString()} per month`,
          tokensLimitDisplay: raw.plan.monthly_token_limit === 0 ? 'Unlimited' : `${raw.plan.monthly_token_limit.toLocaleString()} per month`,

          priceFormatted: (() => {
            if (raw.plan.monthly_price === 0) return '$0';
            if (raw.payment_method === 'razorpay' && raw.plan.razorpay_price_inr_monthly)
              return `₹${raw.plan.razorpay_price_inr_monthly.toLocaleString('en-IN')}`;
            return `$${raw.plan.monthly_price.toLocaleString()}`;
          })(),

          priceDisplay: raw.plan.monthly_price > 0
            ? `$${raw.plan.monthly_price.toLocaleString()}/month`
            : 'Free Forever',
        });

        console.log('✅ Subscription loaded:', raw.plan.name);
      }

      // ── USAGE STATS ─────────────────────────────────────────────────────
      if (usageResult.success) {
        const raw = usageResult.data;

        setUsageStats({
          ...raw,
          currentCallsFormatted:  raw.current_month_calls?.toLocaleString()  || '0',
          currentTokensFormatted: raw.current_month_tokens?.toLocaleString() || '0',
          currentCostFormatted:   `$${(raw.current_month_cost || 0).toFixed(2)}`,

          callsUsagePercent:  raw.usage_percentages?.calls  || 0,
          tokensUsagePercent: raw.usage_percentages?.tokens || 0,

          isNearCallsLimit:      (raw.usage_percentages?.calls  || 0) > 80,
          isNearTokensLimit:     (raw.usage_percentages?.tokens || 0) > 80,
          hasExceededCallsLimit:  (raw.usage_percentages?.calls  || 0) >= 100,
          hasExceededTokensLimit: (raw.usage_percentages?.tokens || 0) >= 100,

          remainingCallsDisplay:  raw.remaining_calls  === 'unlimited' ? 'Unlimited' : raw.remaining_calls?.toLocaleString()  || '0',
          remainingTokensDisplay: raw.remaining_tokens === 'unlimited' ? 'Unlimited' : raw.remaining_tokens?.toLocaleString() || '0',

          callsProgressColor:  (raw.usage_percentages?.calls  || 0) >= 100 ? 'red' : (raw.usage_percentages?.calls  || 0) > 80 ? 'yellow' : 'blue',
          tokensProgressColor: (raw.usage_percentages?.tokens || 0) >= 100 ? 'red' : (raw.usage_percentages?.tokens || 0) > 80 ? 'yellow' : 'green',

          avgCostFormatted:   raw.avg_cost_per_call ? `$${raw.avg_cost_per_call.toFixed(3)}` : '$0.000',
          avgTokensFormatted: Math.round(raw.avg_tokens_per_call || 0).toLocaleString(),
        });

        console.log('✅ Usage stats loaded');
      }

      // ── PAYMENT HISTORY ──────────────────────────────────────────────────
      if (historyResult.success) {
        const enhanced = (historyResult.data.payments || []).map(p => ({
          ...p,
          amountFormatted: p.currency === 'INR'
            ? `₹${p.amount.toLocaleString('en-IN')}`
            : `$${p.amount.toLocaleString()}`,
          dateFormatted: new Date(p.created_at).toLocaleDateString('en-US'),
          timeFormatted: new Date(p.created_at).toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit',
          }),
          statusBadgeColor: p.status === 'success' ? 'green' : p.status === 'pending' ? 'yellow' : 'red',
          statusDisplay:    p.status.charAt(0).toUpperCase() + p.status.slice(1),
          planDisplay:      p.plan_name || 'Unknown Plan',
          gatewayDisplay:    p.payment_gateway === 'razorpay' ? 'Razorpay' : 'Stripe',
          gatewayBadgeColor: p.payment_gateway === 'razorpay' ? 'orange'   : 'blue',
        }));

        setPaymentHistory(enhanced);
        console.log('✅ Payment history loaded:', enhanced.length);
      }

      setDataFetched(true);
      setError(null);

    } catch (err) {
      console.error('❌ Error fetching user subscription data:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        // Auth not ready yet — silently skip, Effect 2 will retry on auth change
        setError(null);
      } else {
        setError('Failed to load subscription data');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userProfile?.keycloak_id, user?.keycloak_id, dataFetched]);
  // ↑ dataFetched is needed so the guard `if (dataFetched && !forceReload)` reads fresh state


  // ============= STRIPE PAYMENT FUNCTIONS =============

  const processStripePaymentUpgrade = async (planName, billingCycle = 'monthly') => {
    try {
      console.log(`💳 Processing Stripe payment: ${planName} (${billingCycle})`);
      const result = await createStripeCheckout(planName, billingCycle);
      if (!result.success) throw new Error(result.error);
      console.log('🔀 Redirecting to Stripe Checkout...');
      window.location.href = result.data.checkout_url;
      return { success: true };
    } catch (err) {
      console.error('❌ Stripe payment error:', err);
      toast.error(err.message || 'Failed to initialize Stripe payment');
      return { success: false, error: err.message };
    }
  };

  const verifyStripePaymentAndRefresh = async (sessionId) => {
    try {
      const result = await verifyStripePayment(sessionId);
      if (result.success) {
        await fetchUserSubscriptionData(true);
        return result;
      }
      throw new Error(result.error);
    } catch (err) {
      console.error('❌ Stripe verification error:', err);
      return { success: false, error: err.message };
    }
  };

  // ✅ Kept for Razorpay users who may still have active subscriptions
  const verifyRazorpayAndRefresh = async (orderId, paymentId, signature) => {
    try {
      const result = await verifyRazorpayPayment(orderId, paymentId, signature);
      if (result.success) {
        await fetchUserSubscriptionData(true);
        return result;
      }
      throw new Error(result.error);
    } catch (err) {
      console.error('❌ Razorpay verification error:', err);
      return { success: false, error: err.message };
    }
  };


  // ============= LIFECYCLE EFFECTS =============

  // ✅ FIX 1 — Effect 1: Plans load unconditionally.
  //    fetchPlans is stable (useCallback with [isIndian]) — runs once.
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);


  // ✅ FIX 1 — Effect 2: Fires whenever auth identity changes.
  //    Replaces old empty-dep Effect + isFirstMount ref pattern.
  //    - On mount: if Keycloak is already resolved → fetches immediately
  //    - On login: isAuthenticated flips true → fetches with forceReload=true
  //    - On logout: clears all state
  useEffect(() => {
    if (isAuthenticated && (userProfile?.keycloak_id || user?.keycloak_id)) {
      console.log('🔐 Auth ready, fetching subscription data...');
      fetchUserSubscriptionData(true);
    } else if (!isAuthenticated) {
      setSubscription(null);
      setUsageStats(null);
      setPaymentHistory([]);
      setDataFetched(false);
      setError(null);
      setLoading(false);
    }
  // ✅ fetchUserSubscriptionData is a stable useCallback — safe in deps.
  //    Listing it here means ESLint is satisfied AND we get fresh function
  //    if auth identity ever changes between renders.
  }, [isAuthenticated, userProfile?.keycloak_id, user?.keycloak_id, fetchUserSubscriptionData]);


  // ============= ACTION FUNCTIONS =============

  const refreshSubscriptionData = async () => {
    console.log('🔄 Refreshing subscription data...');
    setDataFetched(false);
    await fetchPlans();
    if (isAuthenticated && (userProfile?.keycloak_id || user?.keycloak_id)) {
      await fetchUserSubscriptionData(true);
    }
  };

  const cancelUserSubscription = async () => {
    try {
      setLoading(true);
      console.log('🚫 Cancelling subscription...');
      const result = await cancelSubscription('user_requested');
      if (result.success) {
        toast.success(result.data.message);
        await fetchUserSubscriptionData(true);
        return { success: true, message: result.data.message };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Error cancelling subscription:', err);
      toast.error('Failed to cancel subscription');
      return { success: false, error: 'Failed to cancel subscription' };
    } finally {
      setLoading(false);
    }
  };


  // ============= HELPER FUNCTIONS =============

  const isBasic    = () => subscription?.isBasic    || false;
  const isStandard = () => subscription?.isStandard || false;
  const isPro      = () => subscription?.isPro      || false;
  const isFree     = () => !subscription || subscription?.plan?.name === 'free';
  const isPaidPlan = () => subscription?.isPaidPlan || false;

  const canMakeApiCall = () => {
    if (!subscription || !usageStats) return false;
    return !usageStats.hasExceededCallsLimit && !usageStats.hasExceededTokensLimit;
  };

  const getRemainingCalls  = () => usageStats?.remaining_calls  === 'unlimited' ? 'unlimited' : usageStats?.remaining_calls  || 0;
  const getRemainingTokens = () => usageStats?.remaining_tokens === 'unlimited' ? 'unlimited' : usageStats?.remaining_tokens || 0;

  const getUsagePercentage = (type = 'calls') =>
    type === 'calls' ? usageStats?.callsUsagePercent || 0 : usageStats?.tokensUsagePercent || 0;

  const isNearLimit      = (type = 'calls', threshold = 80) => getUsagePercentage(type) > threshold;
  const hasExceededLimit = (type = 'calls')                  => getUsagePercentage(type) >= 100;
  const getPlanByName    = (planName) => plans.find(p => p.name === planName);
  const getPopularPlan   = ()         => plans.find(p => p.is_popular);


  // ============= CONTEXT VALUE =============

  const value = {
    // Data
    subscription,
    usageStats,
    plans,
    paymentHistory,
    loading,
    error,

    // Plan type helpers
    isBasic,
    isStandard,
    isPro,
    isFree,
    isPaidPlan,

    // Usage helpers
    canMakeApiCall,
    getRemainingCalls,
    getRemainingTokens,
    getUsagePercentage,
    isNearLimit,
    hasExceededLimit,
    getPlanByName,
    getPopularPlan,

    // ✅ Payment functions
    processStripePaymentUpgrade,
    verifyStripePaymentAndRefresh,
    verifyRazorpayAndRefresh,   // kept for existing Razorpay subscribers

    // Config
    gateway,
    isIndian,
    currencySymbol,

    // Actions
    refreshSubscriptionData,
    cancelSubscription: cancelUserSubscription,

    // Debug
    debugInfo: {
      isAuthenticated,
      userKeycloakId:       userProfile?.keycloak_id || user?.keycloak_id,
      hasSubscription:      !!subscription,
      hasUsageStats:        !!usageStats,
      dataFetched,
      loading,
      error,
      plansCount:           plans.length,
      paymentHistoryCount:  paymentHistory.length,
    },
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionProvider;










// // src/component/Authentication/SubscriptionContext.jsx
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useAuth } from './AuthContext';
// import { toast } from 'react-hot-toast';
// import { verifyRazorpayPayment } from '../../api/razorpayService';
// import {
//   isIndianUser,
//   getDefaultGateway,
//   getCurrencySymbol
// } from '../../utils/gatewayDetector';

// // ✅ UPDATED: Import new API services (Stripe-only)
// import {
//   getSubscriptionPlans,
//   getMySubscription,
//   getUsageStats,
//   getUserAnalytics,
//   cancelSubscription,
//   getPaymentHistory
// } from '../../api/subscriptionService';

// import {
//   createStripeCheckout,
//   verifyStripePayment
// } from '../../api/stripeService';

// const SubscriptionContext = createContext();

// export const useSubscription = () => {
//   const context = useContext(SubscriptionContext);
//   if (!context) {
//     throw new Error('useSubscription must be used within SubscriptionProvider');
//   }
//   return context;
// };

// export const SubscriptionProvider = ({ children }) => {
//   const { user, isAuthenticated, userProfile } = useAuth();
  
//   // State management
//   const [subscription, setSubscription] = useState(null);
//   const [usageStats, setUsageStats] = useState(null);
//   const [plans, setPlans] = useState([]);
//   const [paymentHistory, setPaymentHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dataFetched, setDataFetched] = useState(false);
//   const isIndian       = React.useMemo(() => isIndianUser(),      []);
//   const gateway        = React.useMemo(() => getDefaultGateway(), []);
//   const currencySymbol = getCurrencySymbol(gateway);

//   // ============= FETCH FUNCTIONS =============

//   /**
//    * Fetch all subscription plans (public, no auth needed)
//    * Plans: Free, Basic ($9), Standard ($29), Pro ($49)
//    */
//   const fetchPlans = async () => {
//     try {
//       console.log('🔄 Fetching subscription plans (USD)...');
//       const result = await getSubscriptionPlans();
      
//       if (!result.success) {
//         throw new Error(result.error);
//       }

//       const rawPlans = result.data.plans;
      
//       // ✅ UPDATED: Enhanced plan data with USD formatting
//       const enhancedPlans = rawPlans.map(plan => ({
//         ...plan,
//         // Plan type flags
//         isFreePlan: plan.monthly_price === 0,
//         isPaidPlan: plan.monthly_price > 0,
//         hasYearlyOption: plan.yearly_price > 0,
        
//         // ✅ USD + INR Formatting
//         monthlyFormatted: isIndian && plan.razorpay_price_inr_monthly
//           ? `₹${plan.razorpay_price_inr_monthly.toLocaleString('en-IN')}`
//           : `$${plan.monthly_price.toLocaleString()}`,
//         yearlyFormatted: plan.yearly_price > 0 ? `$${plan.yearly_price.toLocaleString()}` : null,

//         razorpayMonthlyFormatted: plan.razorpay_price_inr_monthly
//           ? `₹${plan.razorpay_price_inr_monthly.toLocaleString('en-IN')}`
//           : null,
//         razorpayYearlyFormatted: plan.razorpay_price_inr_yearly
//           ? `₹${plan.razorpay_price_inr_yearly.toLocaleString('en-IN')}`
//           : null,

        
//         // Display formatting
//         callsDisplay: plan.monthly_api_calls === 0 ? 'Unlimited' : `${plan.monthly_api_calls.toLocaleString()}`,
//         tokensDisplay: plan.monthly_token_limit === 0 ? 'Unlimited' : `${plan.monthly_token_limit.toLocaleString()}`,
        
//         // ✅ UPDATED: New plan colors (basic=blue, standard=purple, pro=gradient)
//         planColor: plan.name === 'pro' ? 'gradient' : 
//                    plan.name === 'standard' ? 'purple' : 
//                    plan.name === 'basic' ? 'blue' : 'green',
        
//         gradientClass: plan.name === 'pro' ? 'from-indigo-600 to-purple-600' : 
//                        plan.name === 'standard' ? 'from-purple-500 to-pink-500' : 
//                        plan.name === 'basic' ? 'from-blue-500 to-cyan-500' : 
//                        'from-green-500 to-emerald-500',
        
//         // Badge configuration
//         badge: plan.is_popular ? 'Most Popular' : plan.isFreePlan ? 'Free Forever' : null,
//         badgeColor: plan.is_popular ? 'purple' : plan.isFreePlan ? 'green' : null,
        
//         // Savings calculation
//         yearlySavings: plan.yearly_savings || 0,
//         yearlyDiscountPercent: plan.yearly_discount_percent || 0,
//         yearlyMonthlyCost: plan.pricing_display?.yearly?.monthly_equivalent || 0
//       }));
      
//       setPlans(enhancedPlans);
//       console.log('✅ Plans loaded (USD):', enhancedPlans.length, enhancedPlans.map(p => p.name));
      
//     } catch (error) {
//       console.error('❌ Error fetching plans:', error);
//       setError('Failed to load subscription plans');
//     }
//   };

//   /**
//    * Fetch user's subscription data (requires auth)
//    */
//   const fetchUserSubscriptionData = async (forceReload = false) => {
//     const userId = userProfile?.keycloak_id || user?.keycloak_id || localStorage.getItem('keycloak_id');
    
//     if (!isAuthenticated || !userId) {
//       console.log('User not authenticated or missing keycloak_id');
//       setSubscription(null);
//       setUsageStats(null);
//       setPaymentHistory([]);
//       setDataFetched(false);
//       return;
//     }

//     if (dataFetched && !forceReload) {
//       console.log('📊 Data already fetched, skipping...');
//       return;
//     }

//     try {
//       console.log('🔄 Fetching user subscription data for:', userId);
      
//       if (!forceReload) setLoading(true);
      
//       // Parallel fetch all user data
//       const [subscriptionResult, usageResult, historyResult] = await Promise.all([
//         getMySubscription(),
//         getUsageStats(),
//         getPaymentHistory(20).catch(() => ({ success: true, data: { payments: [] } }))
//       ]);

//       // ============= PROCESS SUBSCRIPTION DATA =============
//       if (subscriptionResult.success) {
//         const rawSubscription = subscriptionResult.data.subscription;
        
//         // ✅ UPDATED: Enhanced subscription with new plan names
//         const enhancedSubscription = {
//           ...rawSubscription,
          
//           // ✅ UPDATED: Plan type checks (basic, standard, pro)
//           isBasic: rawSubscription.plan.name === 'basic',
//           isStandard: rawSubscription.plan.name === 'standard',
//           isPro: rawSubscription.plan.name === 'pro',
//           isFree: rawSubscription.plan.name === 'free',
//           isPaidPlan: rawSubscription.plan.monthly_price > 0,
          
//           // ✅ UPDATED: Plan colors
//           planColor: rawSubscription.plan.name === 'pro' ? 'purple' : 
//                     rawSubscription.plan.name === 'standard' ? 'purple' : 
//                     rawSubscription.plan.name === 'basic' ? 'blue' : 'green',
          
//           gradientClass: rawSubscription.plan.name === 'pro' ? 'from-indigo-600 to-purple-600' : 
//                         rawSubscription.plan.name === 'standard' ? 'from-purple-500 to-pink-500' : 
//                         rawSubscription.plan.name === 'basic' ? 'from-blue-500 to-cyan-500' : 
//                         'from-green-500 to-emerald-500',
          
//           // Date formatting
//           startDateFormatted: new Date(rawSubscription.start_date).toLocaleDateString('en-US'),
//           endDateFormatted: rawSubscription.end_date ? 
//             new Date(rawSubscription.end_date).toLocaleDateString('en-US') : null,
//           nextBillingFormatted: rawSubscription.next_billing_date ?
//             new Date(rawSubscription.next_billing_date).toLocaleDateString('en-US') : null,
          
//           // Limit display
//           callsLimitDisplay: rawSubscription.plan.monthly_api_calls === 0 ? 
//             'Unlimited' : `${rawSubscription.plan.monthly_api_calls.toLocaleString()} per month`,
//           tokensLimitDisplay: rawSubscription.plan.monthly_token_limit === 0 ? 
//             'Unlimited' : `${rawSubscription.plan.monthly_token_limit.toLocaleString()} per month`,
          
//           // ✅ USD Price formatting
//           // ✅ Smart Price formatting (INR for Razorpay users, USD for others)
//           priceFormatted: (() => {
//             if (rawSubscription.plan.monthly_price === 0) return '$0';
//             if (rawSubscription.payment_method === 'razorpay' && rawSubscription.plan.razorpay_price_inr_monthly) {
//               return `₹${rawSubscription.plan.razorpay_price_inr_monthly.toLocaleString('en-IN')}`;
//             }
//             return `$${rawSubscription.plan.monthly_price.toLocaleString()}`;
//           })(),
//           priceDisplay: rawSubscription.plan.monthly_price > 0 ?
//             `$${rawSubscription.plan.monthly_price.toLocaleString()}/month` : 'Free Forever'

//         };
        
//         setSubscription(enhancedSubscription);
//         console.log('✅ Subscription loaded:', rawSubscription.plan.name);
//       }

//       // ============= PROCESS USAGE STATS =============
//       if (usageResult.success) {
//         const rawUsage = usageResult.data;
        
//         const enhancedUsageStats = {
//           ...rawUsage,
          
//           // Formatted values
//           currentCallsFormatted: rawUsage.current_month_calls?.toLocaleString() || '0',
//           currentTokensFormatted: rawUsage.current_month_tokens?.toLocaleString() || '0',
          
//           // ✅ USD Cost formatting
//           currentCostFormatted: `$${(rawUsage.current_month_cost || 0).toFixed(2)}`,
          
//           // Usage percentages
//           callsUsagePercent: rawUsage.usage_percentages?.calls || 0,
//           tokensUsagePercent: rawUsage.usage_percentages?.tokens || 0,
          
//           // Warning flags
//           isNearCallsLimit: (rawUsage.usage_percentages?.calls || 0) > 80,
//           isNearTokensLimit: (rawUsage.usage_percentages?.tokens || 0) > 80,
//           hasExceededCallsLimit: (rawUsage.usage_percentages?.calls || 0) >= 100,
//           hasExceededTokensLimit: (rawUsage.usage_percentages?.tokens || 0) >= 100,
          
//           // Remaining display
//           remainingCallsDisplay: rawUsage.remaining_calls === 'unlimited' ? 
//             'Unlimited' : rawUsage.remaining_calls?.toLocaleString() || '0',
//           remainingTokensDisplay: rawUsage.remaining_tokens === 'unlimited' ? 
//             'Unlimited' : rawUsage.remaining_tokens?.toLocaleString() || '0',
          
//           // Progress colors
//           callsProgressColor: (rawUsage.usage_percentages?.calls || 0) >= 100 ? 'red' :
//                              (rawUsage.usage_percentages?.calls || 0) > 80 ? 'yellow' : 'blue',
//           tokensProgressColor: (rawUsage.usage_percentages?.tokens || 0) >= 100 ? 'red' :
//                               (rawUsage.usage_percentages?.tokens || 0) > 80 ? 'yellow' : 'green',
          
//           // ✅ USD Averages
//           avgCostFormatted: rawUsage.avg_cost_per_call ? `$${rawUsage.avg_cost_per_call.toFixed(3)}` : '$0.000',
//           avgTokensFormatted: Math.round(rawUsage.avg_tokens_per_call || 0).toLocaleString()
//         };
        
//         setUsageStats(enhancedUsageStats);
//         console.log('✅ Usage stats loaded');
//       }

//       // ============= PROCESS PAYMENT HISTORY =============
//       if (historyResult.success) {
//         const enhancedPaymentHistory = historyResult.data.payments?.map(payment => ({
//           ...payment,
          


//           // ✅ Smart Amount formatting (INR or USD based on payment currency)
//           amountFormatted: payment.currency === 'INR'
//             ? `₹${payment.amount.toLocaleString('en-IN')}`
//             : `$${payment.amount.toLocaleString()}`,

//           // Date/time formatting
//           dateFormatted: new Date(payment.created_at).toLocaleDateString('en-US'),
//           timeFormatted: new Date(payment.created_at).toLocaleTimeString('en-US', {
//             hour: '2-digit', minute: '2-digit'
//           }),

//           // Status badge
//           statusBadgeColor: payment.status === 'success' ? 'green' :
//                             payment.status === 'pending' ? 'yellow' : 'red',
//           statusDisplay: payment.status.charAt(0).toUpperCase() + payment.status.slice(1),

//           // Plan display
//           planDisplay: payment.plan_name || 'Unknown Plan',

//           // ✅ Gateway display (Razorpay or Stripe)
//           gatewayDisplay:    payment.payment_gateway === 'razorpay' ? 'Razorpay' : 'Stripe',
//           gatewayBadgeColor: payment.payment_gateway === 'razorpay' ? 'orange'   : 'blue'



//         })) || [];
        
//         setPaymentHistory(enhancedPaymentHistory);
//         console.log('✅ Payment history loaded:', enhancedPaymentHistory.length);
//       }

//       setDataFetched(true);
//       setError(null);
      
//     } catch (error) {
//       console.error('❌ Error fetching user subscription data:', error);
//       setError('Failed to load subscription data');
      
//       if (error.response?.status === 401 || error.response?.status === 403) {
//         console.log('🔐 Authentication error, will retry when user is fully authenticated');
//         setError(null);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ============= STRIPE PAYMENT FUNCTIONS (Razorpay removed) =============

//   /**
//    * Process Stripe payment upgrade
//    * This will redirect to Stripe Checkout
//    */
//   const processStripePaymentUpgrade = async (planName, billingCycle = 'monthly') => {
//     try {
//       console.log(`💳 Processing Stripe payment: ${planName} (${billingCycle})`);
      
//       const result = await createStripeCheckout(planName, billingCycle);
      
//       if (!result.success) {
//         throw new Error(result.error);
//       }

//       const checkoutData = result.data;
      
//       // Redirect to Stripe Checkout
//       console.log('🔀 Redirecting to Stripe Checkout...');
//       window.location.href = checkoutData.checkout_url;
      
//       return { success: true };
//     } catch (error) {
//       console.error('❌ Stripe payment error:', error);
//       toast.error(error.message || 'Failed to initialize Stripe payment');
//       return { success: false, error: error.message };
//     }
//   };

//   /**
//    * Verify Stripe payment (called from success page)
//    */
//   const verifyStripePaymentAndRefresh = async (sessionId) => {
//     try {
//       const result = await verifyStripePayment(sessionId);
      
//       if (result.success) {
//         await fetchUserSubscriptionData(true);
//         return result;
//       }
      
//       throw new Error(result.error);
//     } catch (error) {
//       console.error('❌ Stripe verification error:', error);
//       return { success: false, error: error.message };
//     }
//   };


//     const verifyRazorpayAndRefresh = async (orderId, paymentId, signature) => {
//     try {
//       const result = await verifyRazorpayPayment(orderId, paymentId, signature);
//       if (result.success) {
//         await fetchUserSubscriptionData(true);
//         return result;
//       }
//       throw new Error(result.error);
//     } catch (error) {
//       console.error('❌ Razorpay verification error:', error);
//       return { success: false, error: error.message };
//     }
//   };



//   // ============= LIFECYCLE EFFECTS =============

//   // Initialize data fetching
//   useEffect(() => {
//     const loadData = async () => {
//       console.log('🚀 Initializing subscription system...');
//       await fetchPlans();
      
//       if (isAuthenticated && (userProfile?.keycloak_id || user?.keycloak_id)) {
//         await fetchUserSubscriptionData();
//       } else {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Watch for authentication changes
// // ✅ FIXED: Only fires on actual auth CHANGES, not on initial mount
//   const isFirstMount = React.useRef(true);

//   useEffect(() => {
//       if (isFirstMount.current) {
//           isFirstMount.current = false;
//           return;  // ← Skip on first mount, let Effect 1 handle it
//       }

//       if (isAuthenticated && (userProfile?.keycloak_id || user?.keycloak_id)) {
//           console.log('🔐 Auth changed, fetching subscription data...');
//           fetchUserSubscriptionData(true);  // forceReload=true on auth change
//       } else if (!isAuthenticated) {
//           setSubscription(null);
//           setUsageStats(null);
//           setPaymentHistory([]);
//           setDataFetched(false);
//           setError(null);
//           setLoading(false);
//       }
//   }, [isAuthenticated, userProfile?.keycloak_id, user?.keycloak_id]);


//   // ============= ACTION FUNCTIONS =============

//   /**
//    * Refresh all subscription data
//    */
//   const refreshSubscriptionData = async () => {
//     console.log('🔄 Refreshing subscription data...');
//     setDataFetched(false);
//     await fetchPlans();
//     if (isAuthenticated && (userProfile?.keycloak_id || user?.keycloak_id)) {
//       await fetchUserSubscriptionData(true);
//     }
//   };

//   /**
//    * Cancel subscription
//    */
//   const cancelUserSubscription = async () => {
//     try {
//       setLoading(true);
//       console.log('🚫 Cancelling subscription...');
      
//       // const result = await cancelSubscription();
//       const result = await cancelSubscription('user_requested');
      
//       if (result.success) {
//         toast.success(result.data.message);
//         await fetchUserSubscriptionData(true);
//         return { success: true, message: result.data.message };
//       } else {
//         toast.error(result.error);
//         return { success: false, error: result.error };
//       }
//     } catch (error) {
//       console.error('❌ Error cancelling subscription:', error);
//       toast.error('Failed to cancel subscription');
//       return { success: false, error: 'Failed to cancel subscription' };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ============= HELPER FUNCTIONS =============

//   // ✅ UPDATED: Plan type helpers (basic, standard, pro)
//   const isBasic = () => subscription?.isBasic || false;
//   const isStandard = () => subscription?.isStandard || false;
//   const isPro = () => subscription?.isPro || false;
//   // const isFree = () => subscription?.isFree !== false;
//   const isFree = () => !subscription || subscription?.plan?.name === 'free';
//   const isPaidPlan = () => subscription?.isPaidPlan || false;

//   // Usage helpers
//   const canMakeApiCall = () => {
//     if (!subscription || !usageStats) return false;
//     return !usageStats.hasExceededCallsLimit && !usageStats.hasExceededTokensLimit;
//   };

//   const getRemainingCalls = () => {
//     if (usageStats?.remaining_calls === 'unlimited') return 'unlimited';
//     return usageStats?.remaining_calls || 0;
//   };

//   const getRemainingTokens = () => {
//     if (usageStats?.remaining_tokens === 'unlimited') return 'unlimited';
//     return usageStats?.remaining_tokens || 0;
//   };

//   const getUsagePercentage = (type = 'calls') => {
//     return type === 'calls' ? usageStats?.callsUsagePercent || 0 : usageStats?.tokensUsagePercent || 0;
//   };

//   const isNearLimit = (type = 'calls', threshold = 80) => {
//     return getUsagePercentage(type) > threshold;
//   };

//   const hasExceededLimit = (type = 'calls') => {
//     return getUsagePercentage(type) >= 100;
//   };

//   const getPlanByName = (planName) => {
//     return plans.find(plan => plan.name === planName);
//   };

//   const getPopularPlan = () => {
//     return plans.find(plan => plan.is_popular);
//   };

//   // ============= CONTEXT VALUE =============

//   const value = {
//     // Data
//     subscription,
//     usageStats,
//     plans,
//     paymentHistory,
//     loading,
//     error,
    
//     // ✅ UPDATED: Plan type helpers
//     isBasic,
//     isStandard,
//     isPro,
//     isFree,
//     isPaidPlan,
    
//     // Usage helpers
//     canMakeApiCall,
//     getRemainingCalls,
//     getRemainingTokens,
//     getUsagePercentage,
//     isNearLimit,
//     hasExceededLimit,
//     getPlanByName,
//     getPopularPlan,
    
//     // ✅ STRIPE-ONLY payment functions (Razorpay removed)
//     processStripePaymentUpgrade,
//     verifyStripePaymentAndRefresh,
//     verifyRazorpayAndRefresh,
    
//     gateway,
//     isIndian,
//     currencySymbol,
//     // Actions
//     refreshSubscriptionData,
//     cancelSubscription: cancelUserSubscription,
    
//     // Debug info
//     debugInfo: {
//       isAuthenticated,
//       userKeycloakId: userProfile?.keycloak_id || user?.keycloak_id,
//       hasSubscription: !!subscription,
//       hasUsageStats: !!usageStats,
//       dataFetched,
//       loading,
//       error,
//       plansCount: plans.length,
//       paymentHistoryCount: paymentHistory.length
//     }
//   };

//   return (
//     <SubscriptionContext.Provider value={value}>
//       {children}
//     </SubscriptionContext.Provider>
//   );
// };

// export default SubscriptionProvider;
