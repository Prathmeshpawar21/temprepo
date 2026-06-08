/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/VideoCall/VideoCallModal.jsx

import React, { useState } from 'react';
import { 
  X, 
  Video, 
  Camera, 
  Mic, 
  User, 
  Calendar, 
  Clock,
  MapPin,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const VideoCallModal = ({ 
  appointment, 
  videoSession,
  onClose, 
  onJoin 
}) => {
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await onJoin();
    } catch (error) {
      console.error('Join error:', error);
      toast.error('Failed to join call. Please try again.');
      setIsJoining(false);
    }
  };

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  });
};


const formatTime = (timeStr) => {
  if (!timeStr) return '';
  if (typeof timeStr === 'string' && timeStr.includes(':')) {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm} IST`;  // ✅ added IST label
  }
  return timeStr;
};


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Join Video Consultation</h2>
              <p className="text-teal-100 mt-1">Get ready to meet your doctor</p>
            </div>
            <button
              onClick={onClose}
              disabled={isJoining}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Device Check */}
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-4 border-2 border-teal-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Video className="h-5 w-5 mr-2 text-teal-600" />
              Device Check
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Camera className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Camera</p>
                  <p className="text-xs text-gray-600">Will be requested when you join</p>
                </div>
                <span className="text-green-600 font-semibold text-xs">Ready</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mic className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Microphone</p>
                  <p className="text-xs text-gray-600">Will be requested when you join</p>
                </div>
                <span className="text-green-600 font-semibold text-xs">Ready</span>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-gray-600" />
              Appointment Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{appointment.doctor_name}</p>
                  <p className="text-xs text-gray-600">{appointment.clinic_name}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(appointment.confirmed_date || appointment.preferred_date)}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(appointment.confirmed_time || appointment.preferred_time)}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 md:col-span-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Reason for Visit</p>
                  <p className="text-xs text-gray-600">{appointment.reason}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="font-bold mb-2">Before you join:</p>
                <ul className="space-y-1.5 ml-4 list-disc">
                  <li>Ensure you're in a quiet, well-lit environment</li>
                  <li>Have your medical records or prescriptions ready</li>
                  <li>Test your camera and microphone</li>
                  <li>Keep a pen and paper for notes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex space-x-3 px-6 py-4 bg-gray-50 border-t rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={isJoining}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
            disabled={isJoining}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isJoining ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Joining...</span>
              </>
            ) : (
              <>
                <Video className="h-5 w-5" />
                <span>Join Call as Patient</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
