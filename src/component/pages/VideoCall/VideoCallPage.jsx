/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/VideoCall/VideoCallPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  X, 
  Phone, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Monitor,
  MonitorOff,
  Users,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import videoCallAPI from '../../../api/videoCall.api';
import appointmentsAPI from '../../../api/appointments.api';

const VideoCallPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isEnding, setIsEnding] = useState(false);
  const [roomUrl, setRoomUrl] = useState(null); // ✅ NEW: Track room URL state
  
  const iframeRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    loadAppointmentAndJoin();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [appointmentId]);

  // ✅ NEW: Effect to load iframe when room URL is available
  useEffect(() => {
    if (roomUrl && iframeRef.current) {
      console.log('🎥 Loading Daily.co iframe with URL:', roomUrl);
      iframeRef.current.src = roomUrl;
      
      // Add load event listener
      iframeRef.current.onload = () => {
        console.log('✅ Daily.co iframe loaded successfully');
      };
      
      iframeRef.current.onerror = (error) => {
        console.error('❌ Daily.co iframe failed to load:', error);
        toast.error('Failed to load video interface');
      };
    }
  }, [roomUrl]);


  // ✅ OPTIMIZED: Better error handling and loading states
  const loadAppointmentAndJoin = async () => {
    try {
      setLoading(true);
      setError(null); // ✅ Clear previous errors
      
      console.log('📞 Loading appointment:', appointmentId);
      
      // Get appointment details
      const appointmentData = await appointmentsAPI.getAppointmentById(appointmentId);
      setAppointment(appointmentData);
      
      console.log('✅ Appointment loaded:', appointmentData);
      
      // ✅ Check if appointment is confirmed before joining
      if (appointmentData.status !== 'CONFIRMED') {
        throw new Error('This appointment is not confirmed yet');
      }
      
      // Join video call
      console.log('🎥 Joining video call...');
      const joinData = await videoCallAPI.joinVideoCall(appointmentId, 'patient');
      
      console.log('✅ Join data received:', joinData);
      
      if (!joinData.room_url) {
        throw new Error('No room URL received from server');
      }
      
      // ✅ Validate room URL
      if (!joinData.room_url.includes('daily.co')) {
        throw new Error('Invalid room URL format');
      }
      
      console.log('🔗 Setting room URL:', joinData.room_url);
      setRoomUrl(joinData.room_url);
      
      // Start call duration timer
      startTimeRef.current = new Date();
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((new Date() - startTimeRef.current) / 1000);
        setCallDuration(elapsed);
      }, 1000);
      
      toast.success('Connected to video call', { icon: '🎥' });
      
    } catch (err) {
      console.error('❌ Error joining call:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to join video call';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

// ✅ Rest of the component stays the same


  const handleEndCall = async () => {
    if (isEnding) return;
    
    if (!window.confirm('Are you sure you want to end this call?')) {
      return;
    }
    
    setIsEnding(true);
    
    try {
      const durationMinutes = Math.ceil(callDuration / 60);
      const response = await videoCallAPI.endVideoCall(appointmentId, durationMinutes);
      
      // Check if can rejoin
      if (response.can_rejoin) {
        toast.success(
          response.message || 'Call ended early. You can rejoin at the scheduled time!',
          { 
            duration: 6000,
            icon: '🔄',
            style: {
              background: '#10b981',
              color: '#fff',
            }
          }
        );
        
        // Navigate back with rejoin info
        setTimeout(() => {
          navigate('/appointments', {
            state: { 
              rejoinMessage: response.message,
              rejoinAppointmentId: appointmentId,
              timeUntilStart: response.time_until_start_minutes
            }
          });
        }, 2000);
      } else {
        // Normal end
        toast.success('Call ended successfully', {
          icon: '✅'
        });
        
        setTimeout(() => {
          navigate('/appointments');
        }, 1000);
      }
      
    } catch (err) {
      console.error('Error ending call:', err);
      toast.error('Failed to end call properly');
      // Still navigate away
      navigate('/appointments');
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Connecting to video call...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Join Call</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/appointments')}
            className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col">
      
      {/* Top Bar */}
      <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between shadow-lg z-10">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">{appointment?.doctor_name}</h3>
            <p className="text-sm text-gray-300">{appointment?.clinic_name}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-gray-300">
            <Clock className="h-4 w-4" />
            <span className="font-mono">{formatDuration(callDuration)}</span>
          </div>
          
          <button
            onClick={handleEndCall}
            disabled={isEnding}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isEnding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Ending...</span>
              </>
            ) : (
              <>
                <Phone className="h-4 w-4" />
                <span>End Call</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Video Frame */}
      <div className="flex-1 relative bg-gray-900">
        {/* ✅ Loading overlay while room URL is being fetched */}
        {!roomUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-teal-500 animate-spin mx-auto mb-4" />
              <p className="text-white">Loading video interface...</p>
            </div>
          </div>
        )}
        
        {/* ✅ Iframe - will load when roomUrl is set */}
        <iframe
          ref={iframeRef}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          className="w-full h-full border-0"
          title="Video Call"
        />
      </div>

      {/* Appointment Info Footer */}
      <div className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">Booking ID:</span>
          <span className="font-mono font-semibold">#{appointment?.booking_id}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-gray-300">Connected</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCallPage;
