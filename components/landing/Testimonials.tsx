'use client';

import React from 'react';
import { ShieldCheck, Cpu, Database } from 'lucide-react';

export function Testimonials() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Server-Side Eligibility Engine',
      description: 'Strict verification of candidate CGPA, backlogs, department, and batch eligibility before application submission.',
    },
    {
      icon: Cpu,
      title: 'AI Resume & Match Scoring',
      description: 'Instant automated extraction of technical skills, resume scoring, and job compatibility prediction.',
    },
    {
      icon: Database,
      title: 'Institutional Audit Records',
      description: 'Real-time MongoDB record-keeping ensuring complete reporting transparency for NIRF and NAAC accreditation.',
    },
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wider text-brand-600 dark:text-brand-400 font-bold mb-2 block flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-bright" />
            PLATFORM ARCHITECTURE & GUARANTEES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Built for security, accuracy, and institutional scale.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-card p-7 rounded-card flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 flex items-center justify-center mb-4 border border-brand-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{item.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-brand-600 font-semibold flex items-center gap-1">
                  Verified Engine Standard ✓
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
