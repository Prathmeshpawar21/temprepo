/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

import { useState, useCallback } from 'react';
import { useSubscription } from '../component/Authentication/SubscriptionContext';

export const useUsageLimit = () => {
  const [usageLimitModal, setUsageLimitModal] = useState({
    isOpen: false,
    usageInfo: null,
    upgradeOptions: null,
    onRetry: null
  });

  const { refreshSubscriptionData } = useSubscription();

  const handleUsageLimitError = useCallback((error) => {
    // Check if this is a usage limit error (429 status)
    if (error.response?.status === 429) {
      const errorData = error.response.data;
      
      setUsageLimitModal({
        isOpen: true,
        usageInfo: errorData.usage_info,
        upgradeOptions: errorData.upgrade_options,
        onRetry: null // Will be set by the calling component
      });
      
      return true; // Handled
    }
    
    return false; // Not handled
  }, []);

  const closeUsageLimitModal = useCallback(() => {
    setUsageLimitModal(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  const setRetryFunction = useCallback((retryFn) => {
    setUsageLimitModal(prev => ({
      ...prev,
      onRetry: retryFn
    }));
  }, []);

  const checkUsageLimits = useCallback(async () => {
    try {
      // Refresh subscription data to get latest usage
      await refreshSubscriptionData();
      return true;
    } catch (error) {
      console.error('Error checking usage limits:', error);
      return false;
    }
  }, [refreshSubscriptionData]);

  return {
    usageLimitModal,
    handleUsageLimitError,
    closeUsageLimitModal,
    setRetryFunction,
    checkUsageLimits
  };
};

export default useUsageLimit;
