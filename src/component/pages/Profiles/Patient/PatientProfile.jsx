/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

import React, { useRef, useState } from 'react';
import { useAuth } from '../../../Authentication/AuthContext';
import { motion } from 'framer-motion';
import { User, Settings, Heart, AlertCircle } from 'lucide-react';

import ProfileHeader         from '../shared/ProfileHeader';
import StatsCards            from '../shared/StatsCards';
import PersonalInfoTab       from '../shared/PersonalInfoTab';
import SettingsTab           from '../shared/SettingsTab';
import AccountStatusCard     from '../shared/AccountStatusCard';
import ConnectedServicesCard from '../shared/ConnectedServicesCard';
import PasswordModal         from '../shared/PasswordModal';
import SuccessErrorToast     from '../shared/SuccessErrorToast';
import MedicalInfoTab        from './MedicalInfoTab';
import EmergencyContactTab   from './EmergencyContactTab';
import SecurityTab from '../shared/SecurityTab';
import usePatientProfile from '../../../../hooks/useUserProfile';
import userAPI from '../../../../api/users/user';

import {
  getTabsForRole,
  getPatientStatsConfig,
  calculateProfileCompletion,
  handleInputChange as utilHandleInputChange,
  handleArrayChange as utilHandleArrayChange,
  addArrayItem      as utilAddArrayItem,
  removeArrayItem   as utilRemoveArrayItem,
} from '../shared/profileUtils';

const PatientProfile = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [activeTab,         setActiveTab]         = useState('personal');
  const [isEditing,         setIsEditing]         = useState(false);
  const [isDarkMode,        setIsDarkMode]        = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState({
    appointments: true, medications: true,
    reminders: true, email: true,
  });
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true, showHistory: true, allowMessages: true,
    shareData: false, analyticsConsent: true, marketingConsent: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });


  const [isChangingPassword,    setIsChangingPassword]    = useState(false);
  const [changePasswordError,   setChangePasswordError]   = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);

  // ── Hook — all 3 avatar-related values destructured ──────────────────────
  const {
    formData,       setFormData,
    stats,
    loading,        saving,
    uploadingImage,   // ← spinner for camera button
    avatarUrl,   // ← immediate display after upload
    error,          setError,
    success,
    fetchProfile,
    savePersonal,   saveMedical,   saveEmergency,
    uploadAvatar,
  } = usePatientProfile();

  // ── Merge localAvatarUrl into user for ProfileHeader ─────────────────────
  const userWithAvatar = avatarUrl
    ? { ...user, avatar: avatarUrl }
    : user;

  const tabs              = getTabsForRole(false);
  const statsConfig       = getPatientStatsConfig(stats);
  const profileCompletion = calculateProfileCompletion(formData, false);

  const handleSave = async () => {
    const saveMap = {
      personal:  savePersonal,
      medical:   saveMedical,
      emergency: saveEmergency,
    };
    const fn = saveMap[activeTab];
    if (fn) {
      await fn();
      setIsEditing(false);
    }
  };

  const handleInputChange = (e)       => utilHandleInputChange(e, setFormData);
  const handleArrayChange = (f, i, v) => utilHandleArrayChange(f, i, v, setFormData);
  const addArrayItem      = (f, def)  => utilAddArrayItem(f, def, setFormData);
  const removeArrayItem   = (f, i)    => utilRemoveArrayItem(f, i, setFormData);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) uploadAvatar(file);
    e.target.value = ''; // reset so same file can be re-picked
  };

  const toggle2FA      = () => {};

const changePassword = async () => {
  setIsChangingPassword(true);
  setChangePasswordError('');
  setChangePasswordSuccess(false);

  const portal = localStorage.getItem('portal') || 'patient';

  try {
    await userAPI.changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword,
      portal
    );

    setChangePasswordSuccess(true);
    // Reset form — modal shows success state, user clicks Done to close
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });

  } catch (err) {
    const message =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      'Failed to change password. Please try again.';
    setChangePasswordError(message);
  } finally {
    setIsChangingPassword(false);
  }
};

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">

        <ProfileHeader
          user={userWithAvatar}
          fileInputRef={fileInputRef}
          uploadingImage={uploadingImage}
          handleImageUpload={handleImageUpload}
          loading={loading}
          fetchUserProfile={fetchProfile}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          isDoctor={false}
          stats={stats}
        />

        <StatsCards stats={statsConfig} />

        <div className="flex space-x-1 bg-white p-1 rounded-2xl border border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setIsEditing(false); }}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.id === 'personal'  && <User        className="w-5 h-5" />}
              {tab.id === 'medical'   && <Heart       className="w-5 h-5" />}
              {tab.id === 'emergency' && <AlertCircle className="w-5 h-5" />}
              {tab.id === 'settings'  && <Settings    className="w-5 h-5" />}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'personal'  && (
              <PersonalInfoTab
                formData={formData}
                handleInputChange={handleInputChange}
                isEditing={isEditing}
                handleSave={handleSave}
                loading={saving}
              />
            )}
            {activeTab === 'medical'   && (
              <MedicalInfoTab
                formData={formData}
                handleInputChange={handleInputChange}
                handleArrayChange={handleArrayChange}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
                isEditing={isEditing}
                handleSave={handleSave}
                loading={saving}
              />
            )}
            {activeTab === 'emergency' && (
              <EmergencyContactTab
                formData={formData}
                handleInputChange={handleInputChange}
                isEditing={isEditing}
                handleSave={handleSave}
                loading={saving}
              />
            )}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <SettingsTab
                  notificationSettings={notificationSettings}
                  setNotificationSettings={setNotificationSettings}
                  privacySettings={privacySettings}
                  setPrivacySettings={setPrivacySettings}
                />
                <SecurityTab
                  onChangePasswordClick={() => {
                    setChangePasswordError('');
                    setChangePasswordSuccess(false);
                    setShowPasswordModal(true);
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-8">
            <AccountStatusCard
              profileCompletion={profileCompletion}
              isDoctor={false}
              stats={stats}
            />
            <ConnectedServicesCard />
          </div>
        </motion.div>
      </div>

      <PasswordModal
        showPasswordModal={showPasswordModal}
        setShowPasswordModal={(val) => {
          setShowPasswordModal(val);
          // Reset states when closing modal
          if (!val) {
            setChangePasswordError('');
            setChangePasswordSuccess(false);
          }
        }}
        passwordForm={passwordForm}
        setPasswordForm={setPasswordForm}
        changePassword={changePassword}
        isChangingPassword={isChangingPassword}
        changePasswordError={changePasswordError}
        changePasswordSuccess={changePasswordSuccess}
      />


      <SuccessErrorToast success={success} error={error} setError={setError} />
    </div>
  );
};

export default PatientProfile;
