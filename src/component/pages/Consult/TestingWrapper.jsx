/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/Consult/TestingWrapper.jsx
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Phone, 
  MapPin, 
  AlertCircle, 
  CheckCircle,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import DoctorRecommendations from './DoctorRecommendations';
import getMockDoctors from './mockDoctorData';

/**
 * 🧪 Testing Wrapper for Appointment Booking
 * 
 * Purpose: Test appointment booking flow without conversational chat
 * Access: /test-booking
 * 
 * Features:
 * - Auto-loads 3 mock doctors with test WhatsApp (+918698844006)
 * - Shows doctor sidebar by default
 * - Tests complete booking flow
 * - No changes to production files
 */
const TestingWrapper = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [consultationId] = useState('test-consult-' + Date.now());
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    success: 0,
    failed: 0
  });

  useEffect(() => {
    // Load mock doctors on mount
    console.log('🧪 Testing Mode: Loading mock doctors...');
    const mockDoctors = getMockDoctors();
    setDoctors(mockDoctors);
    console.log('✅ Loaded', mockDoctors.length, 'mock test doctors');
    
    // Show welcome toast
    toast.success('🧪 Testing mode activated!', {
      duration: 3000
    });
  }, []);

  const handleBookingSuccess = (response) => {
    console.log('✅ Booking successful:', response);
    setBookingStats(prev => ({
      ...prev,
      total: prev.total + 1,
      success: prev.success + 1
    }));
    
    toast.success('✅ Appointment booked successfully!');
    toast.success(`📱 Check WhatsApp: +918698844006`);
  };

  const handleBookingError = (error) => {
    console.error('❌ Booking error:', error);
    setBookingStats(prev => ({
      ...prev,
      total: prev.total + 1,
      failed: prev.failed + 1
    }));
    
    toast.error('❌ Booking failed. Check console for details.');
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Side - Testing Dashboard */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg shadow-lg p-6 mb-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    🧪 Appointment Booking Test Lab
                  </h1>
                  <p className="text-teal-100 text-sm">
                    Testing environment - No changes to production code
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl font-bold">{bookingStats.total}</div>
                <div className="text-sm text-teal-100">Total Bookings</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl font-bold text-green-200">{bookingStats.success}</div>
                <div className="text-sm text-teal-100">Successful</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl font-bold text-red-200">{bookingStats.failed}</div>
                <div className="text-sm text-teal-100">Failed</div>
              </div>
            </div>
          </div>

          {/* Test Configuration */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-teal-600" />
              <span>Test Configuration</span>
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Mock Doctors</div>
                <div className="text-xl font-bold text-green-700">{doctors.length} loaded</div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Test WhatsApp</div>
                <div className="text-lg font-bold text-blue-700">+91 8698844006</div>
              </div>
              
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Test Location</div>
                <div className="text-lg font-bold text-purple-700">Nashik, MH</div>
              </div>
              
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Consultation ID</div>
                <div className="text-xs font-mono text-orange-700">{consultationId.slice(0, 20)}...</div>
              </div>
            </div>
          </div>

          {/* Testing Instructions */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <span>Testing Steps</span>
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">View Mock Doctors</h3>
                  <p className="text-sm text-gray-600">
                    Check the right sidebar → 3 test doctors with phone +918698844006
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Book Appointment</h3>
                  <p className="text-sm text-gray-600">
                    Click "Book Appointment" on any doctor card → Fill the form
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Check WhatsApp</h3>
                  <p className="text-sm text-gray-600">
                    You'll receive 2 messages on +918698844006:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1 ml-4">
                    <li>Clinic notification (booking request)</li>
                    <li>Patient confirmation</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Backend Processing</h3>
                  <p className="text-sm text-gray-600">
                    Check backend logs for appointment creation and WhatsApp delivery
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Info Cards */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Test Doctors Summary</h2>
            
            <div className="space-y-3">
              {doctors.map((doctor, index) => (
                <div 
                  key={doctor.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-teal-500 text-white rounded-lg flex items-center justify-center font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                      <p className="text-sm text-teal-600">{doctor.specialty}</p>
                      <p className="text-xs text-gray-600">{doctor.clinic_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-yellow-600 mb-1">
                      <span className="text-sm font-bold">⭐ {doctor.rating}</span>
                      <span className="text-xs text-gray-500">({doctor.reviews_count})</span>
                    </div>
                    <div className="text-xs text-gray-600">₹{doctor.consultation_fee} • {doctor.distance_km}km</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Test Controls</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className={`py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                  showSidebar
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
                    : 'bg-teal-500 hover:bg-teal-600 text-white shadow-md'
                }`}
              >
                {showSidebar ? (
                  <>
                    <span>❌</span>
                    <span>Hide Doctor Sidebar</span>
                  </>
                ) : (
                  <>
                    <span>✅</span>
                    <span>Show Doctor Sidebar</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleReload}
                className="py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reload Test Data</span>
              </button>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
            <h3 className="font-bold text-yellow-900 mb-3 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Important Notes</span>
            </h3>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li className="flex items-start space-x-2">
                {/* <span>⚠️</span> */}
                <span>This is a <strong>testing-only environment</strong>. No production files are modified.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>📱</span>
                <span>All notifications go to test WhatsApp: <strong>+918698844006</strong></span>
              </li>
              <li className="flex items-start space-x-2">
                <span>🧪</span>
                <span>Mock data is used. Real Google Maps API is bypassed.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>✅</span>
                <span>Once testing is complete, integrate booking flow into production.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Right Side - Doctor Recommendations Sidebar */}
      {showSidebar && (
        <div className="w-96 h-full bg-white shadow-2xl border-l border-gray-200">
          <DoctorRecommendations
            doctors={doctors}
            consultationId={consultationId}
            onClose={() => setShowSidebar(false)}
            isVisible={showSidebar}
            onSearch={() => toast.info('Search disabled in testing mode')}
          />
        </div>
      )}
    </div>
  );
};

export default TestingWrapper;
