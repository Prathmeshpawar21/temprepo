/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Profiles/shared/SecurityTab.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  Lock, Shield, Smartphone, LogOut,
  CheckCircle2, AlertCircle, Key, Clock,
} from 'lucide-react';

const SecurityTab = ({
  onChangePasswordClick,      // () => void — opens PasswordModal
  onLogoutAllSessions,        // () => void — optional future feature
}) => {

  const securityItems = [
    {
      icon:        <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      title:       'Password Protected',
      description: 'Your account is secured with a password.',
      status:      'active',
    },
    {
      icon:        <Shield className="w-5 h-5 text-emerald-500" />,
      title:       'Keycloak SSO',
      description: 'Managed via secure identity provider.',
      status:      'active',
    },
    {
      icon:        <Smartphone className="w-5 h-5 text-gray-400" />,
      title:       'Two-Factor Authentication',
      description: 'Add an extra layer of security (coming soon).',
      status:      'inactive',
    },
  ];

  return (
    <div className="space-y-6">

      {/* ── Change Password Card ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-md border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-teal-100 rounded-xl">
            <Key className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Password</h3>
            <p className="text-sm text-gray-500">Update your account password</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Current Password</p>
              <p className="text-xs text-gray-400">Last changed: unknown</p>
            </div>
          </div>
          <button
            onClick={onChangePasswordClick}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white text-sm font-semibold rounded-xl hover:from-teal-600 hover:to-blue-600 transition-all shadow-sm hover:shadow-md"
          >
            Change Password
          </button>
        </div>
      </motion.div>

      {/* ── Security Status Card ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-md border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2 bg-emerald-100 rounded-xl">
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Security Status</h3>
            <p className="text-sm text-gray-500">Overview of your account security</p>
          </div>
        </div>

        <div className="space-y-3">
          {securityItems.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-4 rounded-xl border ${
                item.status === 'active'
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <div>
                  <p className={`text-sm font-semibold ${
                    item.status === 'active' ? 'text-emerald-900' : 'text-gray-500'
                  }`}>
                    {item.title}
                  </p>
                  <p className={`text-xs ${
                    item.status === 'active' ? 'text-emerald-700' : 'text-gray-400'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                item.status === 'active'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {item.status === 'active' ? 'Active' : 'Coming Soon'}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Session Management Card ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-md border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2 bg-orange-100 rounded-xl">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Active Session</h3>
            <p className="text-sm text-gray-500">Your current login session</p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Current Session</p>
              <p className="text-xs text-blue-600">Web browser — active now</p>
            </div>
          </div>
          <span className="text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
            Active
          </span>
        </div>

        {/* Security Notice */}
        <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            If you notice any suspicious activity, change your password immediately and contact support.
          </p>
        </div>
      </motion.div>

    </div>
  );
};

export default SecurityTab;
