'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function CompaniesGrid() {
  const companies = [
    { name: 'TCS', role: 'IT Services' },
    { name: 'Infosys', role: 'Technology' },
    { name: 'Wipro', role: 'Digital Services' },
    { name: 'Accenture', role: 'Consulting' },
    { name: 'Deloitte', role: 'Enterprise Risk' },
    { name: 'IBM', role: 'Cloud & AI' },
    { name: 'Microsoft', role: 'Software' },
    { name: 'Google', role: 'Product & AI' },
  ];

  const marqueeItems = [...companies, ...companies, ...companies, ...companies];

  return (
    <section className="py-12 relative z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden">
          {/* Subtle top yellow accent line */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-yellow-bright to-transparent opacity-70" />

          {/* Explicit Heading */}
          <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-6 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-bright shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
            EXAMPLE RECRUITMENT PARTNERS (DEMO PROFILES)
          </p>

          {/* Marquee Outer Container */}
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <motion.div
              className="flex items-center gap-4 w-max"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                duration: 25,
                ease: 'linear',
                repeat: Infinity,
              }}
            >
              {marqueeItems.map((c, i) => (
                <div
                  key={i}
                  className="w-44 shrink-0 p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-center transition-all duration-200 hover:border-brand-500/50 hover:shadow-sm group"
                >
                  <span className="font-bold text-xs text-slate-700 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-white transition-colors block">
                    {c.name}
                  </span>
                  <span className="block text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                    {c.role}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
