/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/VideoCall/VideoCallTimer.jsx

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const VideoCallTimer = ({ scheduledTime, onTimeUp }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const scheduled = new Date(scheduledTime);
      const diffMs = scheduled - now;
      const diffMinutes = Math.floor(diffMs / 1000 / 60);

      if (diffMinutes <= 0) {
        onTimeUp && onTimeUp();
        return null;
      }

      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;

      return { hours, minutes, total: diffMinutes };
    };

    setTimeRemaining(calculateTimeRemaining());

    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [scheduledTime, onTimeUp]);

  if (!timeRemaining) return null;

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <Clock className="h-4 w-4" />
      <span>
        {timeRemaining.hours > 0 
          ? `${timeRemaining.hours}h ${timeRemaining.minutes}m until appointment`
          : `${timeRemaining.minutes} minutes until appointment`
        }
      </span>
    </div>
  );
};

export default VideoCallTimer;
