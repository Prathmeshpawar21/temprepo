/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Profile/shared/ProfileHeader.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { User, Camera, RefreshCw, Edit, X, Star } from 'lucide-react';

const ProfileHeader = ({
  user,
  fileInputRef,
  uploadingImage,
  handleImageUpload,
  loading,
  fetchUserProfile,
  isEditing,
  setIsEditing,
  isDarkMode,
  setIsDarkMode,
  isDoctor,
  stats
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
    >
      <div className="flex items-center space-x-6">
        {/* Profile Image */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-md p-1">
            <div className="w-full h-full rounded-3xl overflow-hidden bg-white">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-teal-100 flex items-center justify-center">
                  <User className="h-10 w-10 text-teal-700" />
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="absolute -bottom-2 -right-2 p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 shadow-md transition-all disabled:opacity-50"
          >
            {uploadingImage ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* User Info */}
        <div>
          <h1 className="text-3xl font-bold text-teal-700">
            {user?.first_name} {user?.last_name}
          </h1>
          <p className="text-gray-600 mt-1 capitalize text-lg">
            {isDoctor ? `${user?.specialty || 'Doctor'} Specialist` : 'Patient'}
          </p>
          {isDoctor && stats && (
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-700">
                  {stats.averageRating?.toFixed(1) || '0.0'}
                </span>
                <span className="text-sm text-gray-500">({stats.totalReviews || 0} reviews)</span>
              </div>
              <div className="text-sm text-gray-600">
                {stats.yearsActive || 0} years experience
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={fetchUserProfile}
          disabled={loading}
          className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all shadow-md ${
            isEditing
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-teal-500 text-white hover:bg-teal-600'
          }`}
        >
          {isEditing ? <X className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>
    </motion.header>
  );
};

export default ProfileHeader;
