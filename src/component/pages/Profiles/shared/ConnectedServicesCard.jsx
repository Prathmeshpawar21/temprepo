/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Profile/shared/ConnectedServicesCard.jsx

import React from 'react';
import { Globe, Heart, CloudUpload, Wifi } from 'lucide-react';

const ConnectedServicesCard = () => {
  const services = [
    {
      name: 'Health App',
      // status: 'Syncing data',
      icon: <Heart className="h-4 w-4 text-green-600" />,
      iconBg: 'bg-green-100',
      statusColor: 'text-green-600',
      statusDot: 'bg-green-500',
      statusText: 'Connected',
      isConnected: true,
      animated: true
    },
    {
      name: 'Cloud Backup',
      // status: 'Auto-sync enabled',
      icon: <CloudUpload className="h-4 w-4 text-blue-600" />,
      iconBg: 'bg-blue-100',
      statusColor: 'text-blue-600',
      statusDot: 'bg-blue-500',
      statusText: 'Active',
      isConnected: true,
      animated: false
    },
    {
      name: 'Wearable Device',
      // status: 'Not connected',
      icon: <Wifi className="h-4 w-4 text-gray-600" />,
      iconBg: 'bg-gray-100',
      statusColor: 'text-gray-600',
      statusDot: 'bg-gray-300',
      statusText: 'Connect',
      isConnected: false,
      animated: false
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Globe className="h-5 w-5 text-teal-600 mr-2" />
        <h3 className="text-lg font-bold text-gray-900">Connected Services</h3>
      </div>

      <div className="space-y-4">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-1 ${service.iconBg} rounded`}>{service.icon}</div>
              <div>
                <p className="text-sm font-medium text-gray-900">{service.name}</p>
                <p className="text-xs text-gray-500">{service.status}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {service.isConnected ? (
                <>
                  <div
                    className={`w-2 h-2 ${service.statusDot} rounded-full ${
                      service.animated ? 'animate-pulse' : ''
                    }`}
                  ></div>
                  <span className={`text-xs ${service.statusColor} font-medium`}>
                    {service.statusText}
                  </span>
                </>
              ) : (
                <button className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors">
                  {service.statusText}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectedServicesCard;
