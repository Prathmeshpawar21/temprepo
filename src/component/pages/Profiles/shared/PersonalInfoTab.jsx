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
import { User, Mail, Phone, Calendar, Save } from 'lucide-react';
import { genders } from './profileUtils';

const PersonalInfoTab = ({ formData, handleInputChange, isEditing, handleSave, loading }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        {isEditing && (
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* First Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" name="firstName" value={formData.firstName}
              onChange={handleInputChange} disabled={!isEditing} placeholder="John"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
            />
          </div>
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" name="lastName" value={formData.lastName}
              onChange={handleInputChange} disabled={!isEditing} placeholder="Doe"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
            />
          </div>
        </div>

        {/* Email — always read-only (Keycloak managed) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
            {/* <span className="ml-2 text-xs text-gray-400 font-normal">(managed via account)</span> */}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="email" name="email" value={formData.email}
              disabled placeholder="john.doe@example.com"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 transition-all cursor-not-allowed"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  inputMode="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^\d\s\+\-\(\)]/g, '');
                    handleInputChange({ target: { name: 'phone', value: cleaned } });
                  }}
                  disabled={!isEditing}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                />

          </div>
        </div>


      {/* Date of Birth */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            min="1900-01-01"
            max="2099-12-31"
            onChange={(e) => {
              const value = e.target.value;
              // Only block if year segment has MORE than 4 digits (paste attack)
              // Do NOT range-check here — it fires mid-typing and wipes day/month
              if (value && value.split('-')[0].length > 4) return;
              handleInputChange(e);
            }}
            onBlur={(e) => {
              const value = e.target.value;
              if (!value) return;
              const year = parseInt(value.split('-')[0], 10);
              // Range-check only after user finishes typing the full date
              if (year < 1900 || year > 2099) {
                handleInputChange({ target: { name: 'dateOfBirth', value: '' } });
              }
            }}
            disabled={!isEditing}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
          />
        </div>
      </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
          <select name="gender" value={formData.gender}
            onChange={handleInputChange} disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
          >
            <option value="">Select Gender</option>
            {genders.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>

      </div>

      {/* <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Fields marked with * are required. Your personal information is
          encrypted and secure. Email is managed through your account settings.
        </p>
      </div> */}
    </div>
  );
};

export default PersonalInfoTab;
