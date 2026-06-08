/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/Consult/AgenticInsights.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Brain, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

const AgenticInsights = ({ analysis }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!analysis || analysis.workflow_status !== 'completed') {
    return null;
  }

  const { symptoms_extracted, conditions_analyzed, escalation_assessment } = analysis;

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-indigo-600" />
          <span className="font-medium text-indigo-800">AI Agent Analysis</span>
          {escalation_assessment?.should_escalate && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
              Medical attention recommended
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4 text-indigo-600" /> : <ChevronDown className="h-4 w-4 text-indigo-600" />}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Symptoms Analysis */}
          {symptoms_extracted?.primary_symptoms && (
            <div>
              <h4 className="text-sm font-semibold text-indigo-800 mb-2 flex items-center">
                <Activity className="h-4 w-4 mr-1" />
                Symptoms Identified
              </h4>
              <ul className="text-sm text-indigo-700 space-y-1">
                {symptoms_extracted.primary_symptoms.slice(0, 3).map((symptom, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                    {symptom}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Medical Reasoning */}
          {conditions_analyzed?.differential_diagnosis && (
            <div>
              <h4 className="text-sm font-semibold text-indigo-800 mb-2">Possible Conditions</h4>
              <ul className="text-sm text-indigo-700 space-y-1">
                {conditions_analyzed.differential_diagnosis.slice(0, 2).map((condition, index) => (
                  <li key={index}>• {condition.condition || condition}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Escalation Info */}
          {escalation_assessment && (
            <div className={`p-3 rounded-lg ${
              escalation_assessment.should_escalate 
                ? 'bg-orange-100 border border-orange-200' 
                : 'bg-green-100 border border-green-200'
            }`}>
              <div className="flex items-center space-x-2">
                <AlertTriangle className={`h-4 w-4 ${
                  escalation_assessment.should_escalate ? 'text-orange-600' : 'text-green-600'
                }`} />
                <span className={`text-sm font-medium ${
                  escalation_assessment.should_escalate ? 'text-orange-800' : 'text-green-800'
                }`}>
                  {escalation_assessment.should_escalate 
                    ? `Recommended: See ${escalation_assessment.recommended_specialization || 'a healthcare provider'}`
                    : 'Continue monitoring symptoms'
                  }
                </span>
              </div>
              {escalation_assessment.urgency_level && (
                <p className={`text-xs mt-1 ${
                  escalation_assessment.should_escalate ? 'text-orange-700' : 'text-green-700'
                }`}>
                  Priority: {escalation_assessment.urgency_level}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgenticInsights;
