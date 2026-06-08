/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Profile/Patient/EmergencyContactTab.jsx

import React from 'react';
import { User, Phone, AlertCircle, Save } from 'lucide-react';
import { relationshipOptions } from '../shared/profileUtils';

const EmergencyContactTab = ({
  formData,
  handleInputChange,
  isEditing,
  handleSave,
  loading
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Emergency Contact</h2>
        {isEditing && (
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contact Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Full name of emergency contact"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                inputMode="tel"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^\d\s\+\-\(\)]/g, '');
                  handleInputChange({ target: { name: 'emergencyContactPhone', value: cleaned } });
                }}
                disabled={!isEditing}
                placeholder="+1 (555) 123-4567"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
              />

          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Relationship *
          </label>
          <select
            name="emergencyContactRelationship"
            value={formData.emergencyContactRelationship}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
          >
            <option value="">Select Relationship</option>
            {relationshipOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preview Card */}
      {formData.emergencyContactName && formData.emergencyContactPhone && (
        <div className="mt-8 p-6 bg-teal-50 border border-teal-200 rounded-xl">
          <h4 className="text-sm font-bold text-teal-900 mb-3">Emergency Contact Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-teal-700">Name:</span>
              <span className="font-semibold text-teal-900">{formData.emergencyContactName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-teal-700">Phone:</span>
              <span className="font-semibold text-teal-900">{formData.emergencyContactPhone}</span>
            </div>
            {formData.emergencyContactRelationship && (   // ← add "ship"
              <div className="flex items-center justify-between">
                <span className="text-teal-700">Relationship:</span>
                <span className="font-semibold text-teal-900 capitalize">
                  {relationshipOptions.find(r => r.value === formData.emergencyContactRelationship)?.label}
                </span>                                    {/* ← add "ship" */}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Important Notice */}
      <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-lg font-bold text-red-900 mb-2">Important Notice</h4>
            <div className="text-sm text-red-800 space-y-2">
              <p>
                This emergency contact will be notified in case of medical emergencies. 
                Please ensure this information is accurate and up-to-date.
              </p>
              <p>
                Your emergency contact should be someone who:
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Can be reached quickly in case of emergency</li>
                <li>Knows your medical history and conditions</li>
                <li>Can make decisions on your behalf if you're unable to do so</li>
                <li>Lives nearby or can arrive quickly in an emergency</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Guidelines */}
      {/* <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <h5 className="text-sm font-bold text-blue-900 mb-2">Best Practices</h5>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Update this information if your emergency contact changes phone numbers</li>
          <li>• Inform your emergency contact that they are listed</li>
          <li>• Consider listing a backup contact if possible</li>
          <li>• Keep a physical copy of this information in your wallet</li>
        </ul>
      </div> */}


    </div>
  );
};

export default EmergencyContactTab;
