/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Dashboard/Dashboard.jsx
import { useAuth } from '../../Authentication/AuthContext';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import { AlertCircle } from 'lucide-react';
/**
 * ✅ Smart Dashboard Router
 * Automatically detects user role and renders appropriate dashboard
 * - Patient role → PatientDashboard
 * - Doctor role → DoctorDashboard
 * - Unknown role → Error message
 */
const Dashboard = () => {
  const { user, isLoading } = useAuth();

  // Loading state
if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
        <p className="text-slate-600 font-medium">Loading your dashboard...</p>
      </div>
    </div>
  );
}


  // No user (shouldn't happen due to ProtectedRoute)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please login to access your dashboard.</p>
          <button
            // onClick={() => window.location.href = '/authentication'}
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
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
    return <PatientDashboard />;
  } else if (userRole === 'doctor') {
    return <DoctorDashboard />;
  } else {
    // Unknown role
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Unknown Role</h2>
          <p className="text-gray-600 mb-2">
            Your account role <span className="font-semibold">({user.role})</span> is not recognized.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please contact support to resolve this issue.
          </p>
          <div className="space-y-3">
            <a
              href="mailto:support@allcognix.com"
              className="block w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Contact Support
            </a>
            <button
              onClick={() => window.location.href = '/select-portal'}
              className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
            >
              Select Portal
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default Dashboard;
