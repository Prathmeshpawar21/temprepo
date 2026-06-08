/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Profiles/shared/PasswordModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const PasswordModal = ({
  showPasswordModal,
  setShowPasswordModal,
  passwordForm,
  setPasswordForm,
  changePassword,
  isChangingPassword = false,
  changePasswordError = '',
  changePasswordSuccess = false,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword,      setShowNewPassword]      = React.useState(false);
  const [showConfirmPassword,  setShowConfirmPassword]  = React.useState(false);
  const [validationError,      setValidationError]      = React.useState('');

  const handleClose = () => {
    setShowPasswordModal(false);
    setValidationError('');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    // ── Client-side validation ──────────────────────────────────────────
    if (!passwordForm.currentPassword) {
      setValidationError('Current password is required.');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setValidationError('New password must be at least 8 characters.');
      return;
    }
    if (passwordForm.newPassword === passwordForm.currentPassword) {
      setValidationError('New password must be different from current password.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    changePassword();
  };

  const strengthConfig = (() => {
    const len = passwordForm.newPassword.length;
    if (!len)   return null;
    if (len < 8)  return { label: 'Weak',   color: 'bg-red-500',    width: 'w-1/3' };
    if (len < 12) return { label: 'Medium', color: 'bg-yellow-500', width: 'w-2/3' };
    return             { label: 'Strong',  color: 'bg-green-500',  width: 'w-full' };
  })();

  const displayError = validationError || changePasswordError;

  return (
    <AnimatePresence>
      {showPasswordModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Lock className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
              </div>
              <button
                onClick={handleClose}
                disabled={isChangingPassword}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ── SUCCESS STATE ────────────────────────────────────────────── */}
            {changePasswordSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Password Changed!</h4>
                <p className="text-sm text-gray-500 mb-6">
                  Your password has been updated successfully.
                </p>
                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 transition-all shadow-md"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              // ── FORM STATE ──────────────────────────────────────────────────
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Error Banner */}
                <AnimatePresence>
                  {displayError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl"
                    >
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{displayError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Current Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => {
                        setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }));
                        setValidationError('');
                      }}
                      disabled={isChangingPassword}
                      placeholder="Enter current password"
                      className="w-full p-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:opacity-60 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => {
                        setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }));
                        setValidationError('');
                      }}
                      disabled={isChangingPassword}
                      placeholder="Enter new password"
                      className="w-full p-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:opacity-60 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Strength Indicator */}
                  {strengthConfig && (
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-300 ${strengthConfig.color} ${strengthConfig.width}`} />
                      </div>
                      <span className="text-xs text-gray-500 w-12">{strengthConfig.label}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => {
                        setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }));
                        setValidationError('');
                      }}
                      disabled={isChangingPassword}
                      placeholder="Confirm new password"
                      className={`w-full p-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:opacity-60 transition-all ${
                        passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword
                          ? 'border-red-300'
                          : 'border-gray-200'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {/* Live match indicator */}
                  {passwordForm.confirmPassword && (
                    <p className={`text-xs mt-1 ${
                      passwordForm.newPassword === passwordForm.confirmPassword
                        ? 'text-emerald-600'
                        : 'text-red-500'
                    }`}>
                      {passwordForm.newPassword === passwordForm.confirmPassword
                        ? '✓ Passwords match'
                        : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isChangingPassword}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl hover:from-teal-600 hover:to-blue-600 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PasswordModal;
