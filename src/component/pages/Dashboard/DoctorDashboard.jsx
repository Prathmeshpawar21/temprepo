/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Dashboard/DoctorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Authentication/AuthContext';
import { 
  Calendar, 
  Clock, 
  Activity, 
  BarChart, 
  TrendingUp,
  Bot,
  Bell,
  Settings,
  Search,
  Plus,
  ChevronRight,
  Users,
  FileText,
  Zap,
  Award,
  Target,
  MessageSquare,
  Video,
  Phone,
  Sparkles,
  Stethoscope,
  Download,
  Loader2,
  X,
  UserPlus,
  Briefcase,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
// import dashboardAPI from '../../../api/doctor/doctor.dashboard.api';
// import { toast } from 'react-hot-toast'; // ⚠️ COMMENTED - Uncomment when backend is ready

const DoctorDashboard = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  // API States
  const [loading, setLoading] = useState(false); // ✅ CHANGED: Set to false (no API call yet)
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  // UI States
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(3); // ✅ Mock notification count
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // useEffect(() => {
  //   fetchDashboardData();
  // }, []);

  // ⚠️ COMMENTED OUT - Uncomment when backend is ready
  // const fetchDashboardData = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
      
  //     // Call doctor-specific endpoint
  //     const data = await dashboardAPI.getDoctorDashboardOverview();
      
  //     console.log('📊 Doctor dashboard data received:', data);
      
  //     setDashboardData(data);
  //     setNotifications(data.notifications_count || 0);
      
  //   } catch (err) {
  //     console.error('❌ Error fetching doctor dashboard:', err);
  //     setError('Failed to load dashboard data');
  //     toast.error('Failed to load dashboard data');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Get data from API or fallback
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // ✅ MOCK DATA for UI display (until backend is ready)
  const weeklyData = dashboardData?.weekly_performance || [
    { day: 'Mon', value: 85, patients: 12, consultations: 10, satisfaction: 4.5 },
    { day: 'Tue', value: 78, patients: 15, consultations: 13, satisfaction: 4.3 },
    { day: 'Wed', value: 92, patients: 18, consultations: 16, satisfaction: 4.8 },
    { day: 'Thu', value: 88, patients: 14, consultations: 12, satisfaction: 4.6 },
    { day: 'Fri', value: 95, patients: 20, consultations: 18, satisfaction: 4.9 },
    { day: 'Sat', value: 70, patients: 8, consultations: 7, satisfaction: 4.2 },
    { day: 'Sun', value: 65, patients: 5, consultations: 4, satisfaction: 4.0 }
  ];

  const recentActivities = dashboardData?.recent_activities || [
    {
      id: 1,
      type: 'consultation',
      patient: 'Sarah Johnson',
      avatar: '👩',
      action: 'Completed video consultation for diabetes follow-up',
      time: '15 minutes ago',
      priority: 'high',
      status: 'completed'
    },
    {
      id: 2,
      type: 'appointment',
      patient: 'Michael Chen',
      avatar: '👨',
      action: 'Scheduled appointment for next week',
      time: '1 hour ago',
      priority: 'medium',
      status: 'scheduled'
    },
    {
      id: 3,
      type: 'prescription',
      patient: 'Emily Davis',
      avatar: '👧',
      action: 'Prescribed medication for hypertension',
      time: '2 hours ago',
      priority: 'high',
      status: 'completed'
    },
    {
      id: 4,
      type: 'lab_result',
      patient: 'Robert Wilson',
      avatar: '👴',
      action: 'Lab results reviewed - all normal',
      time: '3 hours ago',
      priority: 'low',
      status: 'recorded'
    },
    {
      id: 5,
      type: 'vitals',
      patient: 'Amanda Brown',
      avatar: '👩‍🦰',
      action: 'Blood pressure monitoring - stable readings',
      time: '4 hours ago',
      priority: 'medium',
      status: 'recorded'
    }
  ];

  const upcomingAppointments = dashboardData?.upcoming_appointments || [
    {
      id: 1,
      patient_name: 'Sarah Johnson',
      avatar: '👩',
      appointment_type: 'Follow-up Consultation',
      time: '10:00 AM',
      date: 'Today',
      duration: '30 min',
      status: 'confirmed'
    },
    {
      id: 2,
      patient_name: 'Michael Chen',
      avatar: '👨',
      appointment_type: 'Initial Checkup',
      time: '2:30 PM',
      date: 'Today',
      duration: '45 min',
      status: 'confirmed'
    },
    {
      id: 3,
      patient_name: 'Emily Davis',
      avatar: '👧',
      appointment_type: 'Lab Review',
      time: '11:00 AM',
      date: 'Tomorrow',
      duration: '20 min',
      status: 'scheduled'
    }
  ];

  const stats = dashboardData?.stats || {
    today_patients_count: 12,
    today_patients_next: 'Next: Sarah Johnson at 10:00 AM',
    active_patients_count: 156,
    active_patients_new_week: 8,
    satisfaction_rate: 96,
    satisfaction_rating: 4.8,
    avg_consultation_time: 24
  };
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

  // Doctor Quick Actions
  const quickActions = [
    { icon: <Users />, label: 'Add Patient', action: () => navigate('/patients') },
    { icon: <Calendar />, label: 'Schedule', action: () => navigate('/appointments') },
    { icon: <FileText />, label: 'Reports', action: () => navigate('/reports') },
    { icon: <MessageSquare />, label: 'Messages', action: () => navigate('/messages') }
  ];

  // Doctor Tabs
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart /> },
    { id: 'patients', label: 'Patients', icon: <Users /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp /> }
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
    
    return 'Doctor';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading doctor dashboard...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Failed to Load Doctor Dashboard</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
  onClick={() => window.location.reload()}  // ✅ Reload page instead
  className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
>
  Try Again
</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
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
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Stethoscope className="h-7 w-7 text-white" />
              </div>
              <div>


           <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">
                {/* ✅ IST greeting */}
                Good {greeting}, Dr. <span className="capitalize">{displayName}</span>!
              </h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                <span className="flex items-center font-medium">
                  <Calendar className="h-4 w-4 mr-1.5 text-slate-400" />
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
                  <Clock className="h-4 w-4 mr-1.5 text-slate-400" />
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
                  placeholder="Search patients, records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-64 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm placeholder:text-slate-400"
                />
              </div>

              {/* Quick Actions Button */}
              <div className="relative">
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="p-2.5 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 relative"
                >
                  <Plus className="h-5 w-5" />
                </button>
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
                          <div className="text-slate-600 group-hover:text-emerald-600 transition-colors">{action.icon}</div>
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

        {/* Doctor Stats Cards */}
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
            <h3 className="text-sm font-medium text-slate-600 mb-2">Today's Patients</h3>
            <p className="text-3xl font-bold text-slate-900 mb-1.5 tracking-tight">{stats.today_patients_count || 0}</p>
            {/* <p className="text-xs text-slate-500 font-medium">{stats.today_patients_next || 'No appointments today'}</p> */}
          </motion.div>

          <motion.div variants={cardVariants} whileHover="hover" className="relative overflow-hidden bg-white rounded-2xl p-6 border border-slate-200 shadow-sm cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-slate-200 group-hover:bg-slate-100 transition-all">
                <Users className="h-5 w-5 text-slate-700" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-2">Active Patients</h3>
            <p className="text-3xl font-bold text-slate-900 mb-1.5 tracking-tight">{stats.active_patients_count || 0}</p>
            {/* <p className="text-xs text-slate-500 font-medium">{stats.active_patients_new_week || 0} new this week</p> */}
          </motion.div>

          <motion.div variants={cardVariants} whileHover="hover" className="relative overflow-hidden bg-white rounded-2xl p-6 border border-slate-200 shadow-sm cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-slate-200 group-hover:bg-slate-100 transition-all">
                <Award className="h-5 w-5 text-slate-700" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-2">Satisfaction Rate</h3>
            <p className="text-3xl font-bold text-slate-900 mb-1.5 tracking-tight">{stats.satisfaction_rate || 0}%</p>
            {/* <p className="text-xs text-slate-500 font-medium">{stats.satisfaction_rating || 0}★ average</p> */}
          </motion.div>

          <motion.div variants={cardVariants} whileHover="hover" className="relative overflow-hidden bg-white rounded-2xl p-6 border border-slate-200 shadow-sm cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-slate-200 group-hover:bg-slate-100 transition-all">
                <Clock className="h-5 w-5 text-slate-700" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-2">Consultation Time</h3>
            <p className="text-3xl font-bold text-slate-900 mb-1.5 tracking-tight">{stats.avg_consultation_time || 0} min</p>
            {/* <p className="text-xs text-slate-500 font-medium">Avg per patient</p> */}
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Patient Volume Analytics Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Patient Volume Analytics</h2>
                  {/* <p className="text-sm text-slate-500 mt-1.5">Weekly performance overview</p> */}
                </div>
                <div className="flex items-center space-x-3">
                  <select className="text-xs font-medium border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-700">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
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
                          <stop offset="0%" stopColor="rgb(16, 185, 129)" />
                          <stop offset="100%" stopColor="rgb(20, 184, 166)" />
                        </linearGradient>
                        
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.2" />
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
                            <motion.circle
                              cx={x}
                              cy={y}
                              r={hoveredPoint === index ? 12 : 0}
                              fill="rgb(16, 185, 129)"
                              opacity="0.2"
                              initial={{ r: 0 }}
                              animate={{ r: hoveredPoint === index ? 12 : 0 }}
                              transition={{ duration: 0.2 }}
                            />
                            
                            <motion.circle
                              cx={x}
                              cy={y}
                              r={hoveredPoint === index ? 6 : 4}
                              fill="white"
                              stroke={hoveredPoint === index ? "rgb(16, 185, 129)" : "rgb(20, 184, 166)"}
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
                                y={y - 100}
                                width="160"
                                height="90"
                              >
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="bg-slate-900 text-white text-xs py-3 px-4 rounded-xl font-medium shadow-2xl"
                                >
                                  <div className="text-center space-y-1">
                                    <div className="font-bold text-sm text-emerald-300">{data.day}</div>
                                    <div className="text-slate-200 font-semibold">{data.value}% Score</div>
                                    <div className="h-px bg-slate-700 my-1" />
                                    <div className="text-slate-300">👥 {data.patients} Patients</div>
                                    <div className="text-slate-300">💼 {data.consultations} Consults</div>
                                    <div className="text-slate-300">⭐ {data.satisfaction} Rating</div>
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
                          style={{ background: 'linear-gradient(to right, rgb(16, 185, 129), rgb(20, 184, 166))' }} 
                        />
                        <span className="text-slate-600 font-medium">Performance</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-slate-200 rounded-full" />
                        <span className="text-slate-600 font-medium">Target: 75%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {/* <div className="text-xs text-slate-500 mb-1">Weekly Average</div> */}
                      <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
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
                  <p className="text-sm text-slate-500 mt-1.5">Latest patient interactions</p>
                </div>
                <button 
                  onClick={() => navigate('/patients')}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center space-x-1 hover:gap-2 transition-all"
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
                        {activity.type === 'medication' && <Briefcase className="h-5 w-5" />}
                        {activity.type === 'vitals' && <Activity className="h-5 w-5" />}
                        {activity.type === 'prescription' && <FileText className="h-5 w-5" />}
                        {activity.type === 'report' && <Download className="h-5 w-5" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1.5">
                          {activity.patient && (
                            <>
                              <span className="text-lg">{activity.avatar}</span>
                              <span className="font-semibold text-slate-900">{activity.patient}</span>
                            </>
                          )}
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
            
            {/* Today's Schedule */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-7">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Today's Schedule</h2>
                  {/* <p className="text-sm text-slate-500 mt-1.5">{upcomingAppointments.length} appointments</p> */}
                </div>
                <button 
                  onClick={() => navigate('/appointments')}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  Manage
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
                              {appointment.patient_name}
                            </h3>
                            <span className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 font-medium mb-3">
                            {appointment.appointment_type}
                          </p>
                          <div className="flex items-center text-xs text-slate-600 space-x-4 font-medium">
                            <span className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                              {appointment.time}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                              {appointment.date}
                            </span>
                            {appointment.duration && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span>{appointment.duration}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {appointment.date === 'Today' && (
                        <div className="flex space-x-2 pt-3 border-t border-slate-100">
                          <button className="flex-1 py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all text-xs font-semibold flex items-center justify-center space-x-2">
                            <Video className="h-4 w-4" />
                            <span>Start Call</span>
                          </button>
                          <button className="p-2.5 text-slate-600 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors border border-slate-200">
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
                  <p className="mb-4">No appointments scheduled</p>
                  <button
                    onClick={() => navigate('/appointments')}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    Manage Schedule
                  </button>
                </div>
              )}
            </motion.div>

            {/* AI Insights */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-7 border border-emerald-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-6">
                {/* <div className="p-3 bg-white rounded-xl mr-4 shadow-sm border border-slate-100">
                  <Bot className="h-6 w-6 text-emerald-600" />
                </div> */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center">
                    AI Insights
                    <Sparkles className="h-4 w-4 ml-2 text-emerald-500" />
                  </h2>
                  {/* <p className="text-xs text-slate-600 mt-0.5">Powered by advanced ML</p> */}
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <h3 className="font-semibold mb-3 flex items-center text-slate-900">
                    <Zap className="h-4 w-4 mr-2 text-emerald-600" />
                    Key Performance
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Patient satisfaction increased by 15% this month. Your average consultation time is 18% more efficient than peers.
                  </p>
                </div>
                <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <h3 className="font-semibold mb-3 flex items-center text-slate-900">
                    <Target className="h-4 w-4 mr-2 text-teal-600" />
                    Smart Suggestion
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Schedule follow-ups for 5 patients showing positive recovery trends. Predicted success rate: 94%.
                  </p>
                </div>
              </div>
              <button className="w-full mt-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40">
                View Full Analysis
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
