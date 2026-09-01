'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, User, Mail, Lock, Building2, GraduationCap, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<'STUDENT' | 'RECRUITER'>('STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [batch, setBatch] = useState('2026');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all mandatory fields');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          name,
          email,
          password,
          registerNumber,
          department,
          batch,
          companyName,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Registration successful!');
        if (role === 'RECRUITER') {
          router.push('/recruiter/dashboard');
        } else {
          router.push('/student/dashboard');
        }
        router.refresh();
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch {
      toast.error('Network error during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row">
      {/* Left Branding */}
      <div className="lg:w-1/2 p-8 lg:p-16 bg-slate-50 dark:bg-[#11141B] flex flex-col justify-between border-r border-slate-200/80 dark:border-[#20242D]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">CampusHire</span>
          </Link>

          <div className="mt-16">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Join CampusHire Today</h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm max-w-md leading-relaxed">
              Create your account to discover placement drives, submit applications, or post placement opportunities.
            </p>
          </div>
        </div>

        <div className="mt-12 p-4 rounded-xl bg-white dark:bg-[#0B0D12] border border-slate-200/80 dark:border-slate-800">
          <p className="text-xs text-slate-500">
            Note: Placement Officer (Admin) accounts are provisioned internally and cannot be registered publicly.
          </p>
        </div>
      </div>

      {/* Right Form */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Create your Account</h2>
            <p className="mt-1.5 text-xs text-slate-500">Select your role to get started</p>
          </div>

          {/* Role Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setRole('STUDENT')}
              className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                role === 'STUDENT'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Student
            </button>
            <button
              type="button"
              onClick={() => setRole('RECRUITER')}
              className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                role === 'RECRUITER'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" /> Recruiter
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-600"
              />
            </div>

            {role === 'STUDENT' ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1.5">
                    Register No
                  </label>
                  <input
                    type="text"
                    value={registerNumber}
                    onChange={(e) => setRegisterNumber(e.target.value)}
                    placeholder="CS2026001"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1.5">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                  >
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="MECH">MECH</option>
                    <option value="EEE">EEE</option>
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1.5">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Microsoft, Google, TCS"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link href="/login" className="font-bold text-brand-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
