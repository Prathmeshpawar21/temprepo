/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/Patient/components/PrivacyNotice.jsx

import React from 'react';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyNotice = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mt-[4rem]"
    >
      <div className="flex items-start space-x-4">
        <Shield className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
        <div>
          <h4 className="text-lg font-bold text-amber-900 mb-2">Privacy & Security</h4>
          <div className="text-sm text-amber-800 space-y-2">
            <p>• All medical records are encrypted and stored securely</p>
            <p>• Only you and authorized healthcare providers can access your records</p>
            <p>• We comply with HIPAA regulations to protect your privacy</p>
            <p>• Keep your login credentials secure and never share them</p>
            <p>• Report any unauthorized access immediately to our support team</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyNotice;
