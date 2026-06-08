/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// useUserProfile.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../component/Authentication/AuthContext';
import patientProfileAPI from '../api/patient/profile.api';
import avatarAPI from '../api/patient/avtar.api';

// ─── Normalizers ──────────────────────────────────────────────────────────────

const normalizeProfile = (data) => ({
  firstName:                    data.first_name                     || '',
  lastName:                     data.last_name                      || '',
  email:                        data.email                          || '',
  phone:                        data.phone_number                   || '',
  dateOfBirth:                  data.date_of_birth                  || '',
  gender:                       data.gender                         || '',
  bloodType:                    data.blood_type                     || '',
  allergies:                    data.allergies                      || [],
  chronicConditions:            data.chronic_conditions             || [],
  emergencyContactName:         data.emergency_contact_name         || '',
  emergencyContactPhone:        data.emergency_contact_phone        || '',
  emergencyContactRelationship: data.emergency_contact_relationship || '',
});

const normalizeStats = (data) => ({
  lastCheckup:          data.last_checkup          || null,
  upcomingAppointments: data.upcoming_appointments || 0,
  activeMedications:    data.active_medications    || 0,
  pendingResults:       data.pending_results       || 0,
});

// ─── Serializers ──────────────────────────────────────────────────────────────

const toPersonalPayload = (f) => {
  const payload = {
    first_name:    f.firstName   || undefined,
    last_name:     f.lastName    || undefined,
    phone_number:  f.phone       || undefined,
    date_of_birth: f.dateOfBirth || undefined,
    gender:        f.gender      || undefined,
  };
  Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
  return payload;
};

const toMedicalPayload = (f) => {
  const payload = {
    blood_type:         f.bloodType         || undefined,
    allergies:          f.allergies,
    chronic_conditions: f.chronicConditions,
  };
  Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
  return payload;
};

const toEmergencyPayload = (f) => {
  const payload = {
    emergency_contact_name:         f.emergencyContactName         || undefined,
    emergency_contact_phone:        f.emergencyContactPhone        || undefined,
    emergency_contact_relationship: f.emergencyContactRelationship || undefined,
  };
  Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
  return payload;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE        = 5 * 1024 * 1024; // 5MB

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', phone: '',
  dateOfBirth: '', gender: '',
  bloodType: '', allergies: [], chronicConditions: [],
  emergencyContactName: '', emergencyContactPhone: '',
  emergencyContactRelationship: '',
};

const EMPTY_STATS = {
  lastCheckup: null, upcomingAppointments: 0,
  activeMedications: 0, pendingResults: 0,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

const usePatientProfile = () => {
  const { user, updateUser } = useAuth();

  // ── All useState MUST be inside the hook ─────────────────────────────────
  const [formData,       setFormData]       = useState(EMPTY_FORM);
  const [stats,          setStats]          = useState(EMPTY_STATS);
  const [loading,        setLoading]        = useState(false);
  const [saving,         setSaving]         = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [localAvatarUrl, setLocalAvatarUrl] = useState(null);
  const [error,          setError]          = useState(null);
  const [success,        setSuccess]        = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const flash = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileRes, statsRes] = await Promise.all([
        patientProfileAPI.getProfile(),
        patientProfileAPI.getStats(),
      ]);

      setFormData(normalizeProfile(profileRes.data));
      setStats(normalizeStats(statsRes.data));
      setAvatarUrl(profileRes.data.avatar_url || null);

      if (updateUser) {
        updateUser((prev) => ({
          ...prev,
          first_name: profileRes.data.first_name,
          last_name:  profileRes.data.last_name,
          avatar:     profileRes.data.avatar_url || prev?.avatar || null,
        }));
      }
    } catch (err) {
      setError('Failed to load profile. Please refresh.');
      console.error('❌ Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // ── Savers ────────────────────────────────────────────────────────────────
  const savePersonal = async () => {
    setSaving(true);
    setError(null);
    try {
      await patientProfileAPI.updatePersonal(toPersonalPayload(formData));
      if (updateUser) {
        updateUser((prev) => ({
          ...prev,
          first_name: formData.firstName,
          last_name:  formData.lastName,
        }));
      }
      flash('Personal info updated successfully');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update personal info');
    } finally {
      setSaving(false);
    }
  };

  const saveMedical = async () => {
    setSaving(true);
    setError(null);
    try {
      await patientProfileAPI.updateMedical(toMedicalPayload(formData));
      flash('Medical info updated successfully');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update medical info');
    } finally {
      setSaving(false);
    }
  };

  const saveEmergency = async () => {
    setSaving(true);
    setError(null);
    try {
      await patientProfileAPI.updateEmergency(toEmergencyPayload(formData));
      await fetchProfile();
      flash('Emergency contact updated successfully');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update emergency contact');
    } finally {
      setSaving(false);
    }
  };

  // ── Avatar upload ─────────────────────────────────────────────────────────
  const uploadAvatar = async (file) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload JPEG, PNG, WEBP or GIF.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    setUploadingImage(true);
    setError(null);
    try {
      const res = await avatarAPI.uploadAvatar(file);
      const avatarUrl = res.data.avatar_url;
      setAvatarUrl(avatarUrl);

      // Immediate local display — no AuthContext delay
      // setLocalAvatarUrl(avatarUrl);

      // Functional update — avoids stale user closure
      if (updateUser) {
        updateUser((prev) => ({ ...prev, avatar: avatarUrl }));
      }

      flash('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload photo. Please try again.');
      console.error('❌ Avatar upload error:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  return {
    formData,       setFormData,
    stats,
    loading,        saving,
    uploadingImage,
    avatarUrl,
    error,          setError,
    success,
    fetchProfile,
    savePersonal,   saveMedical,   saveEmergency,
    uploadAvatar,
  };
};

export default usePatientProfile;
