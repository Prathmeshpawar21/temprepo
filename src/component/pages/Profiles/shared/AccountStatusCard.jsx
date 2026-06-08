/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Profile/shared/AccountStatusCard.jsx

import React from 'react';
import { Shield } from 'lucide-react';

const AccountStatusCard = ({ profileCompletion, isDoctor, stats }) => {
  return (
    <div className="bg-teal-50 rounded-2xl shadow-md p-6 text-gray-800">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-white/20 rounded-lg mr-3">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Account Status</h3>
          {/* <p className="text-sm opacity-90">Verified & Secure</p> */}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="opacity-90">Profile Completion</span>
          <span className="font-semibold">{profileCompletion}%</span>
        </div>

  <div className="w-full bg-teal-200 rounded-full h-2.5">
    <div
      className={`h-2.5 rounded-full transition-all duration-500 ${
        profileCompletion === 100
          ? 'bg-emerald-500'
          : profileCompletion >= 60
          ? 'bg-teal-500'
          : 'bg-yellow-400'
      }`}
      style={{ width: `${profileCompletion}%` }}
    />
  </div>

  {/* Optional completion label */}
  <p className="text-xs text-teal-600">
    {profileCompletion === 100
      ? 'Profile complete!'
      : `Fill in more details to reach 100%`}
  </p>
  

        {/* <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {isDoctor
                ? stats.totalPatients       ?? 0      
                : stats.upcomingAppointments ?? 0}   
            </div>

            <div className="text-xs opacity-90">{isDoctor ? 'Patients' : 'Upcoming'}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {isDoctor
                ? stats.upcomingAppointments ?? 0     
                : stats.activeMedications    ?? 0}   
            </div>
            <div className="text-xs opacity-90">{isDoctor ? 'Rating' : 'Medications'}</div>
          </div>
        </div> */}



      </div>
    </div>
  );
};

export default AccountStatusCard;
