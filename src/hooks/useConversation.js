/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/hooks/useConversation.js
import { useState, useCallback, useEffect, useRef } from 'react';
import * as conversationAPI from '../api/conversation.api';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for managing conversational AI consultation
 * Handles: messages, session, API calls, state management
 */
export const useConversation = (initialLocation = 'Bangalore, India') => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [conversationStage, setConversationStage] = useState('initial_greeting');
  const [shouldShowDoctorButton, setShouldShowDoctorButton] = useState(false);
  const [doctorsFound, setDoctorsFound] = useState([]);
  const [isSearchingDoctors, setIsSearchingDoctors] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);
  const [patientInfo, setPatientInfo] = useState({
    age: null,
    gender: null,
    location: initialLocation,
    medicalHistory: []
  });

  // Refs for polling and cleanup
  const statusPollIntervalRef = useRef(null);
  const abortControllerRef = useRef(new AbortController());

  // ============================================
  // SEND MESSAGE HANDLER
  // ============================================

  const sendMessage = useCallback(async (messageText, userDetails = {}) => {
    if (!messageText.trim()) {
      toast.error('Please enter a message');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Add user message to UI immediately
      const userMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: messageText,
        timestamp: new Date().toISOString(),
        type: 'user'
      };

      setMessages(prev => [...prev, userMessage]);

      // Call API
      const response = await conversationAPI.sendConversationMessage({
        message: messageText,
        session_id: sessionId,
        patient_location: patientInfo.location,
        patient_age: userDetails.age || patientInfo.age,
        patient_gender: userDetails.gender || patientInfo.gender,
        medical_history: patientInfo.medicalHistory
      });

      // Save session ID from first response
      if (!sessionId && response.session_id) {
        setSessionId(response.session_id);
        console.log('✅ Session started:', response.session_id);
      }

      // Update conversation state
      setTurnCount(response.turn_count || turnCount + 1);
      setConversationStage(response.conversation_stage || 'information_gathering');
      setShouldShowDoctorButton(response.should_show_doctor_button || false);

      // Add AI response to messages
      const assistantMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
        type: 'assistant',
        stage: response.conversation_stage,
        turnCount: response.turn_count
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If agentic analysis triggered, save results
      if (response.agentic_analysis_triggered) {
        setAnalysisResults(response.agentic_results);
        setDoctorsFound(response.doctors_found || []);
        console.log('✅ Agentic analysis completed');
        toast.success('Medical analysis complete!');
      }

      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to send message';
      setError(errorMessage);
      console.error('❌ Error sending message:', err);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, patientInfo, turnCount]);

  // ============================================
  // REQUEST DOCTOR RECOMMENDATIONS
  // ============================================

  const requestDoctors = useCallback(async () => {
    if (!sessionId) {
      toast.error('Please complete conversation first');
      return;
    }

    setIsSearchingDoctors(true);
    setError(null);

    try {
      const response = await conversationAPI.requestDoctorRecommendations(
        sessionId,
        patientInfo.location
      );

      if (response.success && response.doctors_found) {
        setDoctorsFound(response.doctors_found);
        setAnalysisResults(response);
        setConversationStage('doctor_search_completed');
        
        toast.success(`Found ${response.doctors_found.length} doctors!`);
        console.log('✅ Doctors found:', response.doctors_found.length);
        
        return response;
      } else {
        throw new Error('No doctors found');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to find doctors';
      setError(errorMessage);
      console.error('❌ Error requesting doctors:', err);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsSearchingDoctors(false);
    }
  }, [sessionId, patientInfo.location]);

  // ============================================
  // GET CONVERSATION STATUS
  // ============================================

  const getConversationStatus = useCallback(async () => {
    if (!sessionId) return null;

    try {
      const response = await conversationAPI.getConversationStatus(sessionId);
      
      return {
        currentStage: response.current_stage,
        turnCount: response.turn_count,
        symptomsCollected: response.symptoms_mentioned,
        sufficientInfo: response.sufficient_info_collected,
        doctorSearchRequested: response.doctor_search_requested,
        criticalDetected: response.critical_detected,
        summary: response.conversation_summary
      };
    } catch (err) {
      console.error('❌ Error getting status:', err);
      return null;
    }
  }, [sessionId]);

  // ============================================
  // END CONVERSATION
  // ============================================

  const endConversation = useCallback(async () => {
    if (!sessionId) return;

    try {
      await conversationAPI.endConversation(sessionId);
      
      // Clear state
      setMessages([]);
      setSessionId(null);
      setTurnCount(0);
      setConversationStage('initial_greeting');
      setShouldShowDoctorButton(false);
      setDoctorsFound([]);
      setAnalysisResults(null);
      
      console.log('✅ Conversation ended');
      toast.success('Conversation ended');
    } catch (err) {
      console.error('❌ Error ending conversation:', err);
      toast.error('Failed to end conversation');
    }
  }, [sessionId]);

  // ============================================
  // UPDATE PATIENT INFO
  // ============================================

  const updatePatientInfo = useCallback((info) => {
    setPatientInfo(prev => ({
      ...prev,
      ...info
    }));
  }, []);

  // ============================================
  // CLEAR MESSAGES
  // ============================================

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // ============================================
  // RESET CONVERSATION
  // ============================================

  const resetConversation = useCallback(async () => {
    await endConversation();
    clearMessages();
    setError(null);
  }, [endConversation, clearMessages]);

  // ============================================
  // DETECT CRITICAL SYMPTOMS
  // ============================================

  const hasCriticalSymptoms = useCallback(() => {
    const criticalKeywords = [
      'chest pain', "can't breathe", 'difficulty breathing', 'severe bleeding',
      'unconscious', 'stroke', 'heart attack', 'severe allergic'
    ];
    
    const allMessages = messages.map(m => m.content.toLowerCase()).join(' ');
    return criticalKeywords.some(keyword => allMessages.includes(keyword));
  }, [messages]);

  // ============================================
  // CLEANUP ON UNMOUNT
  // ============================================

  useEffect(() => {
    return () => {
      // Clear polling interval
      if (statusPollIntervalRef.current) {
        clearInterval(statusPollIntervalRef.current);
      }
      // Cancel any pending requests
      abortControllerRef.current.abort();
    };
  }, []);

  // ============================================
  // RETURN OBJECT
  // ============================================

  return {
    // State
    messages,
    sessionId,
    isLoading,
    turnCount,
    conversationStage,
    shouldShowDoctorButton,
    doctorsFound,
    isSearchingDoctors,
    analysisResults,
    error,
    patientInfo,
    hasCriticalSymptoms: hasCriticalSymptoms(),

    // Methods
    sendMessage,
    requestDoctors,
    getConversationStatus,
    endConversation,
    updatePatientInfo,
    clearMessages,
    resetConversation,

    // Helpers
    isConversationActive: !!sessionId,
    messageCount: messages.length,
    isReadyForDoctors: shouldShowDoctorButton,
    analysisComplete: !!analysisResults && doctorsFound.length > 0
  };
};

export default useConversation;
