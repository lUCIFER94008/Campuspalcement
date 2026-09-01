'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Users, TrendingUp, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28 text-slate-900 dark:text-slate-100">
      {/* Ambient background blur blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-yellow-bright/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-brand-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-bright shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
          <span className="text-brand-600 dark:text-brand-400 font-bold">SMART CAMPUS RECRUITMENT PLATFORM</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1]"
        >
          Where Talent Meets{' '}
          <span className="relative inline-block text-brand-600 dark:text-brand-400">
            Opportunity.
            <span className="absolute bottom-1 left-0 right-0 h-3 bg-yellow-bright/30 -z-10 rounded-full" />
          </span>
        </motion.h1>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          One powerful platform connecting students, recruiters, and placement teams with server-verified eligibility checking and automated recruitment pipelines.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/register"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all duration-200 transform hover:-translate-y-0.5 group"
          >
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#features"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl glass-card text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 font-semibold text-sm transition-all duration-200"
          >
            Explore Platform
          </Link>
        </motion.div>

        {/* Neutral Floating Product Preview (No Hardcoded Demo Values) */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 max-w-4xl mx-auto relative"
        >
          <div className="glass-panel rounded-2xl p-5 sm:p-7 text-left relative z-10">
            {/* Top Bar Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-bright" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                campushire.demo/student/dashboard
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 text-[11px] font-semibold border border-brand-200 dark:border-brand-800">
                Product Preview
              </span>
            </div>

            {/* Neutral Empty-State Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Eligible Jobs</span>
                  <Briefcase className="w-4 h-4 text-brand-600" />
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-2">Complete Profile</p>
                <span className="text-[11px] text-slate-500 mt-1 block">To see eligible opportunities</span>
              </div>

              <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Applications</span>
                  <Users className="w-4 h-4 text-brand-600" />
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-2">No Applications</p>
                <span className="text-[11px] text-slate-500 mt-1 block">Start exploring active jobs</span>
              </div>

              <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Interviews</span>
                  <TrendingUp className="w-4 h-4 text-brand-600" />
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-2">No Schedules</p>
                <span className="text-[11px] text-slate-500 mt-1 block">Interview rounds appear here</span>
              </div>
            </div>

            {/* Application Pipeline Workflow Map */}
            <div className="mt-4 p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                <span>Recruitment Pipeline Stage</span>
                <span className="text-brand-600">Standard Workflow</span>
              </div>
              <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-semibold">
                <div className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Profile</div>
                <div className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Eligibility</div>
                <div className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Apply</div>
                <div className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Interview</div>
                <div className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Selection</div>
              </div>
            </div>
          </div>

          {/* Neutral Product Badges */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden lg:flex items-center gap-3 p-3.5 rounded-xl glass-panel absolute -top-6 -right-6 z-20 shadow-glass border-brand-200 text-xs text-slate-800 dark:text-slate-100"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">AI Placement Suite</p>
              <p className="text-[10px] text-slate-500">Automated Candidate Matching Engine</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel absolute -bottom-5 -left-6 z-20 shadow-glass border-slate-200 text-xs font-bold text-slate-800 dark:text-slate-100"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-800 dark:text-slate-200 font-bold">Server-Side Eligibility Engine Active</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
