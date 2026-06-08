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
import {
  HelpCircle, MessageSquare, Mail, ChevronDown, ChevronUp, Search
} from 'lucide-react';

const faqs = [
  {
    q: 'How do I start an AI consultation?',
    a: 'Go to "Consultation" in the sidebar. Speak or type your symptoms in your preferred language and the AI will respond with guidance.',
  },
  {
    q: 'Which languages are supported?',
    a: 'Hindi, Tamil, Telugu, Bengali, Marathi, English and more. Language is detected automatically.',
  },
  {
    q: 'How do I book a doctor appointment?',
    a: 'Navigate to "Bookings", pick a specialty, select a doctor, choose a time slot, and confirm.',
  },
  {
    q: 'How do I add a medication?',
    a: 'Go to "Medications" and click "Add Medication". Fill in name, dosage, and frequency.',
  },
  {
    q: 'How do I upgrade my plan?',
    a: 'Click your current plan badge in the sidebar or go to "Subscription" from the user menu.',
  },

];

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-800 pr-4">{question}</span>
        {open
          ? <ChevronUp size={16} className="text-teal-500 flex-shrink-0" />
          : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 text-sm text-gray-500 leading-relaxed bg-gray-50/50 border-t border-gray-100">
          {answer}
        </div>
      )}
    </div>
  );
};

const HelpSupport = () => {
  const [search, setSearch] = useState('');

  const filtered = faqs.filter(
    (f) =>
      !search ||
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-teal-50 rounded-xl">
          <HelpCircle size={22} className="text-teal-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-sm text-gray-400">Find answers or get in touch</p>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <a
          href="mailto:support@aidoctor.com"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-200 hover:shadow-sm transition-all"
        >
          <div className="p-2 bg-teal-50 rounded-lg">
            <Mail size={18} className="text-teal-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Email Support</p>
            <p className="text-xs text-gray-400">support@aidoctor.com</p>
          </div>
        </a>
        <a
          href="mailto:feedback@aidoctor.com"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all"
        >
          <div className="p-2 bg-blue-50 rounded-lg">
            <MessageSquare size={18} className="text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Send Feedback</p>
            <p className="text-xs text-gray-400">We reply within 24–48 hrs</p>
          </div>
        </a>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
          />
        </div>

        {/* Items */}
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No results found for "{search}"
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpSupport;
