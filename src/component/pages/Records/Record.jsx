/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/Record.jsx

import { useAuth } from '../../Authentication/AuthContext';
import PatientRecords from './Patient/PatientRecords';
import DoctorRecords from './Doctor/DoctorRecords';
import { AlertCircle, Loader2 } from 'lucide-react';

/**
 * ✅ Smart Records Router
 * Automatically detects user role and renders appropriate records view
 * - Patient role → PatientRecords
 * - Doctor role → DoctorRecords
 */
const Record = () => {
  const { user, isLoading } = useAuth();
 

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading medical records...</p>
        </div>
      </div>
    );
  }

  // No user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please login to access your medical records.</p>
          <button
            // onClick={() => window.location.href = '/authentication'}
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ✅ ROLE-BASED ROUTING
  const userRole = user.role?.toLowerCase();

  if (userRole === 'patient') {
    return <PatientRecords />;
  } else if (userRole === 'doctor') {
    return <DoctorRecords />;
  } else {
    // Unknown role
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Unknown Role</h2>
          <p className="text-gray-600 mb-2">
            Your account role <span className="font-semibold">({user.role})</span> is not recognized.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please contact support to resolve this issue.
          </p>
          <a
            href="mailto:support@allcognix.com"
            className="block w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Contact Support
          </a>
        </div>
      </div>
    );
  }
};

export default Record;
