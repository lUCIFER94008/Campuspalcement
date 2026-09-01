'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';

export default function MyApplicationsPage() {
  const [student, setStudent] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/students/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.student) setStudent(data.student);
      })
      .catch(() => {});

    fetch('/api/applications')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.applications) setApplications(data.applications);
        else setApplications([]);
      })
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredApps = applications.filter((app) => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return app.status !== 'REJECTED';
    return app.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SELECTED':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'INTERVIEW':
        return 'bg-brand-50 text-brand-600 border-brand-200';
      case 'SHORTLISTED':
        return 'bg-yellow-bright/20 text-yellow-amber border-yellow-bright';
      case 'REJECTED':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="STUDENT" userName={student?.name || 'Student'} userEmail={student?.email || ''} />

      <main className="flex-1 ml-64 p-8 max-w-6xl">
        <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Applications
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Track real-time progress and application timelines across corporate recruitment drives
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-8">
          {['ALL', 'ACTIVE', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Applications List or Empty State */}
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading your applications...</div>
        ) : filteredApps.length === 0 ? (
          <div className="mt-8 p-12 rounded-card glass-panel text-center shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No applications submitted yet.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore available campus placement opportunities and submit your first application.
            </p>
            <Link
              href="/student/jobs"
              className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              Explore Opportunities
            </Link>
          </div>
        ) : (
          <div className="space-y-6 mt-8">
            {filteredApps.map((app) => (
              <div key={app.id || app._id} className="p-6 rounded-card glass-panel shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {app.jobTitle || app.jobId?.title || 'Job Application'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {app.companyName || app.companyId?.name || 'Partner Company'}
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full border text-xs font-bold text-center ${getStatusBadge(app.status)}`}>
                    {app.status}
                  </span>
                </div>

                {/* Status Timeline Bar */}
                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Application Pipeline</p>
                  <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                      Applied ✓
                    </div>
                    <div className={`p-2 rounded-xl border ${app.status !== 'APPLIED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                      Under Review
                    </div>
                    <div className={`p-2 rounded-xl border ${['SHORTLISTED', 'TEST', 'INTERVIEW', 'SELECTED'].includes(app.status) ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                      Shortlisted
                    </div>
                    <div className={`p-2 rounded-xl border ${['INTERVIEW', 'SELECTED'].includes(app.status) ? 'bg-brand-50 text-brand-600 border-brand-200 font-extrabold' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                      Interview
                    </div>
                    <div className={`p-2 rounded-xl border ${app.status === 'SELECTED' ? 'bg-emerald-600 text-white font-black' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                      Selected
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
