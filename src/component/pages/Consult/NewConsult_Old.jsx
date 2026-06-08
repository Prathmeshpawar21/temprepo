/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Consult/NewConsult.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import {
  Send,
  Mic,
  MessageSquare,
  Paperclip,
  ImagePlus,
  X,
  AlertCircle,
  Bot,
  User,
  Volume2,
  VolumeX,
  Stethoscope,
  Activity,
  Clock,
  FileText,
  Sparkles,
  Loader2,
  Brain,
  ChevronRight,
  ChevronLeft,
  Users,
  Shield,
  TrendingUp,
  History,
  MapPin,
  Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from "../../../api/api";
import { useAuth } from '../../Authentication/AuthContext';
import { useSubscription } from '../../Authentication/SubscriptionContext';
import useUsageLimit from '../../../hooks/useUsageLimit';
import UsageLimitModal from '../../common/UsageLimitModal';
import DoctorRecommendations from './DoctorRecommendations';
import AgenticInsights from './AgenticInsights';
import { getCurrentLocation } from './getLocation';
import SubscriptionDebug from '../../Authentication/SubscriptionDebug';
import DevTools from '../../debug/DevTools';
import { motion } from 'framer-motion';
// Import conversation API
import * as conversationAPI from '../../../api/conversation.api';
import { useLocation } from 'react-router-dom'; 

/**
 * NewConsult - Conversational AI Medical Consultation
 * ✅ Pure Conversational Flow Only
 * ✅ Doctor Recommendations with Sidebar
 * ✅ Subscription Management
 */
const NewConsult = () => {
  const { user, userProfile } = useAuth();
  
  // ✅ NEW: Get resumed session from navigation
  const location = useLocation();
  const resumedSession = location.state?.resumedSession || null;
  const [showResumeIndicator, setShowResumeIndicator] = useState(false); // ✅ NEW

  // Subscription management
  const { 
    subscription, 
    usageStats, 
    canMakeApiCall, 
    getRemainingCalls, 
    isPremium,
    refreshSubscriptionData 
  } = useSubscription();
  
  const { 
    usageLimitModal, 
    handleUsageLimitError, 
    closeUsageLimitModal, 
    setRetryFunction 
  } = useUsageLimit();

  // ============================================
  // STATE: Chat
  // ============================================
  
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  
  // ============================================
  // STATE: Conversation
  // ============================================
  
  const [sessionId, setSessionId] = useState(null);
  const [turnCount, setTurnCount] = useState(0);
  const [conversationStage, setConversationStage] = useState('initial_greeting');
  const [shouldShowDoctorButton, setShouldShowDoctorButton] = useState(false);
  


  // ============================================
  // STATE: UI
  // ============================================
  
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isLoadingPrescriptions, setIsLoadingPrescriptions] = useState(true);
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(true);
  const [showDoctorSidebar, setShowDoctorSidebar] = useState(false);
  
  // ============================================
  // STATE: Audio & Files
  // ============================================
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false); // ✅ NEW - Track if AI is speaking
  const [currentAudio, setCurrentAudio] = useState(null); // ✅ NEW - Audio instance
  
  
  // ============================================
  // STATE: Medical Data
  // ============================================
  
  const [doctorRecommendations, setDoctorRecommendations] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [agenticAnalysis, setAgenticAnalysis] = useState(null);
  
  // ============================================
  // REFS
  // ============================================
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null); // ✅ NEW - Audio element reference


  const [cachedLocation, setCachedLocation] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);


  // Add these state variables with your other useState declarations
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingTimerRef = useRef(null);

  const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ============================================
  // QUICK ACTIONS
  // ============================================

  const quickActions = [
    { text: "I have a headache", icon: "🤕" },
    { text: "Feeling dizzy", icon: "😵" },
    { text: "Need to find a doctor", icon: "👨‍⚕️" },
    { text: "Stomach ache", icon: "🤢" },
  ];

  // ============================================
  // EFFECTS
  // ============================================
  useEffect(() => {
    return () => {
      // Cleanup timer on unmount
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setRetryFunction(() => handleSendMessage);
  }, [setRetryFunction]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize chat with prescription data
// ✅ ENHANCED: Initialize chat with prescription data OR resume previous chat
useEffect(() => {
  const initializeChat = async () => {
    if (!user) return;
    
    // ✅ NEW: Check if resuming from history
    if (resumedSession) {
      console.log('🔄 Resuming previous consultation:', resumedSession);
      
      try {
        setIsLoadingPrescriptions(true);
        
        // Set session ID from resumed conversation
        setSessionId(resumedSession.sessionId);
        setTurnCount(resumedSession.messages?.length || 0);
        
        // Load previous messages
        const loadedMessages = resumedSession.messages.map((msg, index) => ({
          id: (Date.now() + index).toString(),
          text: msg.content || msg.message || msg.text,
          sender: msg.role === 'user' ? 'user' : 'ai',
          timestamp: new Date(msg.timestamp || msg.created_at || Date.now()),
          stage: msg.stage,
          turnCount: msg.turn_count
        }));
        
        // Add welcome back message
        const welcomeBackMessage = {
          id: '0',
          text: `👋 Welcome back! I've loaded your previous consultation from ${new Date(resumedSession.messages[0]?.timestamp || Date.now()).toLocaleDateString()}.\n\nYou can continue from where you left off. How can I help you today?`,
          sender: 'ai',
          timestamp: new Date(),
          isGreeting: true
        };
        
        setMessages([welcomeBackMessage, ...loadedMessages]);
        setShowResumeIndicator(true);
        
        // Hide resume indicator after 5 seconds
        setTimeout(() => setShowResumeIndicator(false), 5000);
        
        console.log('✅ Loaded', loadedMessages.length, 'previous messages');
        
      } catch (error) {
        console.error('❌ Error loading resumed session:', error);
        toast.error('Failed to load previous conversation');
        
        // Fall back to normal initialization
        initializeNormalChat();
      } finally {
        setIsLoadingPrescriptions(false);
      }
      
      return; // Exit early, don't run normal initialization
    }
    
    // ✅ Normal initialization (when NOT resuming)
    initializeNormalChat();
  };
  
  // ✅ NEW: Separate function for normal chat initialization
  const initializeNormalChat = async () => {
    try {
      setIsLoadingPrescriptions(true);
      
      // Fetch prescription data
      const prescriptionResponse = await api.get('/db_mongo/prescriptions-record-extracted-from-mongo');
      const prescriptionInfo = prescriptionResponse.data;
      setPrescriptionData(prescriptionInfo);
      
      // Create personalized greeting
      const userName = user.first_name || user.name || 'there';
      let greetingMessage = `Hello ${displayName}! 👋 I'm your AI medical assistant powered by advanced conversational AI.\n\nHow can I help you today?`;
      
      if (prescriptionInfo?.prescriptions?.length > 0) {
        const latest = prescriptionInfo.prescriptions[0];
        const uploadDate = new Date(latest.upload_time).toLocaleDateString();
        greetingMessage = `Hello ${userName}! 👋 I can see your recent prescription from ${uploadDate}.\n\nHow are you feeling now? I can help analyze your symptoms and find appropriate medical care.`;
      }
      
      const initialMessages = [{
        id: '1',
        text: greetingMessage,
        sender: 'ai',
        timestamp: new Date(),
        isGreeting: true
      }];
      
      setMessages(initialMessages);
    } catch (error) {
      console.error('Error initializing chat:', error);
      const userName = user.first_name || user.name || 'there';
      setMessages([{
        id: '1',
        text: `Hello ${userName}! 👋 I'm your AI medical assistant.\n\nHow can I help you today?`,
        sender: 'ai',
        timestamp: new Date(),
        isGreeting: true
      }]);
    } finally {
      setIsLoadingPrescriptions(false);
    }
  };

  initializeChat();
}, [user, resumedSession]); // ✅ CHANGED: Added resumedSession dependency


  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  // ✅ DEBUG: Track state changes
  useEffect(() => {
    console.log('🔍 State Update:', {
      sessionId,
      turnCount,
      conversationStage,
      shouldShowDoctorButton,
      hasDoctors: !!doctorRecommendations,
      doctorCount: doctorRecommendations?.length || 0,
      showDoctorSidebar
    });
  }, [sessionId, turnCount, conversationStage, shouldShowDoctorButton, doctorRecommendations, showDoctorSidebar]);


  useEffect(() => {
    const fetchLocationOnce = async () => {
      if (cachedLocation || isLocationLoading) return;
      
      setIsLocationLoading(true);
      try {
        const loc = await getCurrentLocation();
        const locationString = `${loc.latitude},${loc.longitude}`;
        setCachedLocation(locationString);
        console.log('📍 Location cached:', locationString);
      } catch (err) {
        console.error('📍 Location fetch failed, using default:', err);
        setCachedLocation('Bangalore, India');
      } finally {
        setIsLocationLoading(false);
      }
    };

    fetchLocationOnce();
  }, []);

// ============================================
// CLEANUP: Audio on unmount
// ============================================

useEffect(() => {
  return () => {
    // Stop and cleanup audio on component unmount
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };
}, [currentAudio]);




// Add after line 42 (where you get resumedSession)
useEffect(() => {
  if (resumedSession) {
    console.log('🔍 Resumed Session Data:', {
      sessionId: resumedSession.sessionId,
      messageCount: resumedSession.messages?.length,
      consultationId: resumedSession.consultationId,
      isResumed: resumedSession.isResumed
    });
  }
}, [resumedSession]);

// ============================================
// HANDLER: Send Message (OPTIMIZED FOR SPEED)
// ============================================

  // Helper function to extract display name
  const getDisplayName = () => {
    if (userProfile?.first_name) return userProfile.first_name;
    if (user?.first_name) return user.first_name;
    if (userProfile?.full_name) return userProfile.full_name.split(' ')[0];
    if (user?.full_name) return user.full_name.split(' ')[0];
    
    if (user?.email) {
      const namePart = user.email.split('@')[0];
      const cleanName = namePart.replace(/[0-9_.-]/g, '');
      if (cleanName.length > 0) {
        return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      }
    }
    
    return 'Patient';
  };
  
  const displayName = getDisplayName();


const handleSendMessage = async () => {
  if (!message.trim() && files.length === 0 && !audioBlob) return;
  
  // Check usage limits FIRST (instant check)
  if (!canMakeApiCall()) {
    toast.warning('Usage limit reached. Upgrade to continue.');
    handleUsageLimitError({
      response: {
        status: 429,
        data: {
          success: false,
          error: 'Usage limit exceeded',
          message: `Monthly API call limit (${subscription?.plan?.monthly_api_calls || 5}) exceeded`,
          usage_info: {
            current_plan: subscription?.plan?.display_name || 'Free Plan',
            current_calls: usageStats?.current_month_calls || 0,
            limit: subscription?.plan?.monthly_api_calls || 2,
          },
          error_code: 'USAGE_LIMIT_EXCEEDED'
        }
      }
    });
    return;
  }

  // ✅ STEP 1: IMMEDIATE UI UPDATE (Optimistic)
  const messageText = message || "Voice message";
  const messageId = Date.now().toString();
  
  const newMessage = {
    id: messageId,
    text: messageText,
    sender: 'user',
    timestamp: new Date(),
    files: files.length > 0 ? [...files] : undefined,
  };

  // ✅ Show user message INSTANTLY (before any async operations)
  setMessages(prev => [...prev, newMessage]);
  
  // ✅ Clear input and update UI state
  setMessage('');
  setFiles([]);
  setShowQuickActions(false);
  setIsTyping(true);
  
  // ✅ Smooth scroll happens immediately
  setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

  // ✅ STEP 2: Background processing (non-blocking)
  setIsProcessing(true);

  try {
    // ✅ PARALLEL OPERATIONS: Fetch location and medical history simultaneously
    console.log('🔄 Starting parallel operations...');
    
    const [userLocation, medicalHistory] = await Promise.all([
      // Location (with fast fallback)
      getCurrentLocation()
        .then(loc => {
          const locationString = `${loc.latitude},${loc.longitude}`;
          console.log('📍 Location fetched:', locationString);
          return locationString;
        })
        .catch((err) => {
          console.log('📍 Location fetch failed, using default:', err.message);
          return 'Bangalore, India';
        }),
      
      // Medical history preparation (immediate)
      Promise.resolve().then(() => {
        const history = [];
        if (prescriptionData?.prescriptions?.length > 0) {
          prescriptionData.prescriptions.forEach((prescription, index) => {
            const diseases = prescription.llm_diseases || [];
            const medicines = prescription.llm_medicines || [];
            
            if (diseases.length > 0) {
              history.push(`Prescription ${index + 1} - Diagnosed conditions: ${diseases.join(', ')}`);
            }
            if (medicines.length > 0) {
              history.push(`Prescription ${index + 1} - Medications: ${medicines.join(', ')}`);
            }
          });
        }
        console.log('📋 Medical history prepared:', history.length, 'entries');
        return history;
      })
    ]);

    // ✅ STEP 3: Prepare API payload
    const payload = {
      message: messageText,
      session_id: sessionId || null,
      patient_location: userLocation,
      patient_age: userProfile?.age || null,
      patient_gender: userProfile?.gender || null,
      medical_history: medicalHistory
    };

    console.log('📤 Sending API request with payload:', {
      message: messageText.substring(0, 50) + '...',
      session_id: sessionId,
      location: userLocation,
      historyCount: medicalHistory.length
    });

    // ✅ STEP 4: API Call
    const response = await conversationAPI.sendConversationMessage(payload);

    console.log('📥 API Response received:', {
      hasMessage: !!response.message,
      sessionId: response.session_id,
      turnCount: response.turn_count,
      stage: response.conversation_stage,
      hasDoctors: !!response.doctors_found,
      hasAnalysis: !!response.agentic_results
    });

    // ✅ STEP 5: Update state with response
    // Save session ID if new
    if (!sessionId && response.session_id) {
      setSessionId(response.session_id);
      console.log('✅ Session ID saved:', response.session_id);
    }

    // Update conversation state
    setTurnCount(response.turn_count || turnCount + 1);
    setConversationStage(response.conversation_stage || 'information_gathering');
    setShouldShowDoctorButton(response.should_show_doctor_button || false);

    console.log('📊 State updated:', {
      newTurn: response.turn_count,
      newStage: response.conversation_stage,
      showButton: response.should_show_doctor_button
    });

    // ✅ STEP 6: Create AI response message
    const aiResponse = {
      id: (Date.now() + 1).toString(),
      text: response.message || "I'm processing your request...",
      sender: 'ai',
      timestamp: new Date(),
      stage: response.conversation_stage,
      turnCount: response.turn_count
    };

    // ✅ Handle doctor recommendations
    if (response.doctors_found && Array.isArray(response.doctors_found) && response.doctors_found.length > 0) {
      console.log('🏥 Doctors found:', response.doctors_found.length);
      setDoctorRecommendations(response.doctors_found);
      setShowDoctorSidebar(true);
      toast.success(`🏥 Found ${response.doctors_found.length} doctors near you!`);
    }

    // ✅ Handle agentic analysis
    if (response.agentic_analysis_triggered || response.agentic_results) {
      console.log('🧠 Agentic analysis received');
      setAgenticAnalysis(response.agentic_results);
      aiResponse.hasAnalysis = true;
      aiResponse.analysisData = response.agentic_results;
      toast.success('🧠 Medical analysis complete!');
    }

    // ✅ Add AI response to messages
    setMessages(prev => [...prev, aiResponse]);
    console.log('✅ AI response added to messages');

    // ✅ STEP 7: Background operations (non-blocking)
    // Refresh subscription data in background
    refreshSubscriptionData().catch(err => 
      console.warn('⚠️ Subscription refresh failed:', err)
    );

// ✅ STEP 7: Play AI voice response (HIGH QUALITY)
if (aiVoiceEnabled) {
  // Small delay to ensure message is rendered first
  setTimeout(() => {
    playAIResponse(aiResponse.text);
  }, 300);
}



  } catch (error) {
    // ✅ ENHANCED ERROR LOGGING
    console.error('❌ Send message error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      stack: error.stack
    });
    
    // Check if it's a usage limit error
    const isUsageLimitError = handleUsageLimitError(error);
    
    if (!isUsageLimitError) {
      // Handle specific error types
      let errorToast = 'Failed to send message. Please try again.';
      let errorText = "I apologize, but I'm experiencing technical difficulties. Please try again or contact support if this persists.";
      
      if (error.response?.status === 422) {
        errorToast = 'Invalid data format. Please try again.';
        errorText = "There was an issue with the message format. Please try rephrasing your question.";
      } else if (error.response?.status === 500) {
        errorToast = 'Server error. Please try again in a moment.';
        errorText = "Our servers are experiencing issues. Please try again in a few moments.";
      } else if (error.response?.status === 401) {
        errorToast = 'Authentication error. Please log in again.';
        errorText = "Your session has expired. Please log in again to continue.";
        // Auto-logout after 3 seconds
        setTimeout(() => {
          // window.location.href = '/authentication';
          window.location.href = '/login';
        }, 3000);
      } else if (!error.response) {
        errorToast = 'Network error. Check your connection.';
        errorText = "Unable to connect to the server. Please check your internet connection.";
      }
      
      toast.error(errorToast);
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        sender: 'ai',
        timestamp: new Date(),
        isError: true,
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  } finally {
    // ✅ Clean up (always runs)
    setIsProcessing(false);
    setIsTyping(false);
    setAudioBlob(null);
    console.log('🏁 Send message completed');
  }
};

// ============================================
// VOICE FUNCTIONS
// ============================================

/**
 * Play AI response using OpenAI TTS
 */
const playAIResponse = async (text) => {
  if (!aiVoiceEnabled || !text) return;
  
  try {
    setIsSpeaking(true);
    
    // Clean markdown formatting from text
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\n/g, ' ')
      .replace(/#{1,6}\s/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '') // Remove markdown links
      .trim();
    
    if (cleanText.length === 0) {
      setIsSpeaking(false);
      return;
    }
    
    console.log('🎤 Requesting TTS for:', cleanText.substring(0, 50) + '...');
    
    // Call backend TTS endpoint
    const response = await api.post(
      '/agentic/conversation/text-to-speech',
      { text: cleanText },
      { 
        responseType: 'blob',
        timeout: 30000 // 30 second timeout
      }
    );
    
    // Create audio from blob
    const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    
    // Create and play new audio
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setCurrentAudio(audio);
    
    audio.onended = () => {
      setIsSpeaking(false);
      URL.revokeObjectURL(audioUrl);
      console.log('✅ Audio playback finished');
    };
    
    audio.onerror = (error) => {
      console.error('❌ Audio playback error:', error);
      setIsSpeaking(false);
      toast.error('Voice playback failed');
    };
    
    await audio.play();
    console.log('🔊 Playing AI voice...');
    
  } catch (error) {
    console.error('❌ TTS Error:', error);
    setIsSpeaking(false);
    
    // Fallback to browser TTS if backend fails
    if ('speechSynthesis' in window) {
      console.log('⚠️ Falling back to browser TTS');
      const utterance = new SpeechSynthesisUtterance(
        text.replace(/\*\*/g, '').replace(/\n/g, ' ')
      );
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }
};

/**
 * Stop current audio playback
 */
const stopSpeaking = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    setIsSpeaking(false);
    console.log('🔇 Audio stopped');
  }
  
  // Also stop browser TTS if active
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  
  toast.success('Voice stopped');
};

/**
 * Toggle voice mode
 */
const toggleVoice = () => {
  const newState = !aiVoiceEnabled;
  setAiVoiceEnabled(newState);
  
  if (!newState) {
    stopSpeaking();
    toast.success('🔇 AI Voice Disabled', {
      icon: '🔇',
      style: {
        background: '#fee2e2',
        color: '#991b1b',
      }
    });
  } else {
    toast.success('🔊 AI Voice Enabled', {
      icon: '🔊',
      style: {
        background: '#d1fae5',
        color: '#065f46',
      }
    });
  }
};


  // ============================================
  // HANDLERS: Other
  // ============================================

  const handleGetConsultationHistory = async () => {
    try {
      const response = await api.get(`/agentic/consultation-history/${user.keycloak_id}?limit=5&include_details=true`);
      if (response.data) {
        console.log('📜 Consultation history:', response.data);
        toast.success('Consultation history loaded');
      }
    } catch (error) {
      console.error('History error:', error);
      toast.error('Failed to load consultation history');
    }
  };

  const handleQuickAction = (actionText) => {
    setMessage(actionText);
    setShowQuickActions(false);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleNewChat = () => {
    console.log('🔄 Starting new chat...');
    setMessages([]);
    setDoctorRecommendations(null);
    setAgenticAnalysis(null);
    setShowQuickActions(true);
    setSessionId(null);
    setTurnCount(0);
    setConversationStage('initial_greeting');
    setShouldShowDoctorButton(false);
    setShowDoctorSidebar(false);
    
    const userName = user.first_name || user.name || 'there';
    setMessages([{
      id: '1',
      text: `Hello ${userName}! 👋 I'm your AI medical assistant.\n\nHow can I help you today?`,
      sender: 'ai',
      timestamp: new Date(),
      isGreeting: true
    }]);
    
    toast.success('New consultation started');
  };

// Audio recording
const startRecording = () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      
      recorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
        
        // ✅ Clear timer when recording stops
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
      };
      
      recorder.start();
      setIsRecording(true);
      
      // ✅ Start duration timer
      setRecordingDuration(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      toast.success('🎤 Recording started');
    })
    .catch(err => {
      console.error("Microphone access denied:", err);
      toast.error("Microphone access required for voice recording");
    });
};


const stopRecording = () => {
  if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    
    // ✅ Clear timer
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    toast.success('🎤 Recording stopped');
  }
};



  // File handling
  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
        size: (file.size / 1024).toFixed(1) + ' KB',
        raw: file,
      }));
      setFiles(prev => [...prev, ...newFiles]);
      toast.success(`📎 ${newFiles.length} file(s) attached`);
    }
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    toast.success('📎 File removed');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
      {/* Header - Mobile Responsive */}
      <div className="bg-white border-b border-gray-200 p-3 sm:p-4 lg:p-6">


        {/* ✅ NEW: Resume Indicator Banner */}
{showResumeIndicator && resumedSession && (
  <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: 'auto', opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    className="bg-gradient-to-r from-teal-50 to-blue-50 border-b border-teal-200 px-3 sm:px-4 lg:px-6 py-2 sm:py-3"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="p-1.5 sm:p-2 bg-teal-100 rounded-lg">
          <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />
        </div>
        <div>
          <p className="text-xs sm:text-sm font-semibold text-teal-900">
            📋 Consultation Resumed
          </p>
          <p className="text-[10px] sm:text-xs text-teal-700">
            Loaded {resumedSession.messages?.length || 0} previous messages • 
            Session ID: {resumedSession.sessionId?.slice(0, 8)}...
          </p>
        </div>
      </div>
      <button
        onClick={() => setShowResumeIndicator(false)}
        className="p-1 text-teal-600 hover:text-teal-800 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  </motion.div>
)}


        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          {/* Left Side - Title & Status */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-teal-500 rounded-lg flex-shrink-0">
              <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 truncate">
                AI Medical Consultation
              </h1>
           <div className="flex items-center space-x-2 sm:space-x-3">
  <p className="text-xs sm:text-sm text-gray-500 flex items-center mt-0.5 sm:mt-1 truncate">
    <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-green-500 flex-shrink-0" />
    <span className="truncate">
      {isSpeaking
        ? "🔊 AI Speaking..."
        : isLoadingPrescriptions 
          ? "Loading..." 
          : isProcessing 
            ? "AI analyzing..." 
            : `${conversationStage.split('_').join(' ')}`
      }
    </span>
  </p>
  
  {/* ✅ Voice Mode Badge */}
  {aiVoiceEnabled && (
    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ring-1 ring-green-200">
      <Volume2 className="h-3 w-3 mr-1" />
      Voice ON
    </span>
  )}
</div>

            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3 lg:space-x-4">
            {/* Usage Display - Compact on Mobile */}
            <div className={`flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm ${
              canMakeApiCall() 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-medium truncate block">
                  {subscription?.plan?.monthly_api_calls === 0 
                    ? 'Unlimited' 
                    : `${getRemainingCalls()} left`
                  }
                </span>
                <div className="text-[10px] sm:text-xs opacity-75 hidden sm:block">
                  {subscription?.plan?.display_name || 'Free Plan'}
                </div>
              </div>
              {!canMakeApiCall() && (
                <button
                  onClick={() => window.location.href = '/upgrade'}
                  className="ml-1 sm:ml-2 text-[10px] sm:text-xs bg-red-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-medium hover:bg-red-700 flex-shrink-0"
                >
                  Upgrade
                </button>
              )}
            </div>



{/* ✅ ENHANCED VOICE TOGGLE BUTTON */}
<div className="flex items-center space-x-2">
  <button
    onClick={toggleVoice}
    className={`relative p-1.5 sm:p-2 rounded-lg transition-all duration-200 shadow-sm ${
      aiVoiceEnabled 
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 hover:from-green-100 hover:to-emerald-100 ring-1 ring-green-200' 
        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
    } ${isSpeaking ? 'ring-2 ring-green-400 ring-offset-2' : ''}`}
    title={aiVoiceEnabled ? "AI Voice ON (Click to disable)" : "AI Voice OFF (Click to enable)"}
  >
    {aiVoiceEnabled ? (
      <Volume2 className={`h-4 w-4 sm:h-5 sm:w-5 ${isSpeaking ? 'animate-pulse' : ''}`} />
    ) : (
      <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
    )}
    
    {/* Speaking Indicator Dot */}
    {isSpeaking && (
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </span>
    )}
  </button>

  {/* ✅ STOP SPEAKING BUTTON (shows when speaking) */}
  {isSpeaking && (
    <button
      onClick={stopSpeaking}
      className="p-1.5 sm:p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 animate-pulse ring-1 ring-red-200"
      title="Stop speaking"
    >
      <X className="h-4 w-4 sm:h-5 sm:w-5" />
    </button>
  )}
</div>


            
            <button
              onClick={handleNewChat}
              className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center space-x-1 sm:space-x-2"
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">New Chat</span>
              <span className="text-xs sm:text-sm font-medium sm:hidden">New</span>
            </button>
          </div>
        </div>
      </div>

      {/* Usage Warning Banner - Mobile Responsive */}
      {!canMakeApiCall() && (
        <div className="bg-red-50 border-b border-red-200 px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-medium text-red-800">Usage Limit Reached</h3>
                <p className="text-[10px] sm:text-xs text-red-600 mt-0.5">
                  You've used all {subscription?.plan?.monthly_api_calls || 5} consultations this month. 
                  Upgrade for unlimited access.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 ml-6 sm:ml-0">
              <button
                onClick={() => window.location.href = '/subscription'}
                className="text-xs bg-red-100 text-red-800 px-2 sm:px-3 py-1 rounded font-medium hover:bg-red-200 whitespace-nowrap"
              >
                View Usage
              </button>
              <button
                onClick={() => window.location.href = '/upgrade'}
                className="text-xs bg-red-600 text-white px-2 sm:px-3 py-1 rounded font-medium hover:bg-red-700 whitespace-nowrap"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        {/* Chat Container - Mobile Responsive */}
        <div className={`
          flex flex-col bg-white mx-2 sm:mx-3 lg:mx-4 my-2 sm:my-3 lg:my-4 rounded-lg border border-gray-200 overflow-hidden 
          ${doctorRecommendations && showDoctorSidebar 
            ? 'flex-1 mr-1 sm:mr-2' 
            : 'w-full mr-2 sm:mr-3 lg:mr-4'
          }
        `}>

          {/* Processing Indicator - Mobile Compact */}
          {isProcessing && (
            <div className="bg-blue-50 border-b border-blue-200 p-2 sm:p-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 animate-pulse flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-blue-800 truncate">AI Processing...</p>
                  <p className="text-[10px] sm:text-xs text-blue-600 hidden sm:block">Analyzing symptoms</p>
                </div>
              </div>
            </div>
          )}

          {/* Messages Area - Mobile Optimized Padding */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Loading State */}
            {isLoadingPrescriptions && messages.length === 0 && (
              <div className="flex items-center justify-center py-8 sm:py-12">
                <div className="text-center">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-teal-500 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-gray-600">Loading your medical history...</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Preparing personalized consultation</p>
                </div>
              </div>
            )}

            {/* Messages - Mobile Optimized */}
            {messages.map(msg => (
              <div key={msg.id}>
                <div className={`flex items-start space-x-2 sm:space-x-3 ${
                  msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {/* Avatar - Smaller on Mobile */}
                  <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${
                    msg.sender === 'user'
                      ? 'bg-blue-500'
                      : msg.isError 
                        ? 'bg-red-500'
                        : msg.hasAnalysis
                          ? 'bg-indigo-500'
                          : msg.isGreeting
                            ? 'bg-green-500'
                            : 'bg-teal-500'
                  }`}>
                    {msg.sender === 'user' ? (
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                    ) : msg.hasAnalysis ? (
                      <Brain className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                    ) : msg.isGreeting ? (
                      <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                    ) : (
                      <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                    )}
                  </div>

                  {/* Message Content - Responsive Width */}
                  <div className={`flex-1 max-w-[85%] sm:max-w-[80%] ${
                    msg.sender === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`inline-block px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm lg:text-base ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : msg.isError
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : msg.hasAnalysis
                            ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                            : msg.isGreeting
                              ? 'bg-green-50 text-green-800 border border-green-200'
                              : 'bg-gray-50 text-gray-800 border border-gray-200'
                    } ${msg.sender === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
                      
                      {/* File attachments - Compact */}
                      {msg.files?.length > 0 && (
                        <div className="mb-2 sm:mb-3 space-y-1 sm:space-y-2">
                          {msg.files.map(file => (
                            <div key={file.id} className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm opacity-90">
                              <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span className="truncate">{file.name}</span>
                              <span className="text-[10px] sm:text-xs flex-shrink-0">({file.size})</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Stage info */}
                      {/* {msg.stage && (
                        <div className="text-[10px] sm:text-xs opacity-75 mb-1">
                          Turn {msg.turnCount} • {msg.stage.split('_').join(' ')}
                        </div>
                      )} */}
{/* 
                      <ReactMarkdown
                        components={{
                          p: ({ node, ...props }) => (
                            <p className="leading-relaxed mb-2 last:mb-0" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc list-inside mb-2 space-y-1" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="ml-2" {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong className="font-semibold" {...props} />
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown> */}


                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ ...props }) => (
                        <p className="leading-relaxed mb-2 last:mb-0" {...props} />
                      ),
                      ul: ({ ...props }) => (
                        <ul className="list-disc list-inside mb-2 space-y-1" {...props} />
                      ),
                      li: ({ ...props }) => (
                        <li className="ml-2" {...props} />
                      ),
                      strong: ({ ...props }) => (
                        <strong className="font-semibold" {...props} />
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>



                      {/* ✅ SPEAKING INDICATOR for AI messages */}
{msg.sender === 'ai' && isSpeaking && messages[messages.length - 1].id === msg.id && (
  <div className="mt-2 sm:mt-3 flex items-center space-x-2 px-2 py-1.5 bg-green-50 rounded-md border border-green-200 animate-pulse">
    <div className="flex space-x-1">
      <div className="w-1 h-3 bg-green-500 rounded-full animate-bounce"></div>
      <div className="w-1 h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
      <div className="w-1 h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      <div className="w-1 h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
    </div>
    <span className="text-xs sm:text-sm font-medium text-green-700">
      🔊 AI Speaking...
    </span>
  </div>
)}


                    </div>
                    {/* <div className={`flex items-center space-x-1.5 sm:space-x-2 mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-500 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                      <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span>{msg.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}</span>
                    </div> */}
                    

                  </div>
                </div>

                {/* Agentic Analysis Insights */}
                {msg.sender === 'ai' && msg.analysisData && (
                  <div className="mt-3 sm:mt-4">
                    <AgenticInsights analysis={msg.analysisData} />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator - Compact */}
            {isTyping && (
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg rounded-bl-sm px-3 sm:px-4 py-2 sm:py-3">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* File Upload Preview - Mobile Grid */}
          {files.length > 0 && (
            <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <p className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                  <Paperclip className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  Attached Files ({files.length})
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                {files.map(file => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg border border-gray-200 group hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                      <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg flex-shrink-0">
                        <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 ml-2"
                    >
                      <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input Area - Mobile Optimized */}
          <div className="p-3 sm:p-4 lg:p-6 bg-white border-t border-gray-200">
            {/* Doctor Button - Full Width */}
            {shouldShowDoctorButton && (
              <button
                onClick={() => {
                  setMessage('Yes, please find doctors for me');
                  setTimeout(() => handleSendMessage(), 100);
                }}
                className="w-full mb-3 sm:mb-4 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg text-sm sm:text-base font-medium hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Find Nearby Doctors 🏥</span>
              </button>
            )}

            <div className="flex items-end space-x-2 sm:space-x-3 lg:space-x-4">
              {/* File Upload Buttons - Compact */}
              <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                <label className={`p-1.5 sm:p-2 rounded-lg cursor-pointer transition-colors ${
                  canMakeApiCall()
                    ? 'text-gray-500 hover:text-teal-600 hover:bg-teal-50'
                    : 'text-gray-300 cursor-not-allowed'
                }`}>
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    onChange={handleFileUpload} 
                    disabled={!canMakeApiCall()}
                  />
                  <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
                </label>
                
                <label className={`p-1.5 sm:p-2 rounded-lg cursor-pointer transition-colors ${
                  canMakeApiCall()
                    ? 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                    : 'text-gray-300 cursor-not-allowed'
                }`}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    onChange={handleFileUpload}
                    disabled={!canMakeApiCall()}
                  />
                  <ImagePlus className="h-4 w-4 sm:h-5 sm:w-5" />
                </label>
              </div>
              








{/* Message Input Area Container */}
<div className="flex-1 flex flex-col space-y-2">
  {/* Voice Recording Attached Preview - Above Input */}
  {audioBlob && !isRecording && (
    <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-2.5 sm:p-3 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center space-x-2.5">
        {/* Play Preview Button */}
        {/* <button
          onClick={() => {
            const audio = new Audio(URL.createObjectURL(audioBlob));
            audio.play();
          }}
          className="h-9 w-9 sm:h-10 sm:w-10 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
          title="Play preview"
        >
          <svg className="h-4 w-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button> */}
        
        {/* Recording Info */}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <Mic className="h-3.5 w-3.5 text-purple-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-purple-900">
              Voice Recording
            </span>
            {recordingDuration > 0 && (
              <span className="text-xs text-purple-700 font-mono bg-purple-200 px-2 py-0.5 rounded-full">
                {formatDuration(recordingDuration)}
              </span>
            )}
            <span className="text-xs text-green-700 font-medium bg-green-100 px-2 py-0.5 rounded-full flex items-center">
              <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              Ready
            </span>
          </div>
          
          {/* Waveform Animation */}
          {/* <div className="flex items-center space-x-0.5 h-6">
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="w-0.5 bg-purple-400 rounded-full"
                style={{
                  height: `${Math.random() * 16 + 8}px`,
                  animation: `pulse 1.5s ease-in-out infinite`,
                  animationDelay: `${i * 0.05}s`
                }}
              ></div>
            ))}
          </div> */}
          
        </div>
        
        {/* Remove Recording Button */}
        <button
          onClick={() => {
            setAudioBlob(null);
            setRecordingDuration(0);
            setMessage('');
            toast.info('Recording removed');
          }}
          className="p-2 rounded-lg bg-purple-200 text-purple-700 hover:bg-red-100 hover:text-red-700 transition-all duration-200 flex-shrink-0 group"
          title="Remove recording"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )}
  
  {/* Text Input Area */}
  <div className="relative">
    <textarea
      ref={textareaRef}
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={
        audioBlob 
          ? "Add a message (optional)..."
          : canMakeApiCall() 
            ? "Describe your symptoms..."
            : "Upgrade to continue..."
      }
      className={`w-full border rounded-lg py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 resize-none transition-all duration-200 bg-white ${
        canMakeApiCall()
          ? 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
          : 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-400'
      }`}
      rows="1"
      style={{ minHeight: '44px', maxHeight: '100px' }}
      disabled={isLoadingPrescriptions || isProcessing || !canMakeApiCall()}
    />
    
    {/* Recording in Progress Indicator - Top Right Corner */}
    {isRecording && (
      <div className="absolute top-2 sm:top-3 right-3 sm:right-4 flex items-center bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg animate-pulse mr-4">
        <div className="relative flex items-center mr-2">
          <div className="h-2 w-2 bg-white rounded-full"></div>
          <div className="absolute h-2 w-2 bg-white rounded-full animate-ping"></div>
        </div>
        <span className="font-mono font-semibold">
          {recordingDuration > 0 ? formatDuration(recordingDuration) : 'REC'}
        </span>
      </div>
    )}
  </div>
</div>












              {/* Voice & Send Buttons - Enhanced Recording UI */}
            <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                    canMakeApiCall()
                      ? 'text-gray-500 hover:text-purple-600 hover:bg-purple-50 hover:scale-110'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                  title="Start voice recording"
                  disabled={isLoadingPrescriptions || isProcessing || !canMakeApiCall()}
                >
                  <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              ) : (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {/* Stop Recording Button */}
                  <button
                    onClick={stopRecording}
                    className="p-1.5 sm:p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl relative group"
                    title="Stop recording"
                  >
                    {/* Stop Square Icon */}
                    <div className="h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                      <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 bg-white rounded-sm"></div>
                    </div>
                    
                    {/* Pulse Ring Animation */}
                    <span className="absolute inset-0 rounded-lg bg-red-500 animate-ping opacity-40"></span>
                    
                    {/* Tooltip */}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Stop Recording
                    </span>
                  </button>
                  
                  {/* Cancel Recording Button */}
                  <button
                    onClick={() => {
                      stopRecording();
                      setAudioBlob(null);
                      setMessage('');
                    }}
                    className="p-1.5 sm:p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all duration-200 relative group"
                    title="Cancel recording"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    
                    {/* Tooltip */}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Cancel
                    </span>


                  </button>
                </div>
              )}
              
              <button
                onClick={handleSendMessage}
                disabled={(!message.trim() && files.length === 0 && !audioBlob) || isLoadingPrescriptions || isProcessing || !canMakeApiCall()}
                className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                  (message.trim() || files.length > 0 || audioBlob) && !isLoadingPrescriptions && !isProcessing && canMakeApiCall()
                    ? 'bg-teal-500 text-white hover:bg-teal-600 shadow-md hover:shadow-lg hover:scale-110'
                    : 'text-gray-400 cursor-not-allowed bg-gray-100'
                }`}
                title="Send message (Enter)"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>







            </div>
            
            {/* Health Disclaimer - Compact on Mobile */}
            <div className="mt-3 sm:mt-4 flex items-start space-x-2 sm:space-x-3 p-2.5 sm:p-3 lg:p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-800">
                <p className="font-medium mb-0.5 sm:mb-1">Medical Disclaimer</p>
                <p className="text-[10px] sm:text-xs leading-relaxed">
                  This AI assistant uses advanced conversational AI for personalized guidance but cannot replace professional diagnosis. 
                  For emergencies, contact emergency services immediately.
                </p>
              </div>
            </div>
          </div>



        </div>

        {/* Toggle Button - Mobile Optimized */}
        {doctorRecommendations && doctorRecommendations.length > 0 && (
          <button
            onClick={() => {
              console.log('🔘 Toggle button clicked', !showDoctorSidebar);
              setShowDoctorSidebar(!showDoctorSidebar);
            }}
            className={`
              absolute top-1/2 transform -translate-y-1/2 z-50 bg-teal-600 hover:bg-teal-700 
              text-white p-2 sm:p-3 rounded-l-lg shadow-lg transition-all duration-300
              ${showDoctorSidebar ? 'right-64 sm:right-80 lg:right-96' : 'right-0'}
            `}
            title={showDoctorSidebar ? 'Hide doctors' : 'Show doctors'}
          >
            {showDoctorSidebar ? (
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <div className="flex flex-col items-center">
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 sm:mt-1" />
                <span className="text-[10px] sm:text-xs font-bold bg-white bg-opacity-20 rounded-full px-1 sm:px-1.5 py-0.5 mt-0.5 sm:mt-1">
                  {doctorRecommendations.length}
                </span>
              </div>
            )}
          </button>
        )}

        {/* Doctor Recommendations Sidebar - Mobile Responsive */}
        {doctorRecommendations && doctorRecommendations.length > 0 && showDoctorSidebar && (
          <div className="w-64 sm:w-80 lg:w-96 bg-white shadow-lg border-l border-gray-300 my-2 sm:my-3 lg:my-4 mr-2 sm:mr-3 lg:mr-4 rounded-lg overflow-hidden transition-all duration-300 ease-in-out">
            <DoctorRecommendations 
              doctors={doctorRecommendations}
              consultationId={sessionId}
              onClose={() => {
                console.log('🚪 Closing doctor sidebar');
                setShowDoctorSidebar(false);
              }}
              isVisible={showDoctorSidebar}
              onToggle={() => setShowDoctorSidebar(!showDoctorSidebar)}
            />
          </div>
        )}
      </div>

      {/* Usage Limit Modal */}
      <UsageLimitModal
        isOpen={usageLimitModal.isOpen}
        onClose={closeUsageLimitModal}
        usageInfo={usageLimitModal.usageInfo}
        upgradeOptions={usageLimitModal.upgradeOptions}
        onRetry={usageLimitModal.onRetry}
      />

      {/* Debug Tools (Development) */}
      {process.env.NODE_ENV === 'development' && (
        <>
          {/* <SubscriptionDebug /> */}
          {/* <DevTools /> */}
        </>
      )}

      {/* Hidden Audio Element for Playback */}
<audio ref={audioRef} className="hidden" />


    </div>
  );


};



export default NewConsult;
