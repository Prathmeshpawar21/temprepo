/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

import React, { useState } from 'react';
import api from '../../api/api';

const DevTools = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);


  
const runEnhancedMigration = async () => {
  try {
    setLoading(true);
    setResult(null);
    
    const response = await api.post('/api/subscription/migrate-database-schema');
    console.log('Enhanced migration response:', response.data);
    setResult({ success: true, data: response.data });
  } catch (error) {
    console.error('Enhanced migration error:', error);
    setResult({ success: false, error: error.response?.data?.detail || error.message });
  } finally {
    setLoading(false);
  }
};

const verifyMigration = async () => {
  try {
    setLoading(true);
    setResult(null);
    
    const response = await api.get('/api/subscription/verify-migration');
    console.log('Migration verification:', response.data);
    setResult({ success: true, data: response.data });
  } catch (error) {
    console.error('Verification error:', error);
    setResult({ success: false, error: error.response?.data?.detail || error.message });
  } finally {
    setLoading(false);
  }
};



  const nuclearReset = async () => {
    if (!confirm('⚠️ DANGER: This will DELETE ALL DATABASE TABLES! Are you sure?')) {
      return;
    }
    
    try {
      setLoading(true);
      setResult(null);
      
      const response = await api.post('/dev/nuclear-reset');
      console.log('Nuclear reset response:', response.data);
      setResult({ success: true, data: response.data });
    } catch (error) {
      console.error('Nuclear reset error:', error);
      setResult({ success: false, error: error.response?.data?.detail || error.message });
    } finally {
      setLoading(false);
    }
  };

  const recreateTables = async () => {
    try {
      setLoading(true);
      setResult(null);
      
      const response = await api.post('/dev/recreate-tables');
      console.log('Recreate response:', response.data);
      setResult({ success: true, data: response.data });
    } catch (error) {
      console.error('Recreate error:', error);
      setResult({ success: false, error: error.response?.data?.detail || error.message });
    } finally {
      setLoading(false);
    }
  };

  const resetAllData = async () => {
    try {
      setLoading(true);
      setResult(null);
      
      const response = await api.post('/dev/reset-all-data');
      console.log('Reset response:', response.data);
      setResult({ success: true, data: response.data });
    } catch (error) {
      console.error('Reset error:', error);
      setResult({ success: false, error: error.response?.data?.detail || error.message });
    } finally {
      setLoading(false);
    }
  };

  const createTestUser = async () => {
    try {
      setLoading(true);
      setResult(null);
      
      const response = await api.post('/dev/create-test-user');
      console.log('Test user response:', response.data);
      setResult({ success: true, data: response.data });
    } catch (error) {
      console.error('Test user error:', error);
      setResult({ success: false, error: error.response?.data?.detail || error.message });
    } finally {
      setLoading(false);
    }
  };

  const getDataStatus = async () => {
    try {
      setLoading(true);
      setResult(null);
      
      const response = await api.get('/dev/data-status');
      console.log('Data status:', response.data);
      setResult({ success: true, data: response.data });
    } catch (error) {
      console.error('Status error:', error);
      setResult({ success: false, error: error.response?.data?.detail || error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-20 right-4 bg-white border-2 border-red-500 p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <h3 className="font-bold mb-4 text-red-600">🛠️ DEV TOOLS</h3>
      
      <div className="space-y-2 mb-4">
        <button 
          onClick={nuclearReset}
          disabled={loading}
          className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400 text-sm"
        >
          {loading ? 'Nuking...' : '💥 NUCLEAR RESET (Drop Tables)'}
        </button>
        
        <button 
          onClick={recreateTables}
          disabled={loading}
          className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:bg-gray-400 text-sm"
        >
          {loading ? 'Creating...' : '🏗️ Recreate Tables'}
        </button>
        
        <button 
          onClick={resetAllData}
          disabled={loading}
          className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:bg-gray-400 text-sm"
        >
          {loading ? 'Resetting...' : '🔄 Reset Data Only'}
        </button>
        
        <button 
          onClick={createTestUser}
          disabled={loading}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 text-sm"
        >
          {loading ? 'Creating...' : '🧪 Create Test User'}
        </button>
        
        <button 
          onClick={getDataStatus}
          disabled={loading}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 text-sm"
        >
          {loading ? 'Checking...' : '📊 Data Status'}
        </button>


        <button 
    onClick={runEnhancedMigration}
    disabled={loading}
    className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400 text-sm"
  >
    {loading ? 'Migrating...' : '🚀 Enhanced Migration'}
  </button>

  <button 
    onClick={verifyMigration}
    disabled={loading}
    className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 text-sm"
  >
    {loading ? 'Verifying...' : '🔍 Verify Migration'}
  </button>


      </div>

      <div className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-60">
        {result ? (
          <div className={result.success ? 'text-green-600' : 'text-red-600'}>
            <div className="font-bold mb-2">
              {result.success ? '✅ SUCCESS' : '❌ ERROR'}
            </div>
            <pre className="whitespace-pre-wrap text-xs">
              {JSON.stringify(result.success ? result.data : result.error, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="text-gray-500">Click a button to see results...</div>
        )}
      </div>
    </div>
  );
};

export default DevTools;
