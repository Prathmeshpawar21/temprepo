/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/Subscription/SubscriptionDebug.jsx
// ✅ This file can be completely removed or only show in development

import React, { useEffect } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import { useSubscription } from '../Authentication/SubscriptionContext';

const SubscriptionDebug = () => {
  const { user, isAuthenticated, userProfile } = useAuth();
  const { subscription, usageStats, loading, error } = useSubscription();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  useEffect(() => {
    console.log('🔍 Subscription Debug:', {
      authenticated: isAuthenticated,
      plan: subscription?.plan?.name,
      loading,
      error
    });
  }, [isAuthenticated, subscription, loading, error]);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-3 rounded-lg text-xs max-w-xs z-50 shadow-2xl">
      <div className="font-bold mb-2">🔍 Debug (Dev Only)</div>
      <div>Auth: {isAuthenticated ? '✅' : '❌'}</div>
      <div>Plan: {subscription?.plan?.name || 'None'}</div>
      <div>Loading: {loading ? '⏳' : '✅'}</div>
    </div>
  );
};

export default SubscriptionDebug;
