'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from './theme-provider';
import { Sun, Moon, User, LogOut, Menu, X, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch {
      toast.error('Logout failed');
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'RECRUITER') return '/recruiter/dashboard';
    return '/student/dashboard';
  };

  return (
    <header className="fixed top-0 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none">
      <div
        className={`max-w-6xl mx-auto rounded-2xl pointer-events-auto transition-all duration-300 ${
          scrolled
            ? 'bg-white/88 dark:bg-[#0B0D12]/90 backdrop-blur-xl border border-white/80 dark:border-slate-800 shadow-glass'
            : 'bg-white/60 dark:bg-[#0B0D12]/60 backdrop-blur-lg border border-white/60 dark:border-slate-800/80 shadow-glass-sm'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          {/* Brand Logo with Blue Container + Small Yellow Accent */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold shadow-md transition-transform group-hover:scale-105">
              <span className="text-base font-black tracking-tighter">CH</span>
              {/* Signature Yellow Accent Dot */}
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-bright border-2 border-white dark:border-[#0B0D12]" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                CampusHire
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold leading-none">
                Placement Portal
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Link href="/" className="hover:text-brand-600 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/#features" className="hover:text-brand-600 dark:hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="hover:text-brand-600 dark:hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/#ai-tools" className="hover:text-brand-600 dark:hover:text-white transition-colors">
              AI Suite
            </Link>
          </nav>

          {/* Actions Right */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200/80 dark:border-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-bright" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={getDashboardLink()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-all shadow-sm group"
                >
                  <User className="w-3.5 h-3.5" />
                  Dashboard
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-bright" />
                </Link>
                <button
                  onClick={handleLogout}
                  aria-label="Log out"
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5 group"
                >
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Drawer Trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-bright" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#0B0D12]/95 backdrop-blur-xl px-4 pt-3 pb-6 rounded-b-2xl space-y-3">
            <Link href="/" className="block py-2 text-slate-700 dark:text-slate-200 font-medium text-sm">
              Home
            </Link>
            <Link href="/#features" className="block py-2 text-slate-700 dark:text-slate-200 font-medium text-sm">
              Features
            </Link>
            <Link href="/#how-it-works" className="block py-2 text-slate-700 dark:text-slate-200 font-medium text-sm">
              How It Works
            </Link>
            <Link href="/#ai-tools" className="block py-2 text-slate-700 dark:text-slate-200 font-medium text-sm">
              AI Suite
            </Link>
            {user ? (
              <Link
                href={getDashboardLink()}
                className="block w-full text-center py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login" className="w-full text-center py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs">
                  Sign In
                </Link>
                <Link href="/register" className="w-full text-center py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs">
                  Get Started →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
