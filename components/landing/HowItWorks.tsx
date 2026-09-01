'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Create Profile',
      desc: 'Build your verified student profile with CGPA, backlogs, technical skills, and resume.',
    },
    {
      num: '02',
      title: 'Discover Jobs',
      desc: 'Instant eligibility matching against top recruiters like Microsoft, TCS, & Deloitte.',
    },
    {
      num: '03',
      title: 'Apply & Interview',
      desc: 'One-click application submission followed by direct technical interview scheduling.',
    },
    {
      num: '04',
      title: 'Get Selected',
      desc: 'Receive offer letters, confirm joining details, and log your placement record.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wider text-brand-600 dark:text-brand-400 font-bold mb-2 block flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-bright" />
            HOW IT WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Four simple steps to get placed.
          </h2>
        </div>

        <div className="relative">
          {/* Connecting Blue Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200/80 dark:bg-slate-800 -translate-y-1/2 z-0">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-brand-600 via-brand-500 to-yellow-bright origin-left"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="glass-card p-6 rounded-card text-left relative group hover:border-brand-500/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-brand-600 dark:text-brand-400 group-hover:text-yellow-amber transition-colors">
                    {step.num}
                  </span>
                  {/* Yellow Accent Indicator */}
                  <span className="w-3 h-3 rounded-full bg-yellow-bright shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
