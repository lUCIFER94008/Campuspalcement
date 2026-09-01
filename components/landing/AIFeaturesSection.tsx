'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Target, LineChart } from 'lucide-react';

export function AIFeaturesSection() {
  return (
    <section id="ai-tools" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wider text-brand-600 dark:text-brand-400 font-bold mb-2 block flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-bright" />
            AI PLACEMENT SUITE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Smarter placement decisions.
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm">
            AI-powered tools helping students prepare better and discover relevant opportunities.
          </p>
        </div>

        {/* Horizontal Glass AI Flow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 p-5 rounded-2xl glass-panel max-w-3xl mx-auto shadow-glass"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-center sm:text-left">
            <div className="font-bold text-slate-800 dark:text-slate-200">Student Profile</div>
            <span className="text-slate-400 hidden sm:inline">→</span>
            <div className="font-bold text-slate-800 dark:text-slate-200">Skills + CGPA</div>
            <span className="text-slate-400 hidden sm:inline">→</span>
            <div className="font-bold text-slate-800 dark:text-slate-200">Job Criteria</div>
            <span className="text-slate-400 hidden sm:inline">→</span>
            <span className="px-3 py-1 rounded-full bg-brand-600 text-white font-bold flex items-center gap-1 shadow-sm">
              92% MATCH <span className="w-1.5 h-1.5 rounded-full bg-yellow-bright" />
            </span>
          </div>
        </motion.div>

        {/* 3 Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass-card p-7 rounded-card"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 flex items-center justify-center mb-5 border border-brand-200">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI Resume Analyzer</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-4">
              Analyze resumes and identify core strengths, missing technical keywords, and skill gaps.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-[11px] text-slate-600 dark:text-slate-400 font-mono border border-slate-200/60 dark:border-slate-800 flex justify-between items-center">
              <span>Strength Index</span>
              <span className="font-bold text-brand-600">88/100</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-card p-7 rounded-card"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 flex items-center justify-center mb-5 border border-brand-200">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Smart Job Matching</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-4">
              Match students with relevant campus opportunities based on verified academic profiles.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-[11px] text-emerald-600 font-mono border border-slate-200/60 dark:border-slate-800 flex justify-between items-center">
              <span>Compatibility</span>
              <span className="font-bold text-emerald-600">High Match ✓</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass-card p-7 rounded-card"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 flex items-center justify-center mb-5 border border-brand-200">
              <LineChart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Placement Readiness</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-4">
              Help students understand preparation tiers and target appropriate product/service roles.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-[11px] text-slate-600 dark:text-slate-400 font-mono border border-slate-200/60 dark:border-slate-800 flex justify-between items-center">
              <span>Readiness Tier</span>
              <span className="font-bold text-brand-600">Tier-1 Ready</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
