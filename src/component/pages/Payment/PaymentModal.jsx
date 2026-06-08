/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CreditCard, Shield, Check, Loader2,
  Star, Crown, Building, Heart, Sparkles, IndianRupee
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSubscription } from '../../Authentication/SubscriptionContext';
import { createRazorpayOrder, verifyRazorpayPayment } from '../../../api/razorpayService';

// ── Load Razorpay checkout.js dynamically (only when needed) ──────────────
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src    = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// ─────────────────────────────────────────────────────────────────────────

const PaymentModal = ({ isOpen, onClose, selectedPlan, onSuccess }) => {
  const {
    processStripePaymentUpgrade,
    refreshSubscriptionData,
    gateway,
    isIndian
  } = useSubscription();

  // null | 'razorpay' | 'stripe'
  const [loadingGateway, setLoadingGateway] = useState(null);
  const isLoading = loadingGateway !== null;

  useEffect(() => {
    if (isOpen) setLoadingGateway(null);
  }, [isOpen]);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const getPlanIcon = (name) => {
    switch (name) {
      case 'basic':    return <Star     className="h-6 w-6" />;
      case 'standard': return <Crown    className="h-6 w-6" />;
      case 'pro':      return <Building className="h-6 w-6" />;
      default:         return <Heart    className="h-6 w-6" />;
    }
  };

  const getPlanAccent = (name) => {
    switch (name) {
      case 'basic':    return { bg: 'bg-blue-100',   text: 'text-blue-600'   };
      case 'standard': return { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'pro':      return { bg: 'bg-indigo-100', text: 'text-indigo-600' };
      default:         return { bg: 'bg-gray-100',   text: 'text-gray-600'   };
    }
  };

  // ── Stripe handler (redirect flow) ───────────────────────────────────────

  const handleStripePayment = async () => {
    if (!selectedPlan) return;
    try {
      setLoadingGateway('stripe');
      const result = await processStripePaymentUpgrade(selectedPlan.name, 'monthly');
      if (!result.success) setLoadingGateway(null); // redirect didn't happen
    } catch {
      setLoadingGateway(null);
    }
  };

  // ── Razorpay handler (inline modal flow) ─────────────────────────────────

  const handleRazorpayPayment = async () => {
    if (!selectedPlan) return;

    setLoadingGateway('razorpay');

    // 1. Load SDK
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error('Failed to load Razorpay. Please try Stripe.');
      setLoadingGateway(null);
      return;
    }

    // 2. Create order
    const orderResult = await createRazorpayOrder(selectedPlan.name, 'monthly');
    if (!orderResult.success) {
      toast.error(orderResult.error || 'Failed to create order');
      setLoadingGateway(null);
      return;
    }

    const orderData = orderResult.data;

    // 3. Open Razorpay modal
    const options = {
      key:         orderData.key_id,
      amount:      orderData.amount,   // paise
      currency:    'INR',
      name:        'AI Doctor',
      description: `${selectedPlan.display_name} – Monthly Subscription`,
      order_id:    orderData.order_id,
      prefill:     orderData.prefill  || {},
      theme:       orderData.theme    || { color: '#6366f1' },

      handler: async (response) => {
        try {
          const verifyResult = await verifyRazorpayPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );

          if (verifyResult.success) {
            await refreshSubscriptionData();
            onSuccess(verifyResult.data);
            toast.success('🎉 Payment successful! Plan upgraded.');
          } else {
            toast.error(verifyResult.error || 'Payment verification failed');
          }
        } catch {
          toast.error('Verification error. Contact support if amount was deducted.');
        } finally {
          setLoadingGateway(null);
        }
      },

      modal: {
        ondismiss:     () => setLoadingGateway(null),
        confirm_close: true,
        escape:        false
      }
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', (res) => {
      toast.error(`Payment failed: ${res.error?.description || 'Unknown error'}`);
      setLoadingGateway(null);
    });

    rzp.open();
  };

  // ── Early return ──────────────────────────────────────────────────────────

  if (!isOpen || !selectedPlan) return null;

  const accent   = getPlanAccent(selectedPlan.name);
  const inrPrice = selectedPlan.razorpay_price_inr_monthly;
  const usdPrice = selectedPlan.monthly_price;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={(e) => { if (e.target === e.currentTarget && !isLoading) onClose(); }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1,    opacity: 1, y: 0  }}
          exit={{   scale: 0.95, opacity: 0, y: 10 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >

          {/* ── Header ──────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl ${accent.bg} ${accent.text}`}>
                {getPlanIcon(selectedPlan.name)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedPlan.display_name}</h2>
                <p className="text-sm text-gray-500">{selectedPlan.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* ── Body ────────────────────────────────────────────────────── */}
          <div className="p-6 space-y-5">

            {/* What's Included */}
            {selectedPlan.features?.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
                  <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                  What's Included
                </h3>
                <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedPlan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0  }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-start space-x-2 text-sm text-gray-700"
                    >
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-gray-700">Monthly Subscription</span>
                <div className="text-right">

                                {isIndian ? (
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                  ₹{(inrPrice || 0).toLocaleString('en-IN')}
                                </div>
                                <div className="text-xs text-gray-400 mt-0.5">${usdPrice} USD</div>
                                <span className="text-sm text-gray-500">/ month</span>
                              </div>
                            ) : (
                              <div className="text-right">
                                <span className="text-3xl font-bold text-gray-900">${usdPrice}</span>
                                <span className="text-sm text-gray-500 ml-1">/ month</span>
                              </div>
                            )}

                </div>
              </div>
              {/* <div className="space-y-1 pt-3 border-t border-gray-200">
                {['Cancel anytime', 'Instant activation', 'Full feature access'].map((item) => (
                  <div key={item} className="flex items-center text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div> */}
            </div>

            {/* Security note */}
            {/* <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <span className="font-semibold">
                  {isIndian
                    ? 'Secure Payment — Razorpay & Stripe'
                    : 'Secure Payment by Stripe'}
                </span>
                <p className="text-blue-600 mt-0.5">Bank-level encryption, PCI-DSS compliant.</p>
              </div>
            </div> */}

            {/* ── Payment Buttons ─────────────────────────────────────── */}
            {isIndian ? (
              /* ── Indian users: Razorpay primary + Stripe secondary ── */
              <div className="space-y-3">

                {/* Razorpay — PRIMARY */}
                <motion.button
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{   scale: isLoading ? 1 : 0.98 }}
                  onClick={handleRazorpayPayment}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg transition-all"
                >
                  {loadingGateway === 'razorpay' ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Processing payment...</span>
                    </>
                  ) : (
                                        <>
                      <IndianRupee className="h-5 w-5" />
                      <span>
                        Pay {inrPrice
                          ? `₹${inrPrice.toLocaleString('en-IN')}`
                          : selectedPlan.razorpayMonthlyFormatted || `₹${(usdPrice * 85).toFixed(0)}`
                        }/month with Razorpay
                      </span>
                    </>

                  )}
                </motion.button>

                {/* Divider */}
                <div className="flex items-center space-x-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">or pay in USD</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Stripe — SECONDARY */}
                <motion.button
                  whileHover={{ scale: isLoading ? 1 : 1.01 }}
                  whileTap={{   scale: isLoading ? 1 : 0.99 }}
                  onClick={handleStripePayment}
                  disabled={isLoading}
                  className="w-full border-2 border-gray-300 hover:border-blue-400 bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-700 py-3 px-6 rounded-xl font-medium flex items-center justify-center space-x-2 disabled:opacity-50 transition-all text-sm"
                >
                  {loadingGateway === 'stripe' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Redirecting to Stripe...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      <span>Pay ${usdPrice}/month with Stripe (USD)</span>
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-gray-400 text-center">
                  Razorpay supports UPI · NetBanking · Cards (₹) · Wallets
                </p>
              </div>

            ) : (
              /* ── Non-Indian users: Stripe only ── */
              <>
                <motion.button
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{   scale: isLoading ? 1 : 0.98 }}
                  onClick={handleStripePayment}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg transition-all"
                >
                  {loadingGateway === 'stripe' ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Redirecting to Stripe...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      <span>Pay ${usdPrice}/month with Stripe</span>
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-gray-400 text-center">
                  You will be redirected to Stripe's secure checkout page
                </p>
              </>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;
