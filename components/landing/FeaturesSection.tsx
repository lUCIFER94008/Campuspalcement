'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, ListTodo, Calendar, FileCheck, BarChart3, ArrowRight } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      title: 'Smart Eligibility',
      description: 'Automatically verify CGPA, department, batch, backlog, and criteria before students apply.',
      icon: ShieldCheck,
    },
    {
      title: 'Job Discovery',
      description: 'Find relevant campus opportunities using intelligent role and skill filters.',
      icon: Search,
    },
    {
      title: 'Application Tracking',
      description: 'Track every candidate application from submission to final offer selection.',
      icon: ListTodo,
    },
    {
      title: 'Interview Scheduling',
      description: 'Manage interview rounds, schedules, notifications, and meeting links in one place.',
      icon: Calendar,
    },
    {
      title: 'Resume Management',
      description: 'Upload, manage, and analyze student resumes with automated skill extraction.',
      icon: FileCheck,
    },
    {
      title: 'Placement Analytics',
      description: 'Understand placement performance through clear dashboards and institutional reports.',
      icon: BarChart3,
    },
  ];

  return (
    <section id="features" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wider text-brand-600 dark:text-brand-400 font-bold mb-2 block">
            ● PLATFORM FEATURES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Everything you need for campus placement.
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm">
            One platform connecting students, recruiters, and placement teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="glass-card p-7 rounded-card group relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-100 dark:border-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-5 group-hover:bg-yellow-bright group-hover:text-slate-900 group-hover:border-yellow-bright transition-all duration-300 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
