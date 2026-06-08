/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/Payment/UpgradeToPro.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  Check, 
  ArrowLeft, 
  Crown, 
  Building,
  Shield,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Clock,
  Users,
  Award,
  Sparkles,
  Heart
} from 'lucide-react';
import { useSubscription } from '../../Authentication/SubscriptionContext';
import { useAuth } from '../../Authentication/AuthContext';
import PaymentModal from '../Payment/PaymentModal';
import { toast } from 'react-hot-toast';

const UpgradeToPro = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    plans, 
    subscription, 
    loading, 
    isFree
  } = useSubscription();
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, plan: null });
  const [expandedFeatures, setExpandedFeatures] = useState({});

  // ✅ Filter to show only paid plans (Basic, Standard, Pro) - exclude Free and current planSubscriptionContext
  const availablePlans = plans.filter(plan => 
    plan.name !== 'free' && plan.name !== subscription?.plan?.name
  );

  const hasAvailablePlans = availablePlans.length > 0;

  // Plan icons
  const getPlanIcon = (planName, size = 'h-6 w-6') => {
    switch (planName) {
      case 'basic': return <Star className={`${size} text-blue-600`} />;
      case 'standard': return <Crown className={`${size} text-purple-600`} />;
      case 'pro': return <Building className={`${size} text-indigo-600`} />;
      default: return <Heart className={`${size} text-gray-600`} />;
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setPaymentModal({ isOpen: true, plan });
  };

  const handlePaymentSuccess = () => {
    toast.success('🎉 Welcome to your new plan!');
    navigate('/subscription');
  };

  const toggleFeatures = (planId) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (!hasAvailablePlans) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-xl p-8 shadow-lg max-w-md w-full">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You're on the Top Plan! 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            You're already enjoying {subscription?.plan?.display_name} with full access to all features.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/subscription')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View Dashboard
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/subscription')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {isFree() ? 'Upgrade Your Plan' : 'Change Your Plan'}
                </h1>
                <p className="text-sm text-gray-600">
                  Choose the plan that fits your healthcare needs
                </p>
              </div>
            </div>
            {user && (
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                <p className="text-sm text-gray-500">Current: {subscription?.plan?.display_name || 'Free Plan'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {isFree() 
              ? 'Unlock Premium Healthcare Features' 
              : 'Switch to a Better Plan'}
          </h2>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            {isFree()
              ? 'Get unlimited access to AI health consultations, personalized insights, and expert support.'
              : 'Upgrade to access more features or find a plan that better fits your needs.'}
          </p>
          
          {/* ✅ REMOVED: Billing Toggle - Monthly only */}
          <p className="text-sm text-gray-500 mt-4">
            💳 Simple monthly billing • Cancel anytime
          </p>
        </div>

        {/* ✅ Plans Grid - Show ALL 3 Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {availablePlans.map((plan) => {
            const isPopular = plan.is_popular;
            const price = plan.monthly_price; // ✅ Monthly only

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: availablePlans.indexOf(plan) * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-2xl ${
                  isPopular 
                    ? 'border-purple-500 scale-105 z-10' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="flex flex-col items-center mb-6">
                    <div className={`p-4 rounded-2xl mb-4 ${
                      plan.name === 'pro' ? 'bg-gradient-to-r from-indigo-100 to-purple-100' :
                      plan.name === 'standard' ? 'bg-purple-100' :
                      'bg-blue-100'
                    }`}>
                      {getPlanIcon(plan.name, 'h-8 w-8')}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 text-center">{plan.display_name}</h3>
                    <p className="text-gray-600 text-center mt-2">{plan.description}</p>
                  </div>

                  {/* Pricing - Monthly Only */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center space-x-2 mb-2">
                      <span className="text-5xl font-bold text-gray-900">${price}</span>
                      <span className="text-gray-500 text-lg">/month</span>
                    </div>
                    <p className="text-sm text-gray-500">Billed monthly</p>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <ul className="space-y-3">
                      {plan.features.slice(0, 6).map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                      
                      {plan.features.length > 6 && (
                        <>
                          <AnimatePresence>
                            {expandedFeatures[plan.id] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-3 overflow-hidden"
                              >
                                {plan.features.slice(6).map((feature, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">{feature}</span>
                                  </li>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          <button
                            onClick={() => toggleFeatures(plan.id)}
                            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                          >
                            <span>
                              {expandedFeatures[plan.id] ? 'Show less' : `+${plan.features.length - 6} more features`}
                            </span>
                            {expandedFeatures[plan.id] ? 
                              <ChevronUp className="h-4 w-4 ml-1" /> : 
                              <ChevronDown className="h-4 w-4 ml-1" />
                            }
                          </button>
                        </>
                      )}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all shadow-lg ${
                      isPopular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                        : plan.name === 'pro'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <CreditCard className="h-5 w-5" />
                      <span>Choose {plan.display_name}</span>
                    </div>
                  </button>

                  {/* Trust Signal */}
                  <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                    <Shield className="h-4 w-4 mr-1" />
                    <span>Secure payment • Cancel anytime</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why Upgrade?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Unlimited Consultations</h4>
              <p className="text-gray-600 text-sm">Chat with AI health assistant anytime, as many times as you need.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">24/7 Support</h4>
              <p className="text-gray-600 text-sm">Get priority support from healthcare specialists whenever you need it.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Personalized Insights</h4>
              <p className="text-gray-600 text-sm">Receive detailed health reports and personalized recommendations.</p>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span>50,000+ Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-purple-500" />
              <span>ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, plan: null })}
        selectedPlan={paymentModal.plan}
        onSuccess={handlePaymentSuccess}
        initialBillingCycle="monthly" // ✅ Always monthly
      />
    </div>
  );
};

export default UpgradeToPro;
