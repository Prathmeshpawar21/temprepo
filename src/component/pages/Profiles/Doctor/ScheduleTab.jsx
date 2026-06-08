/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Profile/Doctor/ScheduleTab.jsx

import React from 'react';
import { Save, Calendar } from 'lucide-react';

const ScheduleTab = ({ formData, setFormData, isEditing, handleSave, loading }) => {
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const dayLabels = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  const handleAvailabilityToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          available: !prev.workingHours[day].available
        }
      }
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-teal-600" />
          <h2 className="text-2xl font-bold text-gray-900">Working Schedule</h2>
        </div>
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

      <div className="space-y-4">
        {daysOfWeek.map((day) => {
          const schedule = formData.workingHours[day] || {
            start: '09:00',
            end: '17:00',
            available: false
          };

          return (
            <div key={day} className="p-6 border border-gray-200 rounded-xl hover:border-teal-200 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{dayLabels[day]}</h3>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={schedule.available}
                    onChange={() => handleAvailabilityToggle(day)}
                    disabled={!isEditing}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 disabled:opacity-50 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">Available</span>
                </label>
              </div>

              {schedule.available && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={schedule.start}
                      onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={schedule.end}
                      onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
              )}

              {!schedule.available && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">Not available on {dayLabels[day]}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Schedule Summary */}
      <div className="mt-8 p-4 bg-teal-50 border border-teal-200 rounded-xl">
        <h4 className="text-sm font-bold text-teal-900 mb-3">Weekly Schedule Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {daysOfWeek.map((day) => {
            const schedule = formData.workingHours[day];
            return (
              <div key={day} className="p-2 bg-white rounded">
                <span className="font-semibold text-gray-700 capitalize">{dayLabels[day]}:</span>
                <br />
                <span className={schedule?.available ? 'text-green-600' : 'text-red-600'}>
                  {schedule?.available ? `${schedule.start} - ${schedule.end}` : 'Closed'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScheduleTab;
