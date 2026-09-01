'use client';

import React, { useState } from 'react';
import { User, Building2, ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function RoleBasedPreview() {
  const [activeTab, setActiveTab] = useState<'student' | 'recruiter' | 'admin'>('student');

  const previews = {
    student: {
      title: 'For Students',
      heading: 'Build your career. Find your opportunity.',
      bullets: [
        'Verified academic eligibility check for 100% application accuracy',
        'AI Resume Score & technical skill gap analyzer',
        'Real-time application tracking & interview notifications',
        'Personalized job discovery matched to your profile',
      ],
      tag: 'Student Dashboard',
    },
    recruiter: {
      title: 'For Recruiters',
      heading: 'Find qualified college talent faster.',
      bullets: [
        'Multi-step job posting with department & batch eligibility rules',
        'Filter & shortlist applicants by CGPA, skills, and test scores',
        'Direct interview scheduling and evaluation scorecards',
        'Manage placement drive applications in real time',
      ],
      tag: 'Recruiter Dashboard',
    },
    admin: {
      title: 'For Placement Officers',
      heading: 'Manage your entire placement operation.',
      bullets: [
        'Centralized dashboard tracking total placements, avg package & offers',
        'Company verification & recruitment drive management',
        'One-click CSV/PDF report generation for NAAC accreditation',
        'Real-time candidate placement logs & institutional metrics',
      ],
      tag: 'Placement Officer Panel',
    },
  };

  const activeData = previews[activeTab];

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider text-brand-600 dark:text-brand-400 font-bold mb-2 block">
            ● THREE POWERFUL PORTALS
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            One Platform. Three Powerful Portals.
          </h2>
        </div>

        {/* Glass Tabs Container */}
        <div className="flex justify-center gap-2 max-w-md mx-auto mb-12 p-1.5 rounded-2xl glass-panel shadow-sm">
          <button
            onClick={() => setActiveTab('student')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'student'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Student
            {activeTab === 'student' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-bright" />}
          </button>
          <button
            onClick={() => setActiveTab('recruiter')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'recruiter'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> Recruiter
            {activeTab === 'recruiter' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-bright" />}
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Officer
            {activeTab === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-bright" />}
          </button>
        </div>

        {/* Tab Content Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center p-8 sm:p-10 rounded-card glass-panel shadow-glass"
          >
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-bright" />
                {activeData.title}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {activeData.heading}
              </h3>

              <ul className="space-y-3 pt-2">
                {activeData.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                    <span className="w-5 h-5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 mt-0.5 border border-brand-200">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side Glass Dashboard Preview */}
            <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{activeData.tag}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200">
                  Live Sync ✓
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>Campus Placement Status</span>
                  <span className="text-brand-600">Active Drive</span>
                </div>
                <p className="text-xs text-slate-500">Real-time candidate pipeline with verified eligibility engine.</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
