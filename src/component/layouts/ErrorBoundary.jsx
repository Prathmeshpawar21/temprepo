/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ Error Boundary Caught:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// ✅ FIXED: Use window.location instead of useNavigate
const ErrorFallback = ({ error }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Oops! Something Went Wrong
        </h1>

        <p className="text-gray-600 mb-6">
          We encountered an unexpected error. Don't worry, your data is safe.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-left">
            <p className="text-xs text-red-800 font-mono break-all">
              {error.toString()}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
};

export default ErrorBoundary;
