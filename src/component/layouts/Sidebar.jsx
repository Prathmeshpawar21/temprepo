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
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  CircleDollarSign,
  Activity,
  Calendar,
  Pill,
  FileText,
  User,
  Clock,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Info,
  HelpCircle,
  Settings,
  ChevronDown,
  Crown,
  Sparkles,
  Bell
} from 'lucide-react';
import { useAuth } from '../Authentication/AuthContext';
import { useSubscription } from '../Authentication/SubscriptionContext';

// Add your logo import here
import omnilogo from '../assets/sidebarlogo.png'; // Update path as needed

const SIDEBAR_WIDTH = '18rem';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleAssistant = () => setAssistantOpen((open) => !open);
  const { subscription, loading } = useSubscription();

  // Enhanced responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1024) {
        setSidebarOpen(false);
        setIsCollapsed(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on navigation for mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  if (!user) return null;

  const navLinks = [
    { 
      name: 'Home', 
      path: '/', 
      icon: <Activity size={20} />
    },
    { 
      name: 'Consultation', 
      path: '/new-consult', 
      icon: <MessageSquare size={20} />
    },
    { 
      name: 'Consult History', 
      path: '/consult-history', 
      icon: <Clock size={20} />
    },
    { 
      name: 'Bookings', 
      path: '/appointments', 
      icon: <Calendar size={20} />
    },
    { 
      name: 'Patient Records', 
      path: '/records', 
      icon: <FileText size={20} />
    },
    { 
      name: 'Medications', 
      path: '/medications', 
      icon: <Pill size={20} />
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: <User size={20} />
    },

    // {name: 'Subscription',
    //   path: '/subscription',
    //   icon: <CircleDollarSign />
    // },
  ];

  const handleLogout = () => {
    localStorage.removeItem('portal');
    logout();
    navigate('/select-portal');
  };

  const handleUpgrade = () => {
    navigate('/upgrade');
  };
  
  const sidebarWidth = isCollapsed ? '5rem' : SIDEBAR_WIDTH;

  return (
    <div className="relative">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Layout Container */}
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside
          style={{
            width: sidebarWidth,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="hidden lg:flex fixed left-0 top-0 bottom-0 z-50 bg-white border-r border-gray-100 shadow-sm flex-col"
        >
          {/* Header with Logo and Title */}
          <div className="px-6 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              {!isCollapsed ? (
                <div className="flex flex-col items-center w-full">
                  <img
                    src={omnilogo}
                    alt="AI Doctor Logo"
                    className="h-12 w-12 mb-3 cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  />
                  <h1 className="text-xl font-bold text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    AI Doctor
                  </h1>

                </div>
              ) : (
                <div className="flex justify-center w-full">
                  <img
                    src={omnilogo}
                    alt="Logo"
                    className="h-9 w-9 cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  />
                </div>
              )}
              
              {!isCollapsed && (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  aria-label="Toggle Sidebar"
                >
                  <Menu size={18} className="text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navLinks.map(({ name, path, icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`
                    group flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'text-gray-800 hover:bg-gray-50'
                    }
                  `}
                  title={isCollapsed ? name : ''}
                >
                  <span className={`${isActive ? 'text-emerald-600' : 'text-gray-700'} transition-colors flex-shrink-0`}>
                    {icon}
                  </span>
                  {!isCollapsed && (
                    <span className="truncate">{name}</span>
                  )}
                  {!isCollapsed && isActive && (
                    <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Premium Section */}
          {/* Subscription Plan Button - Desktop */}
          {!isCollapsed && !loading && (
            <div className="mx-4 mb-4">
              <button
                onClick={() => navigate('/subscription')}
                className={`
                  w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
                  flex items-center justify-between group hover:shadow-md
                  ${
                    subscription?.plan?.name === 'premium' || subscription?.plan?.name === 'pro'
                      ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 hover:border-purple-300'
                      : subscription?.plan?.name === 'standard' || subscription?.plan?.name === 'enterprise'
                      ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-300'
                      : subscription?.plan?.name === 'basic'
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300'
                      : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  {(subscription?.plan?.name === 'premium' || subscription?.plan?.name === 'pro') ? (
                    <Crown className="w-5 h-5 text-purple-600" />
                  ) : (subscription?.plan?.name === 'standard' || subscription?.plan?.name === 'enterprise') ? (
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  ) : subscription?.plan?.name === 'basic' ? (
                    <CircleDollarSign className="w-5 h-5 text-green-600" />
                  ) : (
                    <CircleDollarSign className="w-5 h-5 text-gray-600" />
                  )}
                  <div className="text-left">
                    <p className="text-xs text-gray-600 font-medium">Current Plan</p>
                    <p
                      className={`
                        text-sm font-bold capitalize
                        ${
                          (subscription?.plan?.name === 'premium' || subscription?.plan?.name === 'pro')
                            ? 'text-purple-700'
                            : (subscription?.plan?.name === 'standard' || subscription?.plan?.name === 'enterprise')
                            ? 'text-blue-700'
                            : subscription?.plan?.name === 'basic'
                            ? 'text-green-700'
                            : 'text-gray-700'
                        }
                      `}
                    >
                      {subscription?.plan?.display_name || 'Free Plan'}
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}



          {/* User Section */}
          <div className="p-4 border-t border-gray-100">
            <div className={`user-menu-container relative ${isCollapsed ? 'flex justify-center' : ''}`}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <div className="relative flex-shrink-0">
                  <img
  src={
    user.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.name || 'U'
    )}&background=d1fae5&color=065f46`
  }
  alt={user.first_name || user.name}
  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-100"
/>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
                </div>
         {!isCollapsed && (
                <>
                  <div className="flex-1 text-left">
                    {/* ✅ Show actual full name instead of username */}
                    <p className="font-semibold text-gray-800 truncate">
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user.first_name || user.name}
                    </p>
                    <p className="text-sm text-gray-600 capitalize truncate">{user.role}</p>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} 
                  />
                </>
              )}
              </button>

              {/* User Menu Dropdown */}
                {userMenuOpen && !isCollapsed && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-sm border border-gray-100 py-2 z-50">
                    
                    {/* Settings → already goes to /profile ✅ */}
                    <button
                      className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                      onClick={() => { navigate('/profile'); setUserMenuOpen(false); }}
                    >
                      <Settings size={16} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-800">Settings</span>
                    </button>

                    {/* Help & Support → /help-support ✅ */}
                    <button
                      className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                      onClick={() => { navigate('/help-support'); setUserMenuOpen(false); }}
                    >
                      <HelpCircle size={16} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-800">Help & Support</span>
                    </button>

                    {/* About → /about ✅ */}
                    <button
                      className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                      onClick={() => { navigate('/about'); setUserMenuOpen(false); }}
                    >
                      <Info size={16} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-800">About</span>
                    </button>

                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-red-50 transition-colors group"
                    >
                      <LogOut size={16} className="text-red-500" />
                      <span className="text-sm font-medium text-red-600">Sign Out</span>
                    </button>
                  </div>
                )}

              {/* Collapsed User Menu */}
              {isCollapsed && userMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-sm border border-gray-100 py-2 z-50 min-w-48">
                 <div className="px-4 py-2 border-b border-gray-100">
                    {/* ✅ Same fix for collapsed menu */}
                    <p className="font-semibold text-gray-800">
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user.first_name || user.name}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                  </div>
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors">
                    <Settings size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-800">Settings</span>
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors">
                    <HelpCircle size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-800">Help</span>
                  </button>
                  <hr className="my-2 border-gray-100" />
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} className="text-red-500" />
                    <span className="text-sm font-medium text-red-600">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>



        </aside>

        {/* Mobile Sidebar */}
<aside
  className={`
    fixed lg:hidden top-0 left-0 bottom-0 z-50 w-72 transition-transform duration-300 ease-in-out
    bg-white border-r border-gray-100 shadow-sm flex flex-col
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
  `}
>
  {/* Mobile Header with Logo and Title */}
  <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
    <div className="flex flex-col items-center flex-1">
      <img
        src={omnilogo}
        alt="AI Doctor Logo"
        className="h-10 w-10 mb-2"
      />
      <span className="text-lg font-bold text-gray-800">
        Cogni AI Doctor
      </span>
    </div>
    <button
      onClick={() => setSidebarOpen(false)}
      className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <X size={20} className="text-gray-600" />
    </button>
  </div>

  {/* Mobile Navigation - Scrollable */}
  <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
    {navLinks.map(({ name, path, icon }) => {
      const isActive = location.pathname === path;
      return (
        <Link
          key={path}
          to={path}
          onClick={() => setSidebarOpen(false)}
          className={`
            flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200
            ${isActive 
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
              : 'text-gray-800 hover:bg-gray-50'
            }
          `}
        >
          <span className={`${isActive ? 'text-emerald-600' : 'text-gray-700'} transition-colors`}>
            {icon}
          </span>
          <span className="truncate">{name}</span>
          {isActive && (
            <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full" />
          )}
        </Link>
      );
    })}
  </nav>

  {/* Subscription Plan Button - Mobile (Bottom) */}
  {!loading && (
    <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex-shrink-0">
      <button
        onClick={() => {
          navigate('/subscription');
          setSidebarOpen(false);
        }}
        className={`
          w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
          flex items-center justify-between group hover:shadow-md
          ${
            subscription?.plan?.name === 'premium' || subscription?.plan?.name === 'pro'
              ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 hover:border-purple-300'
              : subscription?.plan?.name === 'standard' || subscription?.plan?.name === 'enterprise'
              ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-300'
              : subscription?.plan?.name === 'basic'
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300'
              : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 hover:border-gray-300'
          }
        `}
      >
        <div className="flex items-center gap-2">
          {(subscription?.plan?.name === 'premium' || subscription?.plan?.name === 'pro') ? (
            <Crown className="w-5 h-5 text-purple-600" />
          ) : (subscription?.plan?.name === 'standard' || subscription?.plan?.name === 'enterprise') ? (
            <Sparkles className="w-5 h-5 text-blue-600" />
          ) : subscription?.plan?.name === 'basic' ? (
            <CircleDollarSign className="w-5 h-5 text-green-600" />
          ) : (
            <CircleDollarSign className="w-5 h-5 text-gray-600" />
          )}
          <div className="text-left">
            <p className="text-xs text-gray-600 font-medium">Current Plan</p>
            <p
              className={`
                text-sm font-bold capitalize
                ${
                  (subscription?.plan?.name === 'premium' || subscription?.plan?.name === 'pro')
                    ? 'text-purple-700'
                    : (subscription?.plan?.name === 'standard' || subscription?.plan?.name === 'enterprise')
                    ? 'text-blue-700'
                    : subscription?.plan?.name === 'basic'
                    ? 'text-green-700'
                    : 'text-gray-700'
                }
              `}
            >
              {subscription?.plan?.display_name || 'Free Plan'}
            </p>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  )}
</aside>


        {/* Mobile Top Bar */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-gray-100 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              <Menu size={20} />
            </button>
            <span className="text-lg font-bold text-gray-800">Omni AI Doctor</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors relative">
              <Bell size={20} className="text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full" />
            </button>
          <img
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user.name || 'U'
                )}&background=d1fae5&color=065f46`
              }
              alt={user.first_name || user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-100"
            />
          </div>
        </div>

        {/* Main Content */}
        <main
          style={{
            marginLeft: sidebarOpen && window.innerWidth >= 1024 ? sidebarWidth : 0,
            transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="flex-1 min-h-screen pt-16 lg:pt-0 overflow-y-auto overflow-x-hidden bg-gray-50"
        >
          <Outlet />
        </main>
      </div>

      {/* AI Assistant Button */}
      {/* <button
        onClick={toggleAssistant}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-xl text-white transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-200/30"
      >
        {assistantOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button> */}

      {/* AI Assistant Panel */}
      {/* <ChatBot isOpen={assistantOpen} onClose={toggleAssistant} /> */}
    </div>
  );
};

export default Sidebar;


