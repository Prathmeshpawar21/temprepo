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
import { Heart, AlertCircle, Activity, Plus, X, Save } from 'lucide-react';
import { bloodTypes } from '../shared/profileUtils';

const MedicalInfoTab = ({
  formData, handleInputChange, handleArrayChange,
  addArrayItem, removeArrayItem, isEditing, handleSave, loading
}) => {
  return (
    <div className="space-y-8">

      {/* Blood Type */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Medical Information</h2>
          {isEditing && (
            <button onClick={handleSave} disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Type</label>
          <div className="relative">
            <Heart className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select name="bloodType" value={formData.bloodType}
              onChange={handleInputChange} disabled={!isEditing}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
            >
              <option value="">Select Blood Type</option>
              {bloodTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Allergies */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Allergies</h3>
          {isEditing && (
            <button onClick={() => addArrayItem('allergies', '')}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Plus className="h-4 w-4" /><span>Add Allergy</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {formData.allergies?.length > 0 ? (
            formData.allergies.map((allergy, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <input type="text" value={allergy}
                  onChange={(e) => handleArrayChange('allergies', index, e.target.value)}
                  disabled={!isEditing} placeholder="e.g., Penicillin, Peanuts"
                  className="flex-1 px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-50"
                />
                {isEditing && (
                  <button onClick={() => removeArrayItem('allergies', index)} className="text-red-500 hover:text-red-700">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No allergies recorded</p>
              {isEditing && <p className="text-xs text-gray-400 mt-2">Click "Add Allergy" to add one</p>}
            </div>
          )}
        </div>
      </div>

      {/* Chronic Conditions */}
      {/* <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Chronic Conditions</h3>
          {isEditing && (
            <button onClick={() => addArrayItem('chronicConditions', '')}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
            >
              <Plus className="h-4 w-4" /><span>Add Condition</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {formData.chronicConditions?.length > 0 ? (
            formData.chronicConditions.map((condition, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <Activity className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <input type="text" value={condition}
                  onChange={(e) => handleArrayChange('chronicConditions', index, e.target.value)}
                  disabled={!isEditing} placeholder="e.g., Diabetes, Hypertension"
                  className="flex-1 px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-orange-50"
                />
                {isEditing && (
                  <button onClick={() => removeArrayItem('chronicConditions', index)} className="text-orange-500 hover:text-orange-700">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No chronic conditions recorded</p>
              {isEditing && <p className="text-xs text-gray-400 mt-2">Click "Add Condition" to add one</p>}
            </div>
          )}
        </div>
      </div> */}

    </div>
  );
};

export default MedicalInfoTab;
