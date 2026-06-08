/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Consult/ConversationalChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Loader2, 
  AlertCircle, 
  Users, 
  MapPin,
  Calendar,
  Copy,
  ChevronDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import MessageBubble from './MessageBubble';
import DoctorRecommendations from './DoctorRecommendations';
import AgenticInsights from './AgenticInsights';
import useConversation from '../../../hooks/useConversation';
import { getCurrentLocation } from './getLocation';

/**
 * Main Conversational Chat Component
 * Handles the complete chat flow with doctor recommendations
 */
const ConversationalChat = ({ initialPatientInfo = {} }) => {
  // ============================================
  // STATE & HOOKS
  // ============================================

  const conversation = useConversation(initialPatientInfo.location || 'Bangalore, India');
  
  const [inputValue, setInputValue] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [showDoctorPanel, setShowDoctorPanel] = useState(false);
  const [patientAge, setPatientAge] = useState(initialPatientInfo.age || '');
  const [patientGender, setPatientGender] = useState(initialPatientInfo.gender || 'not-specified');
  const [userLocation, setUserLocation] = useState(initialPatientInfo.location || 'Bangalore, India');
  const [showPatientForm, setShowPatientForm] = useState(!initialPatientInfo.age);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ============================================
  // EFFECTS
  // ============================================

  // Initialize patient info
  useEffect(() => {
    if (initialPatientInfo.age || initialPatientInfo.gender) {
      conversation.updatePatientInfo({
        age: initialPatientInfo.age,
        gender: initialPatientInfo.gender,
        location: userLocation
      });
      setShowPatientForm(false);
      setIsInitializing(false);
    } else {
      setIsInitializing(false);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  // Show doctor panel when button appears
  useEffect(() => {
    if (conversation.shouldShowDoctorButton) {
      setShowDoctorPanel(true);
    }
  }, [conversation.shouldShowDoctorButton]);

  // Focus input after loading
  useEffect(() => {
    if (!conversation.isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversation.isLoading]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleGetLocation = async () => {
    try {
      const location = await getCurrentLocation();
      toast.success('📍 Location accessed!');
      console.log('Location:', location);
      // In real app, convert to address
      return location;
    } catch (error) {
      toast.error('Could not access location');
      console.error(error);
    }
  };

  const handleSubmitPatientForm = (e) => {
    e.preventDefault();
    
    if (!patientAge || patientGender === 'not-specified') {
      toast.error('Please fill in all fields');
      return;
    }

    conversation.updatePatientInfo({
      age: parseInt(patientAge),
      gender: patientGender,
      location: userLocation
    });

    setShowPatientForm(false);
    toast.success('✅ Patient info saved');
    inputRef.current?.focus();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (!patientAge && !showPatientForm) {
      setShowPatientForm(true);
      toast.error('Please fill in patient information first');
      return;
    }

    const message = inputValue;
    setInputValue('');

    // Send message via hook
    await conversation.sendMessage(message, {
      age: parseInt(patientAge),
      gender: patientGender
    });
  };

  const handleRequestDoctors = async () => {
    if (conversation.isSearchingDoctors) return;
    
    const result = await conversation.requestDoctors();
    if (result) {
      setShowDoctorPanel(true);
      toast.success('🏥 Doctors found!');
    }
  };

  const handleNewConsultation = async () => {
    await conversation.resetConversation();
    setShowPatientForm(false);
    setShowDoctorPanel(false);
    setInputValue('');
    setPatientAge('');
    setPatientGender('not-specified');
    toast.success('New consultation started');
  };

  // ============================================
  // RENDER: PATIENT INFO FORM
  // ============================================

  if (showPatientForm) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to AI Doctor</h2>
          <p className="text-gray-600 mb-6">Please provide some basic information</p>

          <form onSubmit={handleSubmitPatientForm} className="space-y-4">
            {/* Age Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age *
              </label>
              <input
                type="number"
                min="1"
                max="150"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder="Enter your age"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Gender Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="not-specified">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Location Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  placeholder="Your city or area"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Use current location"
                >
                  <MapPin className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Start Consultation
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Your information is secure and only used for this consultation
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: MAIN CHAT INTERFACE
  // ============================================

  return (
    <div className="flex h-full bg-gray-50">
      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${showDoctorPanel ? 'lg:w-2/3' : 'w-full'}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                💬 AI Medical Consultation
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Turn {conversation.turnCount} • {conversation.conversationStage.split('_').join(' ')}
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-2">
              {conversation.isConversationActive && (
                <button
                  onClick={handleNewConsultation}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 font-medium"
                >
                  New Chat
                </button>
              )}

              {showDoctorPanel && (
                <button
                  onClick={() => setShowDoctorPanel(!showDoctorPanel)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                >
                  <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${showDoctorPanel ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
          {conversation.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Consultation</h3>
                <p className="text-gray-600 max-w-sm">
                  Describe your symptoms or health concerns. The AI doctor will ask follow-up questions to understand your condition better.
                </p>
              </div>
            </div>
          ) : (
            <>
              {conversation.messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isUser={msg.role === 'user'}
                  stage={msg.stage}
                  turnCount={msg.turnCount}
                  showMeta={true}
                />
              ))}

              {/* Analysis Results */}
              {conversation.analysisResults && (
                <AgenticInsights analysis={conversation.analysisResults} />
              )}

              {/* Loading indicator */}
              {conversation.isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    <span className="text-sm text-gray-600">AI Doctor is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 sm:p-6 sticky bottom-0">
          {/* Error Alert */}
          {conversation.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700">{conversation.error}</p>
            </div>
          )}

          {/* Doctor Button */}
          {conversation.shouldShowDoctorButton && !showDoctorPanel && (
            <button
              onClick={handleRequestDoctors}
              disabled={conversation.isSearchingDoctors}
              className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              {conversation.isSearchingDoctors ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Finding Doctors...</span>
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  <span>Find Nearby Doctors 🏥</span>
                </>
              )}
            </button>
          )}

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe your symptoms or concerns..."
              disabled={conversation.isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={conversation.isLoading || !inputValue.trim()}
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
              title="Send message (Ctrl+Enter)"
            >
              {conversation.isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-2">
            {inputValue.length}/500 characters
          </p>
        </div>
      </div>

      {/* Doctor Panel - Side Drawer */}
      {showDoctorPanel && (
        <div className="hidden lg:flex lg:w-1/3 border-l border-gray-200 bg-white flex-col">
          <DoctorRecommendations
            doctors={conversation.doctorsFound}
            consultationId={conversation.sessionId}
            isVisible={showDoctorPanel}
            onClose={() => setShowDoctorPanel(false)}
            analysisResults={conversation.analysisResults}
          />
        </div>
      )}

      {/* Mobile Doctor Panel Modal */}
      {showDoctorPanel && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-96 overflow-y-auto">
            <button
              onClick={() => setShowDoctorPanel(false)}
              className="sticky top-0 right-4 top-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              ✕
            </button>
            <DoctorRecommendations
              doctors={conversation.doctorsFound}
              consultationId={conversation.sessionId}
              isVisible={showDoctorPanel}
              onClose={() => setShowDoctorPanel(false)}
              analysisResults={conversation.analysisResults}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationalChat;
