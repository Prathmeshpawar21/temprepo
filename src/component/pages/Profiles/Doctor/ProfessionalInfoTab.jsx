/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Profile/Doctor/ProfessionalInfoTab.jsx

import React from 'react';
import {
  Stethoscope,
  ShieldCheck,
  Building,
  DollarSign,
  GraduationCap,
  Award,
  Languages,
  Plus,
  Minus,
  Save
} from 'lucide-react';

const ProfessionalInfoTab = ({
  formData,
  handleInputChange,
  handleArrayChange,
  addArrayItem,
  removeArrayItem,
  isEditing,
  handleSave,
  loading
}) => {
  return (
    <div className="space-y-8">
      {/* Basic Professional Info */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Professional Information</h2>
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
              Primary Specialty *
            </label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="e.g., Cardiology"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sub-Specialty
            </label>
            <input
              type="text"
              name="subSpecialty"
              value={formData.subSpecialty}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="e.g., Interventional Cardiology"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              License Number *
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="e.g., MD123456"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              License State
            </label>
            <input
              type="text"
              name="licenseState"
              value={formData.licenseState}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="e.g., California"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hospital Affiliation
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="hospitalAffiliation"
                value={formData.hospitalAffiliation}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="e.g., City General Hospital"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Years of Experience
            </label>
            <input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
              disabled={!isEditing}
              min="0"
              max="50"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Consultation Fee (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
                placeholder="100"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Professional Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            disabled={!isEditing}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all resize-none"
            placeholder="Tell patients about your experience, approach to care, and specializations..."
          />
        </div>
      </div>

      {/* Education & Certifications */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Education & Certifications</h3>

        {/* Education */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-gray-700">Education</label>
            {isEditing && (
              <button
                onClick={() => addArrayItem('education', { degree: '', institution: '', year: '' })}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Education</span>
              </button>
            )}
          </div>
          <div className="space-y-4">
            {formData.education && formData.education.length > 0 ? (
              formData.education.map((edu, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <GraduationCap className="h-5 w-5 text-gray-500" />
                    {isEditing && (
                      <button
                        onClick={() => removeArrayItem('education', index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={edu.degree || ''}
                      onChange={(e) =>
                        handleArrayChange('education', index, { ...edu, degree: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="Degree (e.g., MD)"
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                    />
                    <input
                      type="text"
                      value={edu.institution || ''}
                      onChange={(e) =>
                        handleArrayChange('education', index, {
                          ...edu,
                          institution: e.target.value
                        })
                      }
                      disabled={!isEditing}
                      placeholder="Institution"
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                    />
                    <input
                      type="text"
                      value={edu.year || ''}
                      onChange={(e) =>
                        handleArrayChange('education', index, { ...edu, year: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="Year (e.g., 2015)"
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <GraduationCap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No education records added</p>
              </div>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-gray-700">Certifications</label>
            {isEditing && (
              <button
                onClick={() =>
                  addArrayItem('certifications', { name: '', issuer: '', year: '' })
                }
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Certification</span>
              </button>
            )}
          </div>
          <div className="space-y-4">
            {formData.certifications && formData.certifications.length > 0 ? (
              formData.certifications.map((cert, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <Award className="h-5 w-5 text-gray-500" />
                    {isEditing && (
                      <button
                        onClick={() => removeArrayItem('certifications', index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={cert.name || ''}
                      onChange={(e) =>
                        handleArrayChange('certifications', index, { ...cert, name: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="Certification Name"
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                    />
                    <input
                      type="text"
                      value={cert.issuer || ''}
                      onChange={(e) =>
                        handleArrayChange('certifications', index, {
                          ...cert,
                          issuer: e.target.value
                        })
                      }
                      disabled={!isEditing}
                      placeholder="Issuing Organization"
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                    />
                    <input
                      type="text"
                      value={cert.year || ''}
                      onChange={(e) =>
                        handleArrayChange('certifications', index, { ...cert, year: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="Year"
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Award className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No certifications added</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Languages</h3>
          {isEditing && (
            <button
              onClick={() => addArrayItem('languages', '')}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Language</span>
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.languages && formData.languages.length > 0 ? (
            formData.languages.map((language, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <Languages className="h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  value={language}
                  onChange={(e) => handleArrayChange('languages', index, e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., English, Spanish"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                />
                {isEditing && (
                  <button
                    onClick={() => removeArrayItem('languages', index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500">
              <Languages className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No languages added</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfoTab;
