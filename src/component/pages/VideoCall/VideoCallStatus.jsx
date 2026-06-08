/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/VideoCall/VideoCallStatus.jsx

import React from 'react';
import { Video, Clock, CheckCircle, XCircle } from 'lucide-react';


const VideoCallStatus = ({ videoSession, canJoinInfo, className = '' }) => {
  if (!videoSession) {
    return null;
  }

  const getStatusConfig = () => {
    // Active call
    if (videoSession.status === 'active') {
      return {
        icon: Video,
        text: 'Call in Progress',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-300',
        iconColor: 'text-green-500',
        pulse: true
      };
    }

    // Ended call
    if (videoSession.status === 'ended') {
      return {
        icon: CheckCircle,
        text: 'Call Ended',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-300',
        iconColor: 'text-blue-500',
        pulse: false
      };
    }

    // ✅ Check if can join - USE BACKEND CALCULATED TIME
    if (canJoinInfo?.can_join) {
      const minutes = canJoinInfo.time_until_start_minutes;
      
      // ✅ Past or current time - show "Join Now!"
      if (minutes <= 0) {
        return {
          icon: Video,
          text: 'Join Now!',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-300',
          iconColor: 'text-green-500',
          pulse: true
        };
      }
      
      // ✅ Within join window (1-15 min)
      if (minutes > 0 && minutes <= 15) {
        return {
          icon: Clock,
          text: `In ${minutes}min`,
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-300',
          iconColor: 'text-yellow-500',
          pulse: true
        };
      }
    }

    // ✅ Scheduled but not yet joinable
    if (videoSession.status === 'scheduled' && canJoinInfo) {
      const minutes = canJoinInfo.time_until_start_minutes;
      
      // Don't show if in the past
      if (minutes < -120) {
        return null;
      }
      
      // Show countdown
      if (minutes > 15) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        return {
          icon: Clock,
          text: hours > 0 ? `In ${hours}h ${mins}m` : `In ${mins}m`,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-300',
          iconColor: 'text-gray-500',
          pulse: false
        };
      }
    }

    return null;
  };

  const config = getStatusConfig();
  
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}>
      <div className="relative">
        <Icon className={`h-3.5 w-3.5 ${config.iconColor}`} />
        {config.pulse && (
          <span className="absolute inset-0 h-3.5 w-3.5 rounded-full animate-ping opacity-75">
            <Icon className={config.iconColor} />
          </span>
        )}
      </div>
      <span className="font-semibold">{config.text}</span>
    </div>
  );
};

export default VideoCallStatus;
