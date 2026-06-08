/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Consult/MessageBubble.jsx
import React from 'react';
import { CheckCircle2, AlertCircle, Loader2, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';

/**
 * Individual message bubble component
 * Supports both user and assistant messages
 */
const MessageBubble = ({ 
  message, 
  isUser = false, 
  stage = null,
  turnCount = null,
  showMeta = true
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast.success('Copied to clipboard!');
  };

  // ============================================
  // USER MESSAGE BUBBLE
  // ============================================

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 group">
        <div className="max-w-xs lg:max-w-md bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm leading-relaxed break-words">
            {message.content}
          </p>
          
          {showMeta && message.timestamp && (
            <p className="text-xs text-blue-100 mt-2 opacity-70">
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          )}
        </div>

        {/* Copy button on hover */}
        <button
          onClick={handleCopy}
          className="ml-2 p-2 rounded-lg hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Copy message"
        >
          <Copy className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    );
  }

  // ============================================
  // ASSISTANT MESSAGE BUBBLE
  // ============================================

  return (
    <div className="flex justify-start mb-4 group">
      <div className="max-w-xs lg:max-w-md">
        {/* Main message bubble */}
        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-800 leading-relaxed break-words">
            {message.content}
          </p>

          {/* Metadata */}
          {showMeta && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>

              {/* Stage indicator */}
              {stage && (
                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                  {stage.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              )}

              {/* Turn count */}
              {turnCount && (
                <span className="text-xs text-gray-500">
                  Turn {turnCount}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Status indicators */}
        <div className="flex items-center space-x-2 mt-2 ml-2 h-4">
          {message.status === 'sending' && (
            <Loader2 className="h-3 w-3 text-blue-500 animate-spin" />
          )}
          {message.status === 'sent' && (
            <CheckCircle2 className="h-3 w-3 text-green-500" />
          )}
          {message.status === 'error' && (
            <AlertCircle className="h-3 w-3 text-red-500" />
          )}
        </div>
      </div>

      {/* Copy button on hover */}
      <button
        onClick={handleCopy}
        className="ml-2 p-2 rounded-lg hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy message"
      >
        <Copy className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
};

export default MessageBubble;
