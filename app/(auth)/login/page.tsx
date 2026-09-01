'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        toast.success(`Welcome back, ${data.user.name}!`);

        if (callbackUrl) {
          router.push(callbackUrl);
        } else if (data.user.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else if (data.user.role === 'RECRUITER') {
          router.push('/recruiter/dashboard');
        } else {
          router.push('/student/dashboard');
        }
        router.refresh();
      } else {
        toast.error(data.message || 'Invalid email or password');
      }
    } catch {
      toast.error('Login request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row">
      {/* Left Branding Column */}
      <div className="lg:w-1/2 p-8 lg:p-16 bg-slate-50 dark:bg-[#11141B] flex flex-col justify-between border-r border-slate-200/80 dark:border-[#20242D]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">CampusHire</span>
          </Link>

          <div className="mt-20">
            <span className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider">
              SMART CAMPUS RECRUITMENT
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-4 leading-tight">
              Build Your Career. <br />
              Find Your Opportunity.
            </h1>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm max-w-md leading-relaxed">
              Access real-time placement eligibility, AI resume scoring, and direct campus hiring drives.
            </p>
          </div>
        </div>

        <div className="mt-12 text-xs text-slate-500">
          © {new Date().getFullYear()} CampusHire. Enterprise Campus Placement System.
        </div>
      </div>

      {/* Right Login Form */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Sign in to CampusHire</h2>
            <p className="mt-1.5 text-xs text-slate-500">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-brand-600 text-slate-900 dark:text-white text-xs outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-brand-600 hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-brand-600 text-slate-900 dark:text-white text-xs outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link href="/register" className="font-bold text-brand-600 hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-[#0B0D12] text-slate-900 flex items-center justify-center text-xs">Loading Sign In...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
