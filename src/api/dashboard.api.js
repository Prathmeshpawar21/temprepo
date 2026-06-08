/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/
 
// frontend/src/api/dashboard.api.js
import api from './api';

const dashboardAPI = {
  async getDashboardOverview(period = 7) {
    try {
      const response = await api.get(`/dashboard/overview?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Dashboard overview error:', error);
      throw error;
    }
  },

  // ✅ NEW
  async getAIInsights() {
    try {
      const response = await api.get('/dashboard/ai-insights');
      return response.data;
    } catch (error) {
      console.error('AI insights error:', error);
      throw error;
    }
  }
};

export default dashboardAPI;