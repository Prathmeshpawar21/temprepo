/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Profile/shared/SettingsTab.jsx

import React from 'react';
import { Bell, Shield } from 'lucide-react';
import { notificationDescriptions, privacyDescriptions, formatLabel } from './profileUtils';

const SettingsTab = ({
  notificationSettings,
  setNotificationSettings,
  privacySettings,
  setPrivacySettings
}) => {
  const handleNotificationToggle = (key) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyToggle = (key) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      {/* Notification Settings */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <div className="flex items-center mb-8">
          <Bell className="h-6 w-6 text-teal-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
        </div>

        <div className="space-y-6">
          {Object.entries(notificationSettings).map(([key, enabled]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 capitalize">
                  {formatLabel(key)}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {notificationDescriptions[key] || 'Manage this notification setting'}
                </p>
              </div>

              <button
                onClick={() => handleNotificationToggle(key)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                  enabled ? 'bg-teal-600' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={enabled}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

            </div>
          ))}
        </div>

        {/* Notification Channels */}
        {/* <div className="mt-8 p-4 bg-teal-50 border border-teal-200 rounded-xl">
          <h4 className="text-sm font-bold text-teal-900 mb-2">Notification Channels</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white rounded-lg">
              <div
                className={`text-lg font-bold ${
                  notificationSettings.email ? 'text-teal-600' : 'text-gray-400'
                }`}
              >
                📧
              </div>
              <p className="text-xs text-gray-600 mt-1">Email</p>
              <p
                className={`text-xs font-semibold mt-1 ${
                  notificationSettings.email ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {notificationSettings.email ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div
                className={`text-lg font-bold ${
                  notificationSettings.sms ? 'text-teal-600' : 'text-gray-400'
                }`}
              >
                💬
              </div>
              <p className="text-xs text-gray-600 mt-1">SMS</p>
              <p
                className={`text-xs font-semibold mt-1 ${
                  notificationSettings.sms ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {notificationSettings.sms ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div
                className={`text-lg font-bold ${
                  notificationSettings.push ? 'text-teal-600' : 'text-gray-400'
                }`}
              >
                🔔
              </div>
              <p className="text-xs text-gray-600 mt-1">Push</p>
              <p
                className={`text-xs font-semibold mt-1 ${
                  notificationSettings.push ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {notificationSettings.push ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div> */}

      </div>

      {/* Privacy Settings */}
      {/* <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8"> */}
        {/* <div className="flex items-center mb-8">
          <Shield className="h-6 w-6 text-teal-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Privacy Settings</h2>
        </div> */}

        {/* <div className="space-y-6">
          {Object.entries(privacySettings).map(([key, enabled]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 capitalize">
                  {formatLabel(key)}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {privacyDescriptions[key] || 'Manage this privacy setting'}
                </p>
              </div>
              <button
                onClick={() => handlePrivacyToggle(key)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                  enabled ? 'bg-teal-600' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={enabled}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div> */}

        {/* Privacy Summary */}
        {/* <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <h4 className="text-sm font-bold text-purple-900 mb-2">Privacy Summary</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2 bg-white rounded">
              <span className="text-gray-600">Profile Visibility:</span>
              <span
                className={`ml-2 font-semibold ${
                  privacySettings.profileVisible ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {privacySettings.profileVisible ? 'Public' : 'Private'}
              </span>
            </div>
            <div className="p-2 bg-white rounded">
              <span className="text-gray-600">Data Sharing:</span>
              <span
                className={`ml-2 font-semibold ${
                  privacySettings.shareData ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {privacySettings.shareData ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="p-2 bg-white rounded">
              <span className="text-gray-600">Messages:</span>
              <span
                className={`ml-2 font-semibold ${
                  privacySettings.allowMessages ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {privacySettings.allowMessages ? 'Open' : 'Closed'}
              </span>
            </div>
            <div className="p-2 bg-white rounded">
              <span className="text-gray-600">Analytics:</span>
              <span
                className={`ml-2 font-semibold ${
                  privacySettings.analyticsConsent ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {privacySettings.analyticsConsent ? 'Allowed' : 'Blocked'}
              </span>
            </div>
          </div>
        </div> */}

      {/* </div> */}

      {/* Important Information */}
      {/* <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">About Your Settings</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>Notification Settings:</strong> Control how and when you receive updates about
            appointments, medications, test results, and messages.
          </p>
          <p>
            <strong>Privacy Settings:</strong> Manage who can see your profile and how your data is
            used. Your medical records are always secure and only accessible to authorized
            healthcare providers.
          </p>
          <p className="text-xs text-blue-700 mt-3">
            💡 Tip: Enable appointment and medication notifications to never miss important health
            reminders.
          </p>
        </div>
      </div> */}


      
    </div>
  );
};

export default SettingsTab;
