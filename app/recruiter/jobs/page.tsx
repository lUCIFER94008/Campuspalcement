'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { PlusSquare, MapPin, DollarSign } from 'lucide-react';

export default function RecruiterJobsListPage() {
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((r) => r.json()),
      fetch('/api/jobs').then((r) => r.json()),
    ])
      .then(([userRes, jobRes]) => {
        if (userRes.success && userRes.user) setUser(userRes.user);
        if (jobRes.success && jobRes.jobs) setJobs(jobRes.jobs);
        else setJobs([]);
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="RECRUITER" userName={user?.name || 'Recruiter'} userEmail={user?.email || ''} />

      <main className="flex-1 ml-64 p-8 max-w-6xl">
        <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Company Job Postings
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Manage corporate job postings and candidate criteria</p>
          </div>

          <Link
            href="/recruiter/jobs/create"
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <PlusSquare className="w-4 h-4" /> Post New Job
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading posted jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="mt-8 p-12 rounded-card glass-panel text-center shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No jobs posted yet.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create your first job opening to start receiving student applications.
            </p>
            <Link
              href="/recruiter/jobs/create"
              className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              Post Job Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {jobs.map((j) => (
              <div key={j.id || j._id} className="p-6 rounded-card glass-panel shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">{j.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{j.companyName}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200">
                      {j.status || 'ACTIVE'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-600" /> {j.location}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> {j.salary}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                  <span>Min CGPA: <strong>{j.minCgpa}</strong></span>
                  <span>Max Backlogs: <strong>{j.maxBacklogs}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
