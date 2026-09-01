'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative z-10">
      {/* Glass CTA Box */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-panel p-8 sm:p-14 rounded-card text-center relative overflow-hidden shadow-glass">
          {/* Yellow Floating Accent Behind CTA */}
          <div className="absolute -top-16 -right-16 w-60 h-60 bg-yellow-bright/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-brand-600/15 rounded-full blur-[90px] pointer-events-none" />

          <span className="text-xs uppercase tracking-wider text-brand-600 dark:text-brand-400 font-bold mb-2 block flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-bright" />
            GET STARTED TODAY
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Ready to simplify campus recruitment?
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
            Bring students, recruiters, and placement teams together on one platform.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/register"
              className="px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md flex items-center justify-center gap-2 transition-all group"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="px-7 py-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all hover:bg-white"
            >
              Explore Platform
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 text-xs text-slate-500 dark:text-slate-400 pt-12 border-t border-slate-200/80 dark:border-slate-800">
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold shadow-md">
                <span className="text-xs font-black">CH</span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-yellow-bright border-2 border-white" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">CampusHire</span>
            </Link>
            <p className="text-xs leading-relaxed max-w-xs text-slate-500 dark:text-slate-400">
              Where Talent Meets Opportunity. Next-generation glassmorphic placement management system.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-3 text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="#features" className="hover:text-brand-600 transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-brand-600 transition-colors">How It Works</Link></li>
              <li><Link href="#ai-tools" className="hover:text-brand-600 transition-colors">AI Suite</Link></li>
              <li><Link href="/login" className="hover:text-brand-600 transition-colors">Portal Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-3 text-xs uppercase tracking-wider">Portals</h4>
            <ul className="space-y-2">
              <li><Link href="/student/dashboard" className="hover:text-brand-600 transition-colors">Student Portal</Link></li>
              <li><Link href="/recruiter/dashboard" className="hover:text-brand-600 transition-colors">Recruiter Portal</Link></li>
              <li><Link href="/admin/dashboard" className="hover:text-brand-600 transition-colors">Placement Officer</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-3 text-xs uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-brand-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer Credits */}
        <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="flex items-center flex-wrap justify-center sm:justify-start gap-1.5">
            <span>© 2026 CampusHire. All rights reserved.</span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <span>
              Developed by{' '}
              <a
                href="https://www.pixelriftonline.online/?utm_source=chatgpt.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 hover:underline transition-colors"
              >
                Pixelrift
              </a>
            </span>
          </p>
          <p>Tagline: "Where Talent Meets Opportunity."</p>
        </div>
      </div>
    </footer>
  );
}
