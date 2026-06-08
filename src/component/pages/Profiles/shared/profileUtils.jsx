/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Profile/shared/profileUtils.jsx

import { 
  Users, Calendar, Star, Award, Stethoscope, Pill, 
  TestTube, Heart, Activity, Clock 
} from 'lucide-react';

/**
 * Navigation tabs configuration
 */
export const getTabsForRole = (isDoctor) => {
  if (isDoctor) {
    return [
      { id: 'personal', label: 'Personal Info', icon: 'User' },
      { id: 'professional', label: 'Professional', icon: 'Stethoscope' },
      { id: 'schedule', label: 'Schedule', icon: 'Calendar' },
      { id: 'settings', label: 'Settings', icon: 'Settings' },
      // { id: 'security', label: 'Security', icon: 'Shield' }
    ];
  } else {
    return [
      { id: 'personal', label: 'Personal Info', icon: 'User' },
      { id: 'medical', label: 'Medical Info', icon: 'Heart' },
      { id: 'emergency', label: 'Emergency', icon: 'AlertCircle' },
      { id: 'settings', label: 'Settings', icon: 'Settings' },
      // { id: 'security', label: 'Security', icon: 'Shield' }
    ];
  }
};

/**
 * Stats configuration for Doctor
 */
export const getDoctorStatsConfig = (doctorStats) => [
  {
    label: 'Total Patients',
    value: doctorStats.totalPatients || 0,
    icon: <Users />,
    accent: 'bg-purple-50',
    text: 'text-purple-500',
    change: '+12%',
  },
  {
    label: 'This Month',
    value: doctorStats.appointmentsThisMonth || 0,
    icon: <Calendar />,
    accent: 'bg-teal-50',
    text: 'text-teal-500',
    change: '+8%',
  },
  {
    label: 'Rating',
    value: doctorStats.averageRating?.toFixed(1) || '0.0',
    icon: <Star />,
    accent: 'bg-orange-50',
    text: 'text-orange-500',
    change: '+0.2',
  },
  {
    label: 'Experience',
    value: `${doctorStats.yearsActive || 0}y`,
    icon: <Award />,
    accent: 'bg-indigo-50',
    text: 'text-indigo-500',
    change: 'Licensed',
  },
];

/**
 * Stats configuration for Patient
 */
export const getPatientStatsConfig = (stats) => [
  {
    label: 'Last Checkup',
    value: stats.lastCheckup
      ? `${Math.floor((new Date() - new Date(stats.lastCheckup)) / 86400000)}d ago`
      : '0',
    icon: <Stethoscope />,
    accent: 'bg-purple-50',
    text: 'text-purple-500',
  },
  {
    label: 'Upcoming',
    value: stats.upcomingAppointments ?? 0,
    icon: <Calendar />,
    accent: 'bg-teal-50',
    text: 'text-teal-500',
  },
  {
    label: 'Medications',
    value: stats.activeMedications ?? 0,
    icon: <Pill />,
    accent: 'bg-orange-50',
    text: 'text-orange-500',
  },
  {
    label: 'Pending Results',
    value: stats.pendingResults ?? 0,
    icon: <TestTube />,
    accent: 'bg-indigo-50',
    text: 'text-indigo-500',
  },
];


/**
 * Blood type options
 */
export const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

/**
 * Gender options
 */
export const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
];

/**
 * Country options
 */
export const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'India',
  'Other'
];

/**
 * Emergency contact relationship options
 */
export const relationshipOptions = [
  { value: 'parent', label: 'Parent' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'child', label: 'Child' },
  { value: 'friend', label: 'Friend' },
  { value: 'other', label: 'Other' }
];

/**
 * Notification settings descriptions
 */
export const notificationDescriptions = {
  appointments: 'Get notified about upcoming appointments',
  medications: 'Receive medication reminders',
  // results: 'Get alerts for test results and reports',
  messages: 'Receive notifications for new messages',
  reminders: 'General health and wellness reminders',
  // promotions: 'Marketing and promotional notifications',
  email: 'Email notifications',
  // sms: 'SMS text message notifications',
  // push: 'Push notifications to your device'
};

/**
 * Privacy settings descriptions
 */
export const privacyDescriptions = {
  profileVisible: 'Make your profile visible to other users',
  showHistory: 'Show your medical history to authorized providers',
  allowMessages: 'Allow other users to send you messages',
  shareData: 'Share anonymized data for research purposes',
  analyticsConsent: 'Allow analytics for improving the service',
  marketingConsent: 'Consent to marketing communications'
};

/**
 * Default working hours for doctors
 */
export const defaultWorkingHours = {
  monday: { start: '09:00', end: '17:00', available: true },
  tuesday: { start: '09:00', end: '17:00', available: true },
  wednesday: { start: '09:00', end: '17:00', available: true },
  thursday: { start: '09:00', end: '17:00', available: true },
  friday: { start: '09:00', end: '17:00', available: true },
  saturday: { start: '09:00', end: '13:00', available: false },
  sunday: { start: '10:00', end: '14:00', available: false }
};

/**
 * Format label with spaces
 */
export const formatLabel = (key) => {
  return key.replace(/([A-Z])/g, ' $1').trim();
};

/**
 * Calculate profile completion percentage
 */
// ✅ Fix calculateProfileCompletion — align with actual formData keys
export const calculateProfileCompletion = (formData, isDoctor) => {
  const required = isDoctor
    ? ['firstName', 'lastName', 'email', 'phone', 'specialization', 'licenseNumber']
    : ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'bloodType'];

  const filled = required.filter((f) => formData[f] && String(formData[f]).trim() !== '');
  return Math.round((filled.length / required.length) * 100);
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate phone format
 */
export const validatePhone = (phone) => {
  const re = /^\+?[\d\s\-()]+$/;
  return re.test(phone);
};

/**
 * Handle form input change
 */
export const handleInputChange = (e, setFormData) => {
  const { name, value, type, checked } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
  }));
};

/**
 * Handle array field change
 */
export const handleArrayChange = (field, index, value, setFormData) => {
  setFormData(prev => ({
    ...prev,
    [field]: prev[field].map((item, i) => i === index ? value : item)
  }));
};

/**
 * Add item to array field
 */
export const addArrayItem = (field, defaultValue, setFormData) => {
  setFormData(prev => ({
    ...prev,
    [field]: [...(prev[field] || []), defaultValue]
  }));
};

/**
 * Remove item from array field
 */
export const removeArrayItem = (field, index, setFormData) => {
  setFormData(prev => ({
    ...prev,
    [field]: prev[field].filter((_, i) => i !== index)
  }));
};
