/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Loader2, 
  Brain, 
  Stethoscope, 
  Users, 
  Search,
  Target,
  Activity,
  ChevronUp,
  ChevronDown,
  Zap
} from 'lucide-react';
import api from '../../../api/api';

const WorkflowStatus = ({ consultationId, status: initialStatus }) => {
  const [status, setStatus] = useState(initialStatus || null);
  const [loading, setLoading] = useState(!initialStatus);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialStatus) {
      setStatus(initialStatus);
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      if (!consultationId) return;
      
      try {
        setError(null);
        const response = await api.get(`/agentic/workflow-status/${consultationId}`);
        setStatus(response.data);
      } catch (error) {
        console.error('Error fetching workflow status:', error);
        setError('Failed to load workflow status');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    
    // Poll for updates every 3 seconds when processing
    let interval;
    if (status?.workflow_status === 'processing') {
      interval = setInterval(fetchStatus, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [consultationId, initialStatus, status?.workflow_status]);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 m-4">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
          <div>
            <span className="text-sm font-medium text-blue-800">Initializing AI Workflow...</span>
            <p className="text-xs text-blue-600 mt-0.5">Starting advanced medical analysis</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-sm text-red-800">{error}</span>
        </div>
      </div>
    );
  }

  if (!status) return null;

  const getStatusIcon = (stepStatus) => {
    switch (stepStatus) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStepStatus = (stepId) => {
    if (status.processing_steps?.[stepId]) {
      return status.processing_steps[stepId].status || 'completed';
    }
    
    // Determine status based on overall workflow
    if (status.workflow_status === 'processing') {
      return 'in_progress';
    } else if (status.workflow_status === 'completed') {
      return 'completed';
    }
    
    return 'pending';
  };

  const steps = [
    {
      id: 'symptom_extraction',
      name: 'Symptom Analysis',
      description: 'AI extracting and analyzing symptoms from conversation',
      icon: <Brain className="h-4 w-4" />,
      color: 'blue'
    },
    {
      id: 'medical_reasoning',
      name: 'Medical Reasoning',
      description: 'Advanced AI reasoning through possible conditions',
      icon: <Stethoscope className="h-4 w-4" />,
      color: 'indigo'
    },
    {
      id: 'escalation_assessment',
      name: 'Care Assessment',
      description: 'Determining urgency and care requirements',
      icon: <Target className="h-4 w-4" />,
      color: 'purple'
    },
    {
      id: 'doctor_search',
      name: 'Provider Matching',
      description: 'Finding optimal healthcare providers near you',
      icon: <Search className="h-4 w-4" />,
      color: 'teal'
    }
  ];

  const completedSteps = steps.filter(step => getStepStatus(step.id) === 'completed').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const getOverallStatusConfig = () => {
    switch (status.workflow_status) {
      case 'processing':
        return {
          color: 'blue',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          icon: <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
        };
      case 'completed':
        return {
          color: 'green',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          icon: <CheckCircle className="h-5 w-5 text-green-600" />
        };
      case 'failed':
        return {
          color: 'red',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          icon: <AlertCircle className="h-5 w-5 text-red-600" />
        };
      default:
        return {
          color: 'gray',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          icon: <Clock className="h-5 w-5 text-gray-600" />
        };
    }
  };

  const statusConfig = getOverallStatusConfig();

  return (
    <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-4 m-4 transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {statusConfig.icon}
          <div>
            <h3 className={`font-semibold ${statusConfig.textColor} flex items-center space-x-2`}>
              <Zap className="h-4 w-4" />
              <span>AI Medical Workflow</span>
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              {status.workflow_status === 'processing' && 'Advanced agents analyzing your case...'}
              {status.workflow_status === 'completed' && 'Analysis complete - recommendations ready'}
              {status.workflow_status === 'failed' && 'Workflow encountered an issue'}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-white rounded-lg transition-colors"
          title={isCollapsed ? 'Expand workflow details' : 'Collapse workflow details'}
        >
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronUp className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{completedSteps}/{steps.length} steps completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Steps Details */}
      {!isCollapsed && (
        <div className="space-y-3">
          {steps.map((step, index) => {
            const stepStatus = getStepStatus(step.id);
            const stepData = status.processing_steps?.[step.id];
            
            return (
              <div key={step.id} className="flex items-center space-x-3 group">
                {/* Step Number & Status */}
                <div className="flex-shrink-0 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    stepStatus === 'completed' ? 'bg-green-100 text-green-700 ring-2 ring-green-200' :
                    stepStatus === 'in_progress' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200 animate-pulse' :
                    stepStatus === 'failed' ? 'bg-red-100 text-red-700 ring-2 ring-red-200' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {stepStatus === 'completed' ? '✓' : 
                     stepStatus === 'in_progress' ? '•' : 
                     stepStatus === 'failed' ? '!' : 
                     index + 1}
                  </div>
                  
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className={`absolute top-8 left-1/2 w-0.5 h-6 transform -translate-x-1/2 transition-colors duration-300 ${
                      stepStatus === 'completed' ? 'bg-green-300' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      stepStatus === 'completed' ? 'text-green-800' :
                      stepStatus === 'in_progress' ? 'text-blue-800' :
                      stepStatus === 'failed' ? 'text-red-800' :
                      'text-gray-600'
                    }`}>
                      {step.name}
                      {stepData?.duration && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({stepData.duration}s)
                        </span>
                      )}
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      {step.icon}
                      {getStatusIcon(stepStatus)}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                  
                  {/* Step Details */}
                  {stepData?.details && (
                    <div className="mt-2 p-2 bg-white rounded border text-xs">
                      <pre className="text-gray-600 whitespace-pre-wrap">
                        {JSON.stringify(stepData.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          {status.processing_time && (
            <span>Total time: {Math.round(status.processing_time)}s</span>
          )}
          {status.consultation_id && (
            <span>ID: {status.consultation_id.slice(-8)}</span>
          )}
        </div>
        
        {status.workflow_status === 'processing' && (
          <div className="flex items-center space-x-1">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-ping"></div>
            <span>Live updates</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowStatus;
