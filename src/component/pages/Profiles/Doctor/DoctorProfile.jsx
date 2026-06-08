/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Profile/Doctor/DoctorProfile.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Authentication/AuthContext';
import { motion } from 'framer-motion';
import api from '../../../../api/api';
import { User, Settings, Shield, Stethoscope, Calendar } from 'lucide-react';

// Shared components
import ProfileHeader from '../shared/ProfileHeader';
import StatsCards from '../shared/StatsCards';
import PersonalInfoTab from '../shared/PersonalInfoTab';
import SettingsTab from '../shared/SettingsTab';
import SecurityTab from '../shared/SecurityTab';
import userAPI from '../../../../api/users/user';
import AccountStatusCard from '../shared/AccountStatusCard';
import ConnectedServicesCard from '../shared/ConnectedServicesCard';
import PasswordModal from '../shared/PasswordModal';
import SuccessErrorToast from '../shared/SuccessErrorToast';

// Doctor-specific components
import ProfessionalInfoTab from './ProfessionalInfoTab';
import ScheduleTab from './ScheduleTab';

// Utils
import {
  getTabsForRole,
  getDoctorStatsConfig,
  calculateProfileCompletion,
  defaultWorkingHours,
  handleInputChange as utilHandleInputChange,
  handleArrayChange as utilHandleArrayChange,
  addArrayItem as utilAddArrayItem,
  removeArrayItem as utilRemoveArrayItem
} from '../shared/profileUtils';

const DoctorProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ADD these 3 alongside other states:
  const [isChangingPassword,    setIsChangingPassword]    = useState(false);
  const [changePasswordError,   setChangePasswordError]   = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);



  // Form data state
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.date_of_birth || '',
    gender: user?.gender || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zip_code || '',
    country: user?.country || 'United States',

    // Professional Information
    specialty: user?.specialty || '',
    subSpecialty: user?.sub_specialty || '',
    licenseNumber: user?.license_number || '',
    licenseState: user?.license_state || '',
    hospitalAffiliation: user?.hospital_affiliation || '',
    yearsOfExperience: user?.years_of_experience || 0,
    consultationFee: user?.consultation_fee || 0,
    bio: user?.bio || '',
    education: user?.education || [],
    certifications: user?.certifications || [],
    languages: user?.languages || [],
    workingHours: user?.working_hours || defaultWorkingHours
  });

  // Settings states
  const [notificationSettings, setNotificationSettings] = useState({
    appointments: user?.notification_settings?.appointments ?? true,
    medications: user?.notification_settings?.medications ?? true,
    results: user?.notification_settings?.results ?? true,
    messages: user?.notification_settings?.messages ?? true,
    reminders: user?.notification_settings?.reminders ?? true,
    promotions: user?.notification_settings?.promotions ?? false,
    email: user?.notification_settings?.email ?? true,
    // sms: user?.notification_settings?.sms ?? false,
    // push: user?.notification_settings?.push ?? true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: user?.privacy_settings?.profile_visible ?? true,
    showHistory: user?.privacy_settings?.show_history ?? true,
    allowMessages: user?.privacy_settings?.allow_messages ?? true,
    shareData: user?.privacy_settings?.share_data ?? false,
    analyticsConsent: user?.privacy_settings?.analytics_consent ?? true,
    marketingConsent: user?.privacy_settings?.marketing_consent ?? false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: user?.security_settings?.two_factor_enabled ?? false,
    loginNotifications: user?.security_settings?.login_notifications ?? true,
    sessionTimeout: user?.security_settings?.session_timeout ?? 30,
    passwordExpiry: user?.security_settings?.password_expiry ?? 90
  });

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Doctor statistics
  const [doctorStats, setDoctorStats] = useState({
    totalPatients: 0,
    appointmentsThisMonth: 0,
    averageRating: 0,
    yearsActive: 0,
    totalReviews: 0
  });

  const tabs = getTabsForRole(true); // true = doctor
  const statsConfig = getDoctorStatsConfig(doctorStats);
  const profileCompletion = calculateProfileCompletion(formData, true);

  // Fetch data on mount
  useEffect(() => {
    fetchUserProfile();
    fetchDoctorStats();
  }, []);

  // API Functions
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/profile');
      const userData = response.data;

      setFormData(prev => ({ ...prev, ...userData }));
      setNotificationSettings(userData.notification_settings || {});
      setPrivacySettings(userData.privacy_settings || {});
      setSecuritySettings(userData.security_settings || {});
    } catch (err) {
      setError('Failed to fetch profile data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorStats = async () => {
    try {
      const response = await api.get('/doctors/statistics');
      setDoctorStats(response.data);
    } catch (err) {
      console.error('Failed to fetch doctor statistics:', err);
    }
  };

  const updateProfile = async (dataToUpdate) => {
    try {
      const response = await api.patch('/users/profile', dataToUpdate);
      updateUser(response.data);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(null), 3000);
      return response.data;
    } catch (err) {
      throw new Error('Failed to update profile');
    }
  };

  const uploadProfileImage = async (file) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('profile_image', file);

      const response = await api.post('/users/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      updateUser({ ...user, avatar: response.data.avatar_url });
      setSuccess('Profile image updated successfully');
    } catch (err) {
      setError('Failed to upload profile image');
    } finally {
      setUploadingImage(false);
    }
  };

const changePassword = async () => {
  setIsChangingPassword(true);
  setChangePasswordError('');
  setChangePasswordSuccess(false);

  const portal = localStorage.getItem('portal') || 'doctor';

  try {
    await userAPI.changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword,
      portal
    );

    setChangePasswordSuccess(true);
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



  const toggle2FA = async () => {
    try {
      const response = await api.post('/users/toggle-2fa');
      setSecuritySettings(prev => ({
        ...prev,
        twoFactorEnabled: !prev.twoFactorEnabled
      }));
      setSuccess(response.data.enabled ? '2FA enabled successfully' : '2FA disabled successfully');
    } catch (err) {
      setError('Failed to toggle 2FA');
    }
  };

  // Wrapper functions for utils
  const handleInputChange = (e) => utilHandleInputChange(e, setFormData);
  const handleArrayChange = (field, index, value) => utilHandleArrayChange(field, index, value, setFormData);
  const addArrayItem = (field, defaultValue) => utilAddArrayItem(field, defaultValue, setFormData);
  const removeArrayItem = (field, index) => utilRemoveArrayItem(field, index, setFormData);

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) uploadProfileImage(file);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <ProfileHeader
          user={user}
          fileInputRef={fileInputRef}
          uploadingImage={uploadingImage}
          handleImageUpload={handleImageUpload}
          loading={loading}
          fetchUserProfile={fetchUserProfile}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          isDoctor={true}
          stats={doctorStats}
        />

        {/* Statistics Cards */}
        <StatsCards stats={statsConfig} />

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-2xl border border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.id === 'personal' && <User className="w-5 h-5" />}
              {tab.id === 'professional' && <Stethoscope className="w-5 h-5" />}
              {tab.id === 'schedule' && <Calendar className="w-5 h-5" />}
              {tab.id === 'settings' && <Settings className="w-5 h-5" />}
              {tab.id === 'security' && <Shield className="w-5 h-5" />}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'personal' && (
              <PersonalInfoTab
                formData={formData}
                handleInputChange={handleInputChange}
                isEditing={isEditing}
                handleSave={handleSave}
                loading={loading}
              />
            )}

            {activeTab === 'professional' && (
              <ProfessionalInfoTab
                formData={formData}
                handleInputChange={handleInputChange}
                handleArrayChange={handleArrayChange}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
                isEditing={isEditing}
                handleSave={handleSave}
                loading={loading}
              />
            )}

            {activeTab === 'schedule' && (
              <ScheduleTab
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
                handleSave={handleSave}
                loading={loading}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTab
                notificationSettings={notificationSettings}
                setNotificationSettings={setNotificationSettings}
                privacySettings={privacySettings}
                setPrivacySettings={setPrivacySettings}
              />
            )}

          {activeTab === 'security' && (
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

          {/* Sidebar */}
          <div className="space-y-8">
            <AccountStatusCard
              profileCompletion={profileCompletion}
              isDoctor={true}
              stats={doctorStats}
            />
            <ConnectedServicesCard />
          </div>
        </motion.div>
      </div>

      {/* Modals */}
    <PasswordModal
  showPasswordModal={showPasswordModal}
  setShowPasswordModal={(val) => {
    setShowPasswordModal(val);
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



      {/* Toast Notifications */}
      <SuccessErrorToast
        success={success}
        error={error}
        setError={setError}
      />
    </div>
  );
};

export default DoctorProfile;
