/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Dashboard/PatientDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Authentication/AuthContext';
import { 
  Calendar, 
  Pill, 
  Clock, 
  Heart,
  SquarePlus,
  Activity, 
  Bot,
  Bell,
  Settings,
  Search,
  ChevronRight,
  FileText,
  Zap,
  Award,
  Target,
  MessageSquare,
  Video,
  Phone,
  Sparkles,
  Download,
  
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dashboardAPI from '../../../api/dashboard.api';
import { toast } from 'react-hot-toast';

const PatientDashboard = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  // API States
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  const [aiInsights, setAiInsights] = useState(null);
  const [aiInsightsLoading, setAiInsightsLoading] = useState(true);

  // UI States
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredPoint, setHoveredPoint] = useState(null);
  // ADD after your existing UI states
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [chartPeriod, setChartPeriod] = useState(7);


  // Fetch Dashboard Data
  useEffect(() => {
    fetchDashboardData();
  }, []);



const fetchDashboardData = async (period = 7) => {
  try {
    setLoading(true);
    setError(null);
    const data = await dashboardAPI.getDashboardOverview(period);
    setDashboardData(data);
    setNotifications(data.notifications_count || 0);
  } catch (err) {
    console.error('❌ Error fetching patient dashboard:', err);
    setError('Failed to load dashboard data');
    toast.error('Failed to load dashboard data');
  } finally {
    setLoading(false);
  }
};


const fetchAIInsights = async () => {
  try {
    setAiInsightsLoading(true);
    const data = await dashboardAPI.getAIInsights();
    setAiInsights(data.ai_insights);
  } catch (err) {
    console.error('❌ AI insights error:', err);
    // Silent fail — don't block dashboard for this
  } finally {
    setAiInsightsLoading(false);
  }
};

// ✅ UPDATED — both fire at the same time, completely parallel
useEffect(() => {
  fetchDashboardData();
  fetchAIInsights();   // independent, doesn't wait for overview
}, []);



  // ADD period change handler
  const handlePeriodChange = (e) => {
    const newPeriod = parseInt(e.target.value);
    setChartPeriod(newPeriod);
    fetchDashboardData(newPeriod);
  };


  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Get data from API or fallback
  const weeklyData = dashboardData?.weekly_performance || [];
  const recentActivities = dashboardData?.recent_activities || [];
  const upcomingAppointments = dashboardData?.upcoming_appointments || [];
  const stats = dashboardData?.stats || {};

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    hover: { 
      scale: 1.01,
      y: -4,
      boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.08)',
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  };

  // Patient Quick Actions
  const quickActions = [
    { icon: <Calendar />, label: 'Book Appointment', action: () => navigate('/book-appointment') },
    { icon: <MessageSquare />, label: 'New Consult', action: () => navigate('/new-consult') },
    { icon: <Pill />, label: 'Medications', action: () => navigate('/medications') },
    { icon: <FileText />, label: 'Records', action: () => navigate('/records') }
  ];

  // Patient Tabs
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Activity /> },
    { id: 'health', label: 'Health', icon: <Heart /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar /> },
    { id: 'records', label: 'Records', icon: <FileText /> }
  ];

  // Helper function to extract display name
  const getDisplayName = () => {
    if (userProfile?.first_name) return userProfile.first_name;
    if (user?.first_name) return user.first_name;
    if (userProfile?.full_name) return userProfile.full_name.split(' ')[0];
    if (user?.full_name) return user.full_name.split(' ')[0];
    
    if (user?.email) {
      const namePart = user.email.split('@')[0];
      const cleanName = namePart.replace(/[0-9_.-]/g, '');
      if (cleanName.length > 0) {
        return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      }
    }
    
    return 'Patient';
  };

  const displayName = getDisplayName();

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'scheduled': return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'available': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'recorded': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Chart functions
  const generateLinePath = (data, width, height) => {
    if (!data || data.length === 0) return '';
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - (item.value / 100) * height;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const generateAreaPath = (data, width, height) => {
    if (!data || data.length === 0) return '';
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - (item.value / 100) * height;
      return `${x},${y}`;
    });
    return `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;
  };

  // Loading State
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
        <p className="text-slate-600 font-medium">Loading your dashboard...</p>
      </div>
    </div>
  );
}
  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Failed to Load Patient Dashboard</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }



  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
        
        {/* Enhanced Header */}
        <motion.header 
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            {/* Left Section */}
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <SquarePlus className="h-7 w-7 text-white" />
              </div>


              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">
                  {/* ✅ Use IST hour for greeting */}
                  Good {new Date().toLocaleString('en-IN', { hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' }) < 12 
                    ? 'Morning' 
                    : new Date().toLocaleString('en-IN', { hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' }) < 18 
                      ? 'Afternoon' 
                      : 'Evening'
                  }, <span className="capitalize">{displayName}</span>!
                </h1>
                <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                  <span className="flex items-center font-medium">
                    {/* <Calendar className="h-4 w-4 mr-1.5 text-slate-400" /> */}
                    {/* ✅ IST date */}
                    {currentTime.toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric',
                      timeZone: 'Asia/Kolkata'
                    })}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="flex items-center font-medium">
                    {/* <Clock className="h-4 w-4 mr-1.5 text-slate-400" /> */}
                    {/* ✅ IST 12hr time */}
                    {currentTime.toLocaleTimeString('en-IN', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true,
                      timeZone: 'Asia/Kolkata'
                    })}
                  </span>
                </div>
              </div>


            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="h-4 w-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search records, doctors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-64 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-400"
                />
              </div>

              {/* Quick Actions Button */}
              <div className="relative">
                {/* <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="p-2.5 bg-gradient-to-br from-blue-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 relative"
                >
                  <Plus className="h-5 w-5" />
                </button> */}
                <AnimatePresence>
                  {showQuickActions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-14 w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 backdrop-blur-lg"
                    >
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={action.action}
                          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 group"
                        >
                          <div className="text-slate-600 group-hover:text-blue-600 transition-colors">{action.icon}</div>
                          <span className="text-sm font-medium">{action.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notifications */}
              <button className="relative p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all">
                <Bell className="h-5 w-5 text-slate-600" />
                {notifications > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-gradient-to-br from-rose-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-lg"
                  >
                    {notifications}
                  </motion.span>
                )}
              </button>

              {/* Settings */}
              <button 
                onClick={() => navigate('/profile')}
                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <Settings className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>
        </motion.header>



        {/* Patient Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={cardVariants} whileHover="hover" className="relative overflow-hidden bg-white rounded-2xl p-6 border border-slate-200 shadow-sm cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-slate-200 group-hover:bg-slate-100 transition-all">
                <Calendar className="h-5 w-5 text-slate-700" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-2">Appointments</h3>
            <p className="text-3xl font-bold text-slate-900 mb-1.5 tracking-tight">{stats.appointments_count || 0}</p>
            {/* <p className="text-xs text-slate-500 font-medium">{stats.appointments_next || 'No upcoming appointments'}</p> */}
          </motion.div>

          <motion.div variants={cardVariants} whileHover="hover" className="relative overflow-hidden bg-white rounded-2xl p-6 border border-slate-200 shadow-sm cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-slate-200 group-hover:bg-slate-100 transition-all">
                <Pill className="h-5 w-5 text-slate-700" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-2">Active Medications</h3>
            <p className="text-3xl font-bold text-slate-900 mb-1.5 tracking-tight">{stats.active_medications_count || 0}</p>
            {/* <p className="text-xs text-slate-500 font-medium">{stats.medications_next_dose || 'No medications'}</p> */}
          </motion.div>

          <motion.div variants={cardVariants} whileHover="hover" className="relative overflow-hidden bg-white rounded-2xl p-6 border border-slate-200 shadow-sm cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-slate-200 group-hover:bg-slate-100 transition-all">
                <Award className="h-5 w-5 text-slate-700" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-2">Health Score</h3>
            <p className="text-3xl font-bold text-slate-900 mb-1.5 tracking-tight">{stats.health_score || 0}</p>
            {/* <p className="text-xs text-slate-500 font-medium">Excellent progress</p> */}
          </motion.div>

          <motion.div variants={cardVariants} whileHover="hover" className="relative overflow-hidden bg-white rounded-2xl p-6 border border-slate-200 shadow-sm cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-slate-200 group-hover:bg-slate-100 transition-all">
                <Target className="h-5 w-5 text-slate-700" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-2">Wellness Streak</h3>
            <p className="text-3xl font-bold text-slate-900 mb-1.5 tracking-tight">{stats.wellness_streak_days || 0}</p>
            {/* <p className="text-xs text-slate-500 font-medium">days active</p> */}
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            



        {/* Health Trends Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Health Trends</h2>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={chartPeriod}
                onChange={handlePeriodChange}
                className="text-xs font-medium border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-700"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
          </div>

          {/* Line Chart */}
          {weeklyData.length > 0 ? (
            <div className="relative">
              <div className="h-80 w-full relative">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 700 320"
                  className="overflow-visible"
                >
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgb(59, 130, 246)" />
                      <stop offset="100%" stopColor="rgb(20, 184, 166)" />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="rgb(20, 184, 166)" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>

                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((value, idx) => (
                    <g key={idx}>
                      <line
                        x1="0"
                        y1={320 - (value / 100) * 320}
                        x2="700"
                        y2={320 - (value / 100) * 320}
                        stroke="#e2e8f0"
                        strokeWidth="1"
                        strokeDasharray="5,5"
                      />
                      <text
                        x="-10"
                        y={320 - (value / 100) * 320 + 5}
                        fill="#94a3b8"
                        fontSize="12"
                        textAnchor="end"
                      >
                        {value}%
                      </text>
                    </g>
                  ))}

                  {/* Area fill */}
                  <motion.path
                    d={generateAreaPath(weeklyData, 700, 320)}
                    fill="url(#areaGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />

                  {/* Main line */}
                  <motion.path
                    d={generateLinePath(weeklyData, 700, 320)}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />

                  {/* Data points */}
                  {weeklyData.map((data, index) => {
                    const x = (index / (weeklyData.length - 1)) * 700;
                    const y = 320 - (data.value / 100) * 320;

                    return (
                      <g key={index}>
                        {/* Hover glow */}
                        <motion.circle
                          cx={x}
                          cy={y}
                          r={hoveredPoint === index ? 12 : 0}
                          fill="rgb(59, 130, 246)"
                          opacity="0.2"
                          animate={{ r: hoveredPoint === index ? 12 : 0 }}
                          transition={{ duration: 0.2 }}
                        />

                        {/* Dot */}
                        <motion.circle
                          cx={x}
                          cy={y}
                          r={hoveredPoint === index ? 6 : 4}
                          fill="white"
                          stroke={hoveredPoint === index ? "rgb(59, 130, 246)" : "rgb(20, 184, 166)"}
                          strokeWidth={hoveredPoint === index ? 3 : 2}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredPoint(index)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />

                        {/* Tooltip */}
                        {hoveredPoint === index && (
                          <foreignObject
                            x={x - 80}
                            y={y - 85}
                            width="160"
                            height="80"
                          >
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-slate-900 text-white text-xs py-3 px-4 rounded-xl font-medium shadow-2xl"
                            >
                              <div className="text-center space-y-1">
                                <div className="font-bold text-sm text-blue-300">{data.day}</div>
                                <div className="text-slate-200 font-semibold">{data.value}% Score</div>
                                <div className="h-px bg-slate-700 my-1" />
                                {data.med_adherence_pct !== null && data.med_adherence_pct !== undefined ? (
                                  <div className="text-slate-300">💊 {data.med_adherence_pct}% Adherence</div>
                                ) : (
                                  <div className="text-slate-400 italic">No meds logged</div>
                                )}
                                <div className={data.had_activity ? 'text-green-400' : 'text-slate-400'}>
                                  {data.had_activity ? '✅ Active day' : '○ No activity'}
                                </div>
                              </div>
                            </motion.div>
                          </foreignObject>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Day Labels */}
              <div className="flex items-center justify-between px-2 mb-6 mt-4">
                {weeklyData.map((data, idx) => (
                  <div key={idx} className="flex-1 text-center">
                    <span className="text-xs text-slate-500 font-medium">
                      {data.day}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ background: 'linear-gradient(to right, rgb(59, 130, 246), rgb(20, 184, 166))' }}
                    />
                    <span className="text-slate-600 font-medium">Health Score</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-200 rounded-full" />
                    <span className="text-slate-600 font-medium">Target: 75%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    {Math.round(weeklyData.reduce((acc, d) => acc + d.value, 0) / weeklyData.length)}%
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-500">
              No data available
            </div>
          )}
        </motion.div>








            {/* Recent Activity */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-7">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
                  {/* <p className="text-sm text-slate-500 mt-1.5">Latest updates and notifications</p> */}
                </div>
                <button 
                  onClick={() => navigate('/consult-history')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 hover:gap-2 transition-all"
                >
                  <span>View all</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              
              {recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group border border-transparent hover:border-slate-200"
                    >
                      <div className={`p-3 rounded-xl ${getStatusColor(activity.status)} border`}>
                        {activity.type === 'consultation' && <Video className="h-5 w-5" />}
                        {activity.type === 'lab_result' && <FileText className="h-5 w-5" />}
                        {activity.type === 'appointment' && <Calendar className="h-5 w-5" />}
                        {activity.type === 'medication' && <Pill className="h-5 w-5" />}
                        {activity.type === 'vitals' && <Activity className="h-5 w-5" />}
                        {activity.type === 'prescription' && <FileText className="h-5 w-5" />}
                        {activity.type === 'report' && <Download className="h-5 w-5" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1.5">
                          <span className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${getPriorityColor(activity.priority)}`}>
                            {activity.priority}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 font-medium">{activity.action}</p>
                        <p className="text-xs text-slate-500 mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                        </p>
                      </div>
                      
                      <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Activity className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p>No recent activities</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            
            {/* Upcoming Appointments */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-7">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Appointments</h2>
                  {/* <p className="text-sm text-slate-500 mt-1.5">{upcomingAppointments.length} upcoming</p> */}
                </div>
                <button 
                  onClick={() => navigate('/book-appointment')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Book
                </button>
              </div>
              
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-5 border border-slate-200 rounded-xl hover:shadow-sm hover:bg-slate-50 transition-all cursor-pointer group"
                      onClick={() => navigate('/appointments')}
                    >
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="text-3xl">{appointment.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-slate-900 truncate">
                              {appointment.doctor_name}
                            </h3>
                            <span className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 font-medium mb-3">
                            {appointment.specialty}
                          </p>
                          {/* {appointment.hospital && (
                            <p className="text-xs text-slate-500 mb-3 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {appointment.hospital}
                            </p>
                          )} */}
                          <div className="flex items-center text-xs text-slate-600 space-x-4 font-medium">
                            <span className="flex items-center">
                              {/* <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-500" /> */}
                              {appointment.time}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                              {appointment.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {appointment.date === 'Today' && (
                        <div className="flex space-x-2 pt-3 border-t border-slate-100">
                          <button className="flex-1 py-2.5 px-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all text-xs font-semibold flex items-center justify-center space-x-2">
                            <Video className="h-4 w-4" />
                            <span>Start Call</span>
                          </button>
                          <button className="p-2.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors border border-slate-200">
                            <Phone className="h-4 w-4" />
                          </button>
                          <button className="p-2.5 text-slate-600 hover:text-teal-600 rounded-lg hover:bg-teal-50 transition-colors border border-slate-200">
                            <MessageSquare className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p className="mb-4">No upcoming appointments</p>
                  <button
                    onClick={() => navigate('/book-appointment')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Book Appointment
                  </button>
                </div>
              )}
            </motion.div>

{/* AI Insights — independent loading */}
<motion.div
  variants={itemVariants}
  className="bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 rounded-2xl p-7 border border-blue-100 shadow-sm hover:shadow-md transition-all"
>
  {/* Header */}
  <div className="flex items-center mb-6">
    <h2 className="text-xl font-bold text-slate-900 flex items-center">
      AI Insights
      <Sparkles className="h-4 w-4 ml-2 text-blue-500" />
    </h2>
  </div>

  {/* ✅ Skeleton while loading */}
  {aiInsightsLoading ? (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm space-y-2">
          <div className="h-4 w-2/5 bg-slate-100 rounded-md animate-pulse" />
          <div className="h-3 w-full bg-slate-100 rounded-md animate-pulse" />
          <div className="h-3 w-4/5 bg-slate-100 rounded-md animate-pulse" />
        </div>
      ))}
      <div className="h-11 w-full bg-slate-200 rounded-xl animate-pulse mt-5" />
    </div>

  ) : (
    // ✅ Real content — uses aiInsights state, NOT dashboardData
    <div className="space-y-3">

      {/* Health Progress */}
      <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
        <h3 className="font-semibold mb-1.5 flex items-center justify-between text-slate-900 text-sm">
          <span className="flex items-center">
            <Zap className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
            {aiInsights?.health_progress?.title || 'Health Progress'}
          </span>
          {aiInsights?.health_progress?.trend === 'up' && (
            <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-200">↑ Up</span>
          )}
          {aiInsights?.health_progress?.trend === 'down' && (
            <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-200">↓ Attention</span>
          )}
          {aiInsights?.health_progress?.trend === 'stable' && (
            <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">→ Stable</span>
          )}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
          {aiInsights?.health_progress?.message || 'No insights available'}
        </p>
      </div>

      {/* Smart Suggestion */}
      <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
        <h3 className="font-semibold mb-1.5 flex items-center text-slate-900 text-sm">
          <Target className="h-3.5 w-3.5 mr-1.5 text-teal-600" />
          {aiInsights?.smart_suggestion?.title || 'Smart Suggestion'}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
          {aiInsights?.smart_suggestion?.message || 'No suggestions available'}
        </p>
      </div>

      {/* Medication Adherence */}
      {aiInsights?.medication_alert && (
        <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold flex items-center text-slate-900 text-sm">
              <Pill className="h-3.5 w-3.5 mr-1.5 text-purple-600" />
              {aiInsights.medication_alert.title}
            </h3>
            <span className={`text-sm font-bold ${
              aiInsights.medication_alert.adherence_pct >= 80
                ? 'text-green-600' : 'text-amber-500'
            }`}>
              {aiInsights.medication_alert.adherence_pct}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-700 ${
                aiInsights.medication_alert.adherence_pct >= 80
                  ? 'bg-green-500' : 'bg-amber-400'
              }`}
              style={{ width: `${aiInsights.medication_alert.adherence_pct}%` }}
            />
          </div>
        </div>
      )}

      {/* View Full — opens modal */}
      <button
        onClick={() => setShowInsightsModal(true)}
        className="w-full mt-5 py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/30"
      >
        View Full Analysis
      </button>
    </div>
  )}
</motion.div>






          </div>
        </div>
      </div>




      {/* ── Full AI Insights Modal ───────────────────────────── */}
<AnimatePresence>
  {showInsightsModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={() => setShowInsightsModal(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2.5 bg-blue-50 rounded-xl mr-3 border border-blue-100">
              <Bot className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              Full AI Analysis
              <Sparkles className="h-4 w-4 ml-2 text-blue-500" />
            </h2>
          </div>
          <button
            onClick={() => setShowInsightsModal(false)}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">

          {/* Health Progress */}
          <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-50/30 rounded-xl border border-blue-100">
            <h3 className="font-semibold mb-2 flex items-center justify-between text-slate-900">
              <span className="flex items-center">
                <Zap className="h-4 w-4 mr-2 text-blue-600" />
                {dashboardData?.ai_insights?.health_progress?.title}
              </span>
              {dashboardData?.ai_insights?.health_progress?.trend === 'up' && (
                <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-200">↑ Improving</span>
              )}
              {dashboardData?.ai_insights?.health_progress?.trend === 'down' && (
                <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-200">↓ Attention Needed</span>
              )}
              {dashboardData?.ai_insights?.health_progress?.trend === 'stable' && (
                <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">→ Stable</span>
              )}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {dashboardData?.ai_insights?.health_progress?.message}
            </p>
          </div>

          {/* Smart Suggestion */}
          <div className="p-5 bg-gradient-to-br from-teal-50 to-teal-50/30 rounded-xl border border-teal-100">
            <h3 className="font-semibold mb-2 flex items-center text-slate-900">
              <Target className="h-4 w-4 mr-2 text-teal-600" />
              {dashboardData?.ai_insights?.smart_suggestion?.title}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {dashboardData?.ai_insights?.smart_suggestion?.message}
            </p>
          </div>

          {/* Medication Adherence */}
          {dashboardData?.ai_insights?.medication_alert && (
            <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-50/30 rounded-xl border border-purple-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center text-slate-900">
                  <Pill className="h-4 w-4 mr-2 text-purple-600" />
                  {dashboardData.ai_insights.medication_alert.title}
                </h3>
                <span className={`text-lg font-bold ${
                  dashboardData.ai_insights.medication_alert.adherence_pct >= 80
                    ? 'text-green-600' : 'text-amber-500'
                }`}>
                  {dashboardData.ai_insights.medication_alert.adherence_pct}%
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-2 mb-3 border border-slate-100">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${
                    dashboardData.ai_insights.medication_alert.adherence_pct >= 80
                      ? 'bg-green-500' : 'bg-amber-400'
                  }`}
                  style={{ width: `${dashboardData.ai_insights.medication_alert.adherence_pct}%` }}
                />
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {dashboardData.ai_insights.medication_alert.message}
              </p>
            </div>
          )}

        </div>

        {/* Generated timestamp */}
        {dashboardData?.ai_insights?.generated_at && (
          <p className="text-xs text-slate-400 text-center mt-5">
            Generated at {new Date(dashboardData.ai_insights.generated_at).toLocaleTimeString('en-IN', {
              hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata'
            })} IST
          </p>
        )}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


    </div>




  );
};

export default PatientDashboard;
