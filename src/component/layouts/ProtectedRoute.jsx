/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Authentication/AuthContext';

// Loading component for auth hydration
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-10 h-10 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
  </div>
);

// ✅ NEW: Role-based access denied component
const AccessDenied = ({ requiredRole, userRole }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
    <div className="text-center max-w-md bg-white rounded-2xl shadow-2xl p-8">
      <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h2>
      <p className="text-gray-600 mb-6">
        This page requires <span className="font-semibold text-red-600">{requiredRole}</span> role.
        {userRole && (
          <span className="block mt-2 text-sm">
            You are logged in as: <span className="font-semibold">{userRole}</span>
          </span>
        )}
      </p>
      <button
        onClick={() => window.history.back()}
        className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
      >
        Go Back
      </button>
    </div>
  </div>
);

/**
 * ✅ UPDATED: ProtectedRoute with role-based access control
 * 
 * Usage:
 * <ProtectedRoute>...</ProtectedRoute>                          - Any authenticated user
 * <ProtectedRoute requiredRole="PATIENT">...</ProtectedRoute>   - Only PATIENT role
 * <ProtectedRoute requiredRole="DOCTOR">...</ProtectedRoute>    - Only DOCTOR role
 * <ProtectedRoute allowedRoles={["PATIENT", "DOCTOR"]}>...</ProtectedRoute> - Multiple roles
 */
const ProtectedRoute = ({ children, requiredRole, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  
  // Show loading screen while checking auth
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    // return <Navigate to="/authentication" replace />;
    return <Navigate to="/login" replace />;
  }
  
  // ✅ NEW: Role-based access control
  if (requiredRole || allowedRoles) {
    const userRole = user.role?.toUpperCase(); // PATIENT or DOCTOR
    
    // Check single required role
    if (requiredRole) {
      const required = requiredRole.toUpperCase();
      if (userRole !== required) {
        console.warn(`🚫 Access denied: User has role '${userRole}' but '${required}' is required`);
        return <AccessDenied requiredRole={required} userRole={userRole} />;
      }
    }
    
    // Check multiple allowed roles
    if (allowedRoles && allowedRoles.length > 0) {
      const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase());
      if (!normalizedAllowedRoles.includes(userRole)) {
        console.warn(`🚫 Access denied: User has role '${userRole}' but needs one of: ${normalizedAllowedRoles.join(', ')}`);
        return <AccessDenied requiredRole={normalizedAllowedRoles.join(' or ')} userRole={userRole} />;
      }
    }
  }
  
  // User is authenticated and has required role (if any)
  return children;
};

export default ProtectedRoute;
export { LoadingScreen };
