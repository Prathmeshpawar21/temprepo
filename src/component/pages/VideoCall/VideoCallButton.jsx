/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/VideoCall/VideoCallButton.jsx

import React from 'react';
import { Video, Loader2, Lock, Clock } from 'lucide-react';

const VideoCallButton = ({ 
  canJoin, 
  isLoading, 
  onClick, 
  message,
  timeUntilStart = null, // ✅ Time in minutes until appointment
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // ✅ FIX: Don't show button if more than 10 minutes away
  if (timeUntilStart !== null && timeUntilStart > 10) {
    return null; // Hide button completely
  }

  // ✅ FIX: Don't show if way past scheduled time (> 120 min)
  if (timeUntilStart !== null && timeUntilStart < -120) {
    return null; // Hide button completely
  }

  const variantClasses = {
    primary: canJoin 
      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl'
      : 'bg-gray-200 text-gray-500 cursor-not-allowed',
    secondary: canJoin
      ? 'bg-white text-teal-600 border-2 border-teal-500 hover:bg-teal-50'
      : 'bg-gray-100 text-gray-400 border-2 border-gray-300 cursor-not-allowed'
  };

  return (
    <button
      onClick={canJoin && !isLoading ? onClick : undefined}
      disabled={!canJoin || isLoading}
      className={`
        flex items-center justify-center space-x-2 rounded-lg font-semibold
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      title={message || (canJoin ? 'Join video call' : 'Call not available yet')}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : canJoin ? (
        <>
          <Video className="h-4 w-4" />
          <span>Join Video Call</span>
        </>
      ) : (
        <>
          <Lock className="h-4 w-4" />
          <span>Not Available</span>
        </>
      )}
    </button>
  );
};

export default VideoCallButton;
