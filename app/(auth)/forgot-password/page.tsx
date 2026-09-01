'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Briefcase, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success('Password reset link sent to your email');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-card bg-white dark:bg-[#11141B] border border-slate-200/80 dark:border-[#20242D] shadow-elevation">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
            <Briefcase className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">CampusHire</span>
        </Link>

        {!submitted ? (
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Reset Your Password</h2>
            <p className="mt-1.5 text-xs text-slate-500">
              Enter your registered email address and we'll send password reset instructions.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                    placeholder="name@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
              >
                Send Reset Link
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Check your Inbox</h3>
            <p className="text-xs text-slate-500">
              We sent a password reset link to <span className="text-slate-900 dark:text-white font-semibold">{email}</span>.
            </p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
