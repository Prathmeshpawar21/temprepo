/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Heart, 
  Shield, 
  UserPlus,
  Zap, 
  Brain, 
  Stethoscope, 
  Award,
  Star,
  Play,
  ArrowRight,
  CheckCircle,
  Globe,
  Clock,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  // Create a ref for the portal section
  const portalSectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ UPDATED: Handle portal selection with proper localStorage management
  const handleSelect = (role) => {
    console.log('🚪 Portal selected:', role);
    localStorage.setItem("portal", role);
    
    // Clear any previous portal-related data to avoid conflicts
    localStorage.removeItem('oauth_portal');
    
    // navigate("/authentication");
    navigate("/login");
  };

  // Smooth scroll to portal section
  const scrollToPortals = () => {
    portalSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  const features = [
    {
      icon: <Brain className="w-6 h-6 sm:w-7 md:w-8" />,
      title: "AI-Powered Diagnostics",
      description: "Advanced machine learning algorithms provide instant health insights and recommendations."
    },
    {
      icon: <Globe className="w-6 h-6 sm:w-7 md:w-8" />,
      title: "Telemedicine",
      description: "Connect with doctors worldwide through our advanced video consultation platform."
    },
    {
      icon: <Clock className="w-6 h-6 sm:w-7 md:w-8" />,
      title: "24/7 Virtual Care",
      description: "Round-the-clock access to healthcare professionals and AI consultations."
    },
    {
      icon: <BarChart3 className="w-6 h-6 sm:w-7 md:w-8" />,
      title: "Health Analytics",
      description: "Comprehensive health tracking with personalized insights and trends."
    },
    {
      icon: <Zap className="w-6 h-6 sm:w-7 md:w-8" />,
      title: "Instant Results",
      description: "Get lab results, prescriptions, and medical reports in real-time."
    },
    {
      icon: <Shield className="w-6 h-6 sm:w-7 md:w-8" />,
      title: "HIPAA Compliant Security",
      description: "Bank-level encryption ensures your medical data remains private and secure."
    }
  ];

  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Cardiologist",
      content: "AllCognix has revolutionized how I practice medicine. The AI insights are incredibly accurate.",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=64&h=64&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Jayesh Patil",
      role: "Patient",
      content: "Managing my health has never been easier. The interface is intuitive and the AI recommendations are spot-on.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Raj Mehta",
      role: "Patient",
      content: "The telemedicine feature allowed me to consult with a specialist without leaving my home. Highly recommend!",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=64&h=64&fit=crop&crop=face",
      rating: 5
    },
  ];

  const stats = [
    { number: "100+", label: "Active Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "10", label: "Healthcare Providers" },
    { number: "450+", label: "Consultations" }
  ];

  // Footer Links Data
  const footerLinks = {
    product: [
      { name: 'Symptom Checker', href: '#portals' },
      { name: 'Doctor Portal', href: '#portals' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Hospital Integration', href: '#' },
    ],
    company: [
      { name: 'About AllCognix', href: 'https://allcognix.com/about-us' },
      { name: 'Medical Board', href: '#' },
      { name: 'Careers', href: 'https://allcognix.com/careers' },
      { name: 'Health Blog', href: 'https://allcognix.com/resources/blogs' },
    ],
    resources: [
      { name: 'Patient Guides', href: '#' },
      { name: 'API Reference', href: '#' },
      { name: 'Clinical Research', href: 'https://allcognix.com/resources/research' },
      { name: 'Help Center', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: 'https://allcognix.com/privacy-policy' },
      { name: 'HIPAA Compliance', href: '#' },
      { name: 'Terms of Service', href: 'https://allcognix.com/terms-of-service' },
      { name: 'Patient Rights', href: '#' },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-gray-800 font-sans relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-br from-emerald-200/30 to-teal-200/20 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl animate-float" />
        <div className="absolute top-20 sm:top-40 right-5 sm:right-10 w-56 sm:w-96 h-56 sm:h-96 bg-gradient-to-br from-blue-200/20 to-emerald-200/30 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl animate-float-delayed" />
        <div className="absolute bottom-10 sm:bottom-20 left-1/2 -translate-x-1/2 w-48 sm:w-80 h-48 sm:h-80 bg-gradient-to-br from-green-200/25 to-cyan-200/20 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl animate-float-slow" />
      </div>

      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4 md:py-6">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  AI Doctor
                </h1>
                <p className="text-[9px] sm:text-xs text-emerald-600 font-semibold uppercase tracking-wider hidden xs:block">
                  AI Health Platform
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm lg:text-base text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-200 group-hover:w-full" />
                </a>
              ))}
              <button
                onClick={scrollToPortals}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-white text-sm lg:text-base font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105"
              >
                Get Started
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
                <span className={`block h-0.5 w-6 bg-gray-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-0.5 w-6 bg-gray-600 transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-6 bg-gray-600 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200"
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block text-base text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <button
                  onClick={() => {
                    scrollToPortals();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 rounded-full text-white font-semibold shadow-lg"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-100 rounded-full text-emerald-700 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span className="hidden sm:inline">Powered by Advanced AI Technology</span>
                <span className="sm:hidden">AI-Powered Healthcare</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6 px-2">
                The Future of
                <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mt-1 sm:mt-2">
                  Healthcare is Here
                </span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-10 lg:mb-12 leading-relaxed px-4">
                Experience revolutionary AI-powered healthcare that connects patients and doctors 
                through intelligent insights, seamless communication, and personalized care.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-10 sm:mb-12 lg:mb-16 px-4">
                <button
                  onClick={scrollToPortals}
                  className="group bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-white font-semibold shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105 flex items-center justify-center text-base sm:text-lg"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="flex justify-center">
                  <a
                    href="https://vimeo.com/1136509747?share=copy&fl=sv&fe=ci"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="group flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-gray-700 font-semibold hover:text-emerald-600 transition-colors text-base sm:text-lg">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center mr-3 group-hover:shadow-xl transition-shadow">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 ml-0.5" />
                      </div>
                      <span className="hidden sm:inline">Watch Demo</span>
                      <span className="sm:hidden">Demo</span>
                    </button>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-200/50"
                >
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-600 mb-1 sm:mb-2">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm lg:text-base text-gray-900 font-semibold">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portal Selection Cards */}
      <section 
        ref={portalSectionRef}
        id="portals"
        className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Choose Your Portal
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Access tailored experiences designed specifically for patients and healthcare providers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Patient Portal Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl"
              onClick={() => handleSelect('patient')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 flex justify-center mb-5 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-white" />

                </div>
              </div>

              <div className="relative z-10 text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Patient
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 leading-relaxed">
                  Manage your health journey with AI-powered insights, easy appointment scheduling, 
                  secure messaging with doctors, and health tracking.
                </p>
                
                <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 text-left">
                  {[
                    "AI Health Recommendations",
                    "Secure Doctor Messaging",
                    "Smart Appointment Booking",
                    "Personal Health Dashboard"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start text-xs sm:text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white py-3 sm:py-3.5 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 group-hover:shadow-xl text-sm sm:text-base">
                  Enter as Patient
                </button>
              </div>
            </motion.div>

            {/* Doctor Portal Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl"
              onClick={() => handleSelect('doctor')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 flex justify-center mb-5 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>

              <div className="relative z-10 text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Doctor
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 leading-relaxed">
                  Enhance your practice with AI-assisted diagnostics, streamlined patient management, 
                  intelligent scheduling, and comprehensive analytics tools.
                </p>
                
                <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 text-left">
                  {[
                    "AI-Assisted Diagnostics",
                    "Patient Management System",
                    "Advanced Analytics Dashboard",
                    "Telemedicine Integration"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start text-xs sm:text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 sm:py-3.5 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 group-hover:shadow-xl text-sm sm:text-base">
                  Enter as Doctor
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Powerful Features
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Discover the cutting-edge technologies that make AllCognix the most advanced healthcare platform
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              See what doctors and patients are saying about their experience with AllCognix
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-3 sm:mr-4 border-2 border-emerald-200"
                  />
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900">{testimonial.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to Transform Healthcare?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-emerald-100 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of healthcare providers and patients who are already experiencing the future of healthcare.
            </p>
            <button
              onClick={scrollToPortals}
              className="bg-white text-emerald-600 hover:bg-gray-50 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
            >
              Get Started Today
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative z-10 bg-gray-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-12 mb-12">
            
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-emerald-900/20">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">AllCognix</h3>
              </div>
              <p className="text-gray-400 mb-6 pr-0 md:pr-4 text-sm leading-relaxed">
                Revolutionizing healthcare through AI-powered solutions that connect patients and providers in meaningful, efficient ways.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer group">
                  <Mail size={18} className="mr-3 group-hover:animate-pulse" />
                  <span className="text-sm">support@allcognix.com</span>
                </div>
                <div className="flex items-center text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer group">
                  <MapPin size={18} className="mr-3" />
                  <span className="text-sm">Bengaluru, India</span>
                </div>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-emerald-400">Platform</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-emerald-400">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm" target="_blank" rel="noopener noreferrer">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-emerald-400">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-emerald-400">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm" target="_blank" rel="noopener noreferrer">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Divider & Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} AllCognix. All rights reserved
              </p>
              
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors transform hover:-translate-y-1">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors transform hover:-translate-y-1">
                  <Twitter size={20} />
                </a>
                <a href="https://www.linkedin.com/company/allcognix-ai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors transform hover:-translate-y-1">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors transform hover:-translate-y-1">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(-10px) rotate(-1deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(-1deg); }
          66% { transform: translateY(-25px) rotate(1deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(2deg); }
        }
        
        .animate-float { animation: float 20s infinite ease-in-out; }
        .animate-float-delayed { animation: float-delayed 25s infinite ease-in-out 5s; }
        .animate-float-slow { animation: float-slow 30s infinite ease-in-out 10s; }
        
        html {
          scroll-behavior: smooth;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
