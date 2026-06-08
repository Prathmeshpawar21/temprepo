/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  Mic, 
  Paperclip, 
  X, 
  Minimize2,
  Maximize2,
  User,
  Activity,
  Heart,
  Sparkles,
  MessageCircle,
  Clock,
  CheckCheck,
  AlertCircle,
  Loader2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Image,
  FileText,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../Authentication/AuthContext';

const ChatBot = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const endOfMessagesRef = useRef(null);
  const inputRef = useRef(null);

  const quickActions = [
    { 
      text: "Check my symptoms", 
      icon: <Heart className="w-4 h-4" />,
      action: () => handleQuickAction("I'd like to check my symptoms")
    },
    { 
      text: "Medication reminder", 
      icon: <Clock className="w-4 h-4" />,
      action: () => handleQuickAction("Set up a medication reminder")
    },
    { 
      text: "Book appointment", 
      icon: <Activity className="w-4 h-4" />,
      action: () => handleQuickAction("I want to book an appointment")
    },
    { 
      text: "Health tips", 
      icon: <Sparkles className="w-4 h-4" />,
      action: () => handleQuickAction("Give me some health tips")
    }
  ];

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: `Hello ${user?.name || 'there'}! 👋 I'm MediCare AI, your intelligent medical assistant. I'm here to help you with health questions, appointment scheduling, medication reminders, and more. How can I assist you today?`,
          sender: 'ai',
          timestamp: new Date(),
          type: 'greeting'
        },
      ]);
    }
  }, [user, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickAction = (actionText) => {
    setInput(actionText);
    setShowQuickActions(false);
    setTimeout(() => {
      handleSubmit(null, actionText);
    }, 100);
  };

  const handleSubmit = (e, quickActionText = null) => {
    if (e) e.preventDefault();
    const messageText = quickActionText || input.trim();
    if (messageText === '') return;

    const userMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setShowQuickActions(false);

    // Simulate AI response with more realistic delay and responses
    setTimeout(() => {
      const responses = getContextualResponse(messageText);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: responses,
        sender: 'ai',
        timestamp: new Date(),
        suggestions: getFollowUpSuggestions(messageText)
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, Math.random() * 1000 + 1500); // 1.5-2.5 second delay
  };

  const getContextualResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('symptom') || input.includes('sick') || input.includes('pain')) {
      return "I understand you're experiencing some symptoms. To provide the best assistance, could you describe:\n\n• What specific symptoms are you experiencing?\n• When did they start?\n• How severe are they on a scale of 1-10?\n\nPlease remember that while I can provide general guidance, it's important to consult with a healthcare professional for proper diagnosis and treatment.";
    }
    
    if (input.includes('appointment') || input.includes('book') || input.includes('schedule')) {
      return "I'd be happy to help you schedule an appointment! 📅\n\nI can check availability with:\n• Your primary care physician\n• Specialists in our network\n• Urgent care slots\n\nWhat type of appointment would you like to schedule, and do you have any preferred dates or times?";
    }
    
    if (input.includes('medication') || input.includes('medicine') || input.includes('pill')) {
      return "I can help you with medication-related questions! 💊\n\nI can assist with:\n• Setting up medication reminders\n• Checking drug interactions\n• Finding pharmacy locations\n• Refill reminders\n\nWhat specific help do you need with your medications?";
    }
    
    if (input.includes('health tips') || input.includes('wellness') || input.includes('healthy')) {
      return "Here are some personalized health tips for you! ✨\n\n🥗 **Nutrition**: Aim for 5 servings of fruits and vegetables daily\n💧 **Hydration**: Drink at least 8 glasses of water\n🏃 **Exercise**: 30 minutes of moderate activity most days\n😴 **Sleep**: 7-9 hours of quality sleep nightly\n🧘 **Stress**: Practice mindfulness or meditation\n\nWould you like specific tips for any of these areas?";
    }
    
    // Default responses
    const defaultResponses = [
      "Thank you for reaching out! I'm analyzing your request and will provide personalized recommendations based on your health profile.",
      "I understand your concern. Let me help you with that. Based on your medical history, here are some suggestions...",
      "That's a great question! I'm here to provide evidence-based health information to support your wellness journey.",
      "I've noted your request. Let me connect this with your health data to give you the most relevant guidance."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const getFollowUpSuggestions = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('symptom')) {
      return ["Schedule urgent consultation", "View similar cases", "Symptom checker tool"];
    }
    
    if (input.includes('appointment')) {
      return ["Check doctor availability", "View appointment history", "Cancel/reschedule"];
    }
    
    if (input.includes('medication')) {
      return ["Set medication alarm", "Check side effects", "Find nearby pharmacy"];
    }
    
    return ["Ask follow-up question", "Get more information", "Schedule consultation"];
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl flex flex-col border-l border-gray-200 ${
          isMinimized ? 'h-16' : 'h-full'
        } transition-all duration-300`}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AllCognix AI</h3>
              <p className="text-xs text-emerald-100">Medical Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Status Bar */}
            <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-emerald-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>AI Assistant Online</span>
              </div>
              <div className="text-xs text-emerald-600">
                Secure & Encrypted
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      {message.sender === 'ai' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs font-medium text-gray-600">AllCognix AI</span>
                        </div>
                      )}
                      
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        <div className="whitespace-pre-wrap leading-relaxed">{message.text}</div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${
                            message.sender === 'user' ? 'text-emerald-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          
                          {message.sender === 'ai' && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => copyMessage(message.text)}
                                className="p-1 rounded hover:bg-gray-100 transition-colors"
                              >
                                <Copy className="w-3 h-3 text-gray-400" />
                              </button>
                              <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                                <ThumbsUp className="w-3 h-3 text-gray-400" />
                              </button>
                              <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                                <ThumbsDown className="w-3 h-3 text-gray-400" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Follow-up suggestions */}
                      {message.suggestions && (
                        <div className="mt-3 space-y-2">
                          {message.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleQuickAction(suggestion)}
                              className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-emerald-50 border border-gray-200 rounded-lg transition-colors text-gray-700 hover:text-emerald-700"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Quick Actions */}
              {showQuickActions && messages.length <= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <p className="text-sm font-medium text-gray-600 px-2">Quick Actions:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <motion.button
                        key={index}
                        onClick={action.action}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-3 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 flex flex-col items-center gap-2 text-center"
                      >
                        <div className="text-emerald-600">{action.icon}</div>
                        <span className="text-xs font-medium text-gray-700">{action.text}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">AllCognix AI is typing...</span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={endOfMessagesRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-emerald-300 focus-within:bg-white transition-all">
                  <button 
                    type="button" 
                    className="p-2 text-gray-400 hover:text-emerald-600 transition-colors rounded-full hover:bg-emerald-50"
                  >
                    <Paperclip size={18} />
                  </button>

                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about your health..."
                    className="flex-1 py-2 px-2 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-700 placeholder-gray-400"
                  />

                  <button 
                    type="button" 
                    onClick={handleVoiceInput}
                    className={`p-2 transition-colors rounded-full ${
                      isRecording 
                        ? 'text-red-500 bg-red-50 animate-pulse' 
                        : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <Mic size={18} />
                  </button>

                  <button
                    type="submit"
                    disabled={input.trim() === ''}
                    className={`p-2 rounded-full transition-all ${
                      input.trim() === ''
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transform hover:scale-110'
                    }`}
                  >
                    <Send size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>Secure & Private</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    <span>AI-Powered</span>
                  </div>
                </div>
              </form>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatBot;










// import React, { useState, useEffect, useRef } from 'react';
// import { Send, Notebook as Robot, Mic, Paperclip, X } from 'lucide-react';
// import { useAuth } from '../Authentication/AuthContext';

// const ChatBot = ({ isOpen, onClose }) => {
//   const { user } = useAuth();
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const endOfMessagesRef = useRef(null);

//   useEffect(() => {
//     if (messages.length === 0) {
//       setMessages([
//         {
//           id: '1',
//           text: `Hello ${user?.name || 'there'}! I'm your medical assistant. How can I help you today?`,
//           sender: 'ai',
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   }, [user, messages.length]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (input.trim() === '') return;

//     const userMessage = {
//       id: Date.now().toString(),
//       text: input,
//       sender: 'user',
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput('');
//     setIsTyping(true);

//     setTimeout(() => {
//       const responses = [
//         "Based on your symptoms, it could be a common cold, but I'd recommend consulting with your doctor if symptoms persist for more than 5 days.",
//         "Your recent lab results show improvements in your cholesterol levels. Great progress!",
//         "I've noted your symptoms. Would you like me to schedule an appointment with your doctor?",
//         "Remember to take your medication at 8 PM today. Your next checkup is scheduled for next week.",
//         "Your blood pressure readings have been stable over the past month. Keep up the good work!",
//       ];

//       const aiMessage = {
//         id: (Date.now() + 1).toString(),
//         text: responses[Math.floor(Math.random() * responses.length)],
//         sender: 'ai',
//         timestamp: new Date(),
//       };

//       setMessages((prev) => [...prev, aiMessage]);
//       setIsTyping(false);
//     }, 1500);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out">
//       {/* Header */}
//       <div className="px-4 py-3 bg-teal-600 text-white flex items-center justify-between">
//         <div className="flex items-center">
//           <Robot size={20} />
//           <h3 className="ml-2 font-medium">AI Medical Assistant</h3>
//         </div>
//         <button onClick={onClose} className="p-1 rounded-full hover:bg-teal-700 transition-colors">
//           <X size={20} />
//         </button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//         {messages.map((message) => (
//           <div key={message.id} className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
//             <div
//               className={`max-w-[80%] rounded-lg px-4 py-2 ${
//                 message.sender === 'user'
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-white text-gray-800 border border-gray-200'
//               }`}
//             >
//               <p>{message.text}</p>
//               <p className={`text-xs mt-1 ${
//                 message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
//               }`}>
//                 {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </p>
//             </div>
//           </div>
//         ))}

//         {isTyping && (
//           <div className="flex justify-start mb-4">
//             <div className="bg-white text-gray-800 border border-gray-200 rounded-lg px-4 py-2">
//               <div className="flex space-x-1">
//                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
//                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
//                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div ref={endOfMessagesRef} />
//       </div>

//       {/* Input area */}
//       <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
//         <div className="flex items-center">
//           <button type="button" className="p-2 text-gray-500 hover:text-teal-600 transition-colors">
//             <Paperclip size={20} />
//           </button>

//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type your message..."
//             className="flex-1 py-2 px-3 border-none focus:ring-0 focus:outline-none"
//           />

//           <button type="button" className="p-2 text-gray-500 hover:text-teal-600 transition-colors">
//             <Mic size={20} />
//           </button>

//           <button
//             type="submit"
//             className="p-2 text-teal-600 hover:text-teal-700 transition-colors"
//             disabled={input.trim() === ''}
//           >
//             <Send size={20} />
//           </button>
//         </div>
//       </form>

      
//     </div>
//   );
// };

// export default ChatBot;
