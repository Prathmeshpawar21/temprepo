/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Profiles/Profile.jsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Authentication/AuthContext';
import { useNavigate } from 'react-router-dom';
import PatientProfile from './Patient/PatientProfile';  // ✅ Relative paths are fine
import DoctorProfile from './Doctor/DoctorProfile';      // ✅ Relative paths are fine

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isDoctor, setIsDoctor] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      const isDoctorUser = 
        user.role === 'doctor' || 
        user.user_type === 'doctor' || 
        user.is_doctor === true ||
        user.userType === 'doctor';
      
      setIsDoctor(isDoctorUser);
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          {/* <div className="text-red-500 text-6xl mb-4">⚠️</div> */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isDoctor ? <DoctorProfile /> : <PatientProfile />}
    </div>
  );
};

export default Profile;














