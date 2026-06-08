/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/Consult/ConsultationInsights.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Brain, Activity, AlertTriangle, CheckCircle, Stethoscope } from 'lucide-react';

const ConsultationInsights = ({ analysis }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!analysis) return null;

  const { symptoms, conditions, escalation } = analysis;

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-1 min-w-0 pr-2">
          <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 flex-shrink-0" />
          <span className="font-medium text-indigo-800 text-sm sm:text-base truncate">
            AI Analysis Insights
          </span>
          {escalation?.should_escalate && (
            <span className="hidden xs:inline-flex px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full whitespace-nowrap flex-shrink-0">
              Medical attention recommended
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-indigo-600 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-indigo-600 flex-shrink-0" />
        )}
      </button>

      {/* Mobile-only badge when collapsed */}
      {!isExpanded && escalation?.should_escalate && (
        <div className="xs:hidden mt-2">
          <span className="inline-flex px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
            Medical attention recommended
          </span>
        </div>
      )}

      {isExpanded && (
        <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
          {/* Symptoms Analysis - Mobile Optimized */}
          {symptoms?.primary_symptoms && (
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-indigo-800 mb-2 flex items-center">
                <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 flex-shrink-0" />
                <span className="truncate">Key Symptoms Identified</span>
              </h4>
              <ul className="text-xs sm:text-sm text-indigo-700 space-y-1 sm:space-y-1.5">
                {symptoms.primary_symptoms.slice(0, 3).map((symptom, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 sm:mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="break-words">{symptom}</span>
                  </li>
                ))}
              </ul>
              {symptoms.confidence_score && (
                <div className="mt-2 sm:mt-2.5">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-indigo-600">
                    <span>Analysis Confidence</span>
                    <span className="font-medium">{Math.round(symptoms.confidence_score * 100)}%</span>
                  </div>
                  <div className="w-full bg-indigo-200 rounded-full h-1.5 sm:h-2 mt-1">
                    <div 
                      className="bg-indigo-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                      style={{ width: `${symptoms.confidence_score * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Conditions Analysis - Mobile Optimized */}
          {conditions?.differential_diagnosis && (
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-indigo-800 mb-2 flex items-center">
                <Stethoscope className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 flex-shrink-0" />
                <span className="truncate">Possible Conditions</span>
              </h4>
              <ul className="text-xs sm:text-sm text-indigo-700 space-y-1 sm:space-y-1.5">
                {conditions.differential_diagnosis.slice(0, 3).map((condition, index) => (
                  <li key={index} className="flex items-center justify-between gap-2">
                    <span className="break-words flex-1">• {condition.condition || condition}</span>
                    {condition.probability && (
                      <span className="text-[10px] sm:text-xs text-indigo-600 font-medium whitespace-nowrap flex-shrink-0">
                        {Math.round(condition.probability * 100)}%
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Escalation Assessment - Mobile Optimized */}
          {escalation && (
            <div className={`p-2.5 sm:p-3 rounded-lg ${
              escalation.should_escalate 
                ? 'bg-orange-100 border border-orange-200' 
                : 'bg-green-100 border border-green-200'
            }`}>
              <div className="flex items-start space-x-1.5 sm:space-x-2">
                <AlertTriangle className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                  escalation.should_escalate ? 'text-orange-600' : 'text-green-600'
                }`} />
                <div className="flex-1 min-w-0">
                  <span className={`text-xs sm:text-sm font-medium block ${
                    escalation.should_escalate ? 'text-orange-800' : 'text-green-800'
                  }`}>
                    {escalation.should_escalate 
                      ? `Recommended: See ${escalation.recommended_specialization || 'healthcare provider'}`
                      : 'Continue self-monitoring'
                    }
                  </span>
                  {escalation.urgency_level && (
                    <p className={`text-[10px] sm:text-xs mt-1 ${
                      escalation.should_escalate ? 'text-orange-700' : 'text-green-700'
                    }`}>
                      Priority: <span className="font-medium">{escalation.urgency_level}</span>
                      {escalation.timeframe && ` (${escalation.timeframe})`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsultationInsights;
