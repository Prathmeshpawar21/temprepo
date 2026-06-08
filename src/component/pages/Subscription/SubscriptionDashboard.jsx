/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSubscription } from '../../Authentication/SubscriptionContext';
import {
  Crown, Building, Star, CheckCircle, RefreshCw,
  Calendar, Shield, Heart, Activity, Sparkles,
  Clock, CreditCard
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import PaymentModal from '../Payment/PaymentModal';

const SubscriptionDashboard = () => {
  const {
    subscription, usageStats, plans, paymentHistory,
    loading, error, isPaidPlan, refreshSubscriptionData
  } = useSubscription();

  const [refreshing, setRefreshing] = useState(false);
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, plan: null });

  const { cancelSubscription, ...rest } = useSubscription();
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  // Plan icon helper
  const getPlanIcon = (planName, size = 'h-6 w-6', variant = 'colored') => {
    const colorClass = variant === 'colored'
      ? (planName === 'pro' ? 'text-indigo-600'
        : planName === 'standard' ? 'text-purple-600'
        : planName === 'basic' ? 'text-blue-600'
        : 'text-green-600')
      : 'text-white';
    switch (planName) {
      case 'pro':      return <Building className={`${size} ${colorClass}`} />;
      case 'standard': return <Crown    className={`${size} ${colorClass}`} />;
      case 'basic':    return <Star     className={`${size} ${colorClass}`} />;
      default:         return <Heart    className={`${size} ${colorClass}`} />;
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshSubscriptionData();
      toast.success('Dashboard refreshed!');
    } catch {
      toast.error('Failed to refresh');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCancelSubscription = async () => {
  setCancelling(true);
  try {
    const result = await cancelSubscription();
    if (result.success) {
      setCancelModal(false);
      toast.success('Subscription cancelled. You are now on the Free plan.');
      refreshSubscriptionData();
    } else {
      toast.error(result.error || 'Failed to cancel');
    }
  } catch {
    toast.error('Failed to cancel subscription');
  } finally {
    setCancelling(false);
  }
};

  const handleUpgradeClick = (plan) => {
    setPaymentModal({ isOpen: true, plan });
  };

  const handlePaymentSuccess = () => {
    setPaymentModal({ isOpen: false, plan: null });
    toast.success('🎉 Plan upgraded successfully!');
    // refreshSubscriptionData();
  };

  // Filter out free plan from "All Plans" section
  const paidPlans = plans.filter(plan => plan.name !== 'free');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Dashboard</h3>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800">Unable to Load Dashboard</h3>
            <p className="text-red-700 mt-2">{error}</p>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="mt-4 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {refreshing ? 'Refreshing...' : 'Try Again'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Subscription</h1>
                <p className="text-gray-600 mt-1">Manage your AI-Doctor plan</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Current Plan Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden bg-gradient-to-br ${
            subscription?.gradientClass || 'from-green-500 to-emerald-600'
          } rounded-2xl p-8 text-white shadow-2xl`}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4">
              <Sparkles className="h-32 w-32" />
            </div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              {/* <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                {getPlanIcon(subscription?.plan?.name, 'h-12 w-12', 'white')}
              </div> */}
              <div>
                <h2 className="text-4xl font-bold mb-2">
                  {subscription?.plan?.display_name || 'Free Plan'}
                </h2>
                {/* <p className="text-white/90 text-lg mb-3">
                  {isPaidPlan()
                    ? '🎉 You have full access to use features'
                    : '🚀 Basic health consultation features'}
                </p> */}
                <div className="flex items-center space-x-4 text-white/80 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Active</span>
                  </div>
                  {subscription?.startDateFormatted && (
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>Member since {subscription.startDateFormatted}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-5xl font-bold mb-1">
                {subscription?.priceFormatted || 'FREE'}
              </div>
              <div className="text-white/90 text-lg">per month</div>
            </div>
          </div>
        </motion.div>



{/* ── Cancel Subscription (only for paid plans) ── */}
{isPaidPlan() && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl p-6 shadow-lg border border-red-100"
  >
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Cancel Subscription</h3>
        <p className="text-sm text-gray-500 mt-1">
          You'll be moved to the Free plan immediately. No refunds are issued.
        </p>
      </div>
      <button
        onClick={() => setCancelModal(true)}
        className="flex-shrink-0 px-5 py-2.5 border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-xl font-medium text-sm transition-colors"
      >
        Cancel Plan
      </button>
    </div>
  </motion.div>
)}

{/* ── Cancel Confirmation Modal ── */}
{cancelModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Subscription?</h3>
      <p className="text-gray-600 mb-2">
        You are on the <strong>{subscription?.plan?.display_name}</strong> plan.
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
        ⚠️ You will be downgraded to the <strong>Free Plan immediately</strong>.
        No refund will be issued.
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => setCancelModal(false)}
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
        >
          Keep Plan
        </button>
        <button
          onClick={handleCancelSubscription}
          disabled={cancelling}
          className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {cancelling
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Cancelling...</>
            : 'Yes, Cancel'
          }
        </button>
      </div>
    </motion.div>
  </div>
)}



        {/* ── Current Plan Features ── */}
        {subscription?.plan?.features?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <Shield className="h-7 w-7 mr-3 text-blue-600" />
              Your Plan Features
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscription.plan.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl"
                >
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── All Plans — clicking upgrade opens PaymentModal directly ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <div className="mb-8">
            <h3 className="text-2xl font-semibold">All Plans</h3>
  
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {paidPlans.map((plan, planIndex) => {
              const isCurrentPlan = plan.id === subscription?.plan?.id;
              const isPopular = plan.is_popular;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + planIndex * 0.1 }}
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    isCurrentPlan
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : isPopular
                      ? 'border-purple-400 shadow-md hover:shadow-xl'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                  }`}
                >
                  {/* Popular badge */}
                  {isPopular && !isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${
                      plan.name === 'pro'      ? 'bg-gradient-to-r from-indigo-100 to-purple-100' :
                      plan.name === 'standard' ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      {getPlanIcon(plan.name, 'h-6 w-6')}
                    </div>
                    {isCurrentPlan && (
                      <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                        Your Plan
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-xl mb-4">{plan.display_name}</h4>
                  {/* <p className=" mb-4"> </p> */}
                  {/* <p className="text-sm text-gray-500 mb-4">{plan.description}</p> */}

                  {/* Price */}
                  <div className="mb-5">
                    <span className="text-4xl font-semibold text-gray-900">
                      {plan.monthlyFormatted}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">/ month</span>
                  </div>

                  {/* Features preview */}
                  <ul className="mb-6 space-y-2">
                    {plan.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="text-xs text-gray-400 pl-6">
                        +{plan.features.length - 4} more features
                      </li>
                    )}
                  </ul>

                  {/* CTA */}
                  {isCurrentPlan ? (
                    <div className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 py-3 rounded-xl text-center font-semibold text-sm">
                      Current Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpgradeClick(plan)}
                      className={`w-full py-3 rounded-xl font-semibold text-white text-sm flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg ${
                        plan.name === 'pro'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                          : plan.name === 'standard'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                      }`}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Upgrade to {plan.display_name}</span>
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Payment History ── */}
        {paymentHistory?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <Calendar className="h-7 w-7 mr-3 text-green-600" />
              Payment History
            </h3>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Plan</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paymentHistory.slice(0, 5).map((payment, index) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium">{payment.dateFormatted}</div>
                        <div className="text-gray-400 flex items-center text-xs mt-0.5">
                          <Clock className="h-3 w-3 mr-1" />
                          {payment.timeFormatted}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {payment.planDisplay}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {payment.amountFormatted}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          payment.statusBadgeColor === 'green' ? 'bg-green-100 text-green-800' :
                          payment.statusBadgeColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            payment.statusBadgeColor === 'green' ? 'bg-green-500' :
                            payment.statusBadgeColor === 'yellow' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} />
                          {payment.statusDisplay}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {paymentHistory.length > 5 && (
              <p className="mt-4 text-center text-sm text-gray-400">
                Showing 5 of {paymentHistory.length} transactions
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* ── Payment Modal (Bug 15 fix: only Stripe, no dual options) ── */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, plan: null })}
        selectedPlan={paymentModal.plan}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default SubscriptionDashboard;
