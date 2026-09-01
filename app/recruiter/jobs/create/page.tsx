'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { ShieldCheck, ArrowRight, CheckCircle2, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateJobWizardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    title: '',
    description: '',
    responsibilities: '',
    skills: '',
    salary: '',
    location: '',
    jobType: 'FULL_TIME',
    workMode: 'ON_SITE',
    minCgpa: '7.0',
    maxBacklogs: '0',
    eligibleDepartments: ['CSE', 'IT', 'ECE'],
    eligibleBatches: ['2026'],
    deadline: '2026-10-30',
  });

  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const toggleDept = (dept: string) => {
    if (form.eligibleDepartments.includes(dept)) {
      setForm({ ...form, eligibleDepartments: form.eligibleDepartments.filter((d) => d !== dept) });
    } else {
      setForm({ ...form, eligibleDepartments: [...form.eligibleDepartments, dept] });
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          skills: form.skills.split(',').map((s) => s.trim()),
          responsibilities: form.responsibilities.split('\n').filter(Boolean),
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Job opportunity published live successfully!');
        router.push('/recruiter/dashboard');
      } else {
        toast.error(data.message || 'Failed to publish job');
      }
    } catch {
      toast.error('Network error creating job');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="RECRUITER" userName={user?.name || 'Recruiter'} userEmail={user?.email || ''} />

      <main className="flex-1 ml-64 p-8 max-w-4xl">
        <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Post New Placement Job
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Multi-step wizard with server-side eligibility rules</p>
        </div>

        {/* Wizard Steps Bar */}
        <div className="grid grid-cols-5 gap-2 mt-8 text-center text-xs font-bold">
          {['1. Basic Info', '2. Job Details', '3. Eligibility', '4. Selection', '5. Preview & Publish'].map((label, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border transition-all ${
                step === idx + 1
                  ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                  : step > idx + 1
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="p-6 rounded-card glass-panel shadow-sm space-y-6 mt-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Step 1: Basic Opportunity Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Software Development Engineer I (SDE-1)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Annual CTC Package *
                  </label>
                  <input
                    type="text"
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                    placeholder="e.g. ₹ 18.0 LPA"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 font-bold text-xs outline-none focus:border-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Bengaluru / Remote"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!form.title || !form.salary}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Job Details */}
        {step === 2 && (
          <div className="p-6 rounded-card glass-panel shadow-sm space-y-6 mt-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Step 2: Job Description & Skills</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Job Description
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the role responsibilities and team stack..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Required Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="React, Next.js, Node.js, Python, TypeScript"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-600"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
              >
                Next: Eligibility <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Eligibility Rules */}
        {step === 3 && (
          <div className="p-6 rounded-card glass-panel shadow-sm space-y-6 mt-8">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <ShieldCheck className="w-5 h-5 text-brand-600" /> Step 3: Server Eligibility Criteria
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Minimum Cutoff CGPA
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.minCgpa}
                  onChange={(e) => setForm({ ...form, minCgpa: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-brand-600 font-bold text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Max Allowed Backlogs
                </label>
                <input
                  type="number"
                  value={form.maxBacklogs}
                  onChange={(e) => setForm({ ...form, maxBacklogs: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-brand-600 font-bold text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-2">
                Eligible Departments
              </label>
              <div className="flex flex-wrap gap-2">
                {['CSE', 'IT', 'ECE', 'MECH', 'EEE'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDept(d)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      form.eligibleDepartments.includes(d)
                        ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {d} {form.eligibleDepartments.includes(d) && '✓'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
              >
                Next: Selection <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4 & 5: Preview & Publish */}
        {(step === 4 || step === 5) && (
          <div className="p-6 rounded-card glass-panel shadow-sm space-y-6 mt-8">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Eye className="w-5 h-5 text-brand-600" /> Live Opportunity Preview
            </h3>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-3">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">{form.title || 'Untitled Role'}</h4>
              <p className="text-xs text-emerald-600 font-bold">{form.salary} • {form.location}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{form.description}</p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-brand-600 font-medium">
                Eligibility: Min CGPA {form.minCgpa} • Max Backlogs {form.maxBacklogs} • Departments: {form.eligibleDepartments.join(', ')}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Edit Details
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2"
              >
                {publishing ? 'Publishing...' : 'Publish Job Live'}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
