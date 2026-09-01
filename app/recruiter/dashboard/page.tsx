'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Building2, PlusSquare } from 'lucide-react';

export default function RecruiterDashboard() {
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((r) => r.json()),
      fetch('/api/jobs').then((r) => r.json()),
      fetch('/api/applications').then((r) => r.json()),
      fetch('/api/interviews').then((r) => r.json()),
    ])
      .then(([userRes, jobRes, appRes, intRes]) => {
        if (userRes.success && userRes.user) setUser(userRes.user);
        if (jobRes.success && jobRes.jobs) setJobs(jobRes.jobs);
        if (appRes.success && appRes.applications) setApplicants(appRes.applications);
        if (intRes.success && intRes.interviews) setInterviews(intRes.interviews);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const shortlistedCount = applicants.filter((a) => (a.status || '').toUpperCase() === 'SHORTLISTED' || (a.status || '').toUpperCase() === 'INTERVIEW').length;
  const selectedCount = applicants.filter((a) => (a.status || '').toUpperCase() === 'SELECTED').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="RECRUITER" userName={user?.name || 'Recruiter'} userEmail={user?.email || ''} />

      <main className="flex-1 ml-64 p-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
              <Building2 className="w-3.5 h-3.5" /> Recruiter Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Recruitment Overview
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Manage corporate job postings and candidate pipelines
            </p>
          </div>

          <Link
            href="/recruiter/jobs/create"
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <PlusSquare className="w-4 h-4" /> Post New Job
          </Link>
        </div>

        {/* 5 Real Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
          <div className="p-5 rounded-card glass-panel shadow-sm">
            <span className="text-xs font-medium text-slate-500">Active Jobs</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5">
              {loading ? '...' : jobs.length}
            </p>
            <span className="text-[11px] text-brand-600 font-medium mt-1 block">Posted Opportunities</span>
          </div>

          <div className="p-5 rounded-card glass-panel shadow-sm">
            <span className="text-xs font-medium text-slate-500">Applicants</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5">
              {loading ? '...' : applicants.length}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">Total Submitted</span>
          </div>

          <div className="p-5 rounded-card glass-panel shadow-sm">
            <span className="text-xs font-medium text-slate-500">Shortlisted</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5">
              {loading ? '...' : shortlistedCount}
            </p>
            <span className="text-[11px] text-brand-600 font-medium mt-1 block">Candidates</span>
          </div>

          <div className="p-5 rounded-card glass-panel shadow-sm">
            <span className="text-xs font-medium text-slate-500">Interviews</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5">
              {loading ? '...' : interviews.length}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">Scheduled</span>
          </div>

          <div className="p-5 rounded-card glass-panel shadow-sm">
            <span className="text-xs font-medium text-slate-500">Selected</span>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1.5">
              {loading ? '...' : selectedCount}
            </p>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Offers Extended</span>
          </div>
        </div>

        {/* Applicants Table or Empty State */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Applicants</h2>
            <Link href="/recruiter/applicants" className="text-xs text-brand-600 font-semibold hover:underline">
              Manage Applicants →
            </Link>
          </div>

          {applicants.length === 0 ? (
            <div className="p-12 rounded-card glass-panel text-center text-slate-500 text-xs">
              No applications submitted yet. Posted jobs will display applicant submissions here.
            </div>
          ) : (
            <div className="rounded-card glass-panel shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-200/60 dark:border-slate-800 uppercase text-[10px] tracking-wider">
                    <th className="p-4">Candidate</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">CGPA</th>
                    <th className="p-4">Job Title</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {applicants.map((app) => {
                    const sName = app.studentName || app.studentId?.name || 'Student';
                    const sDept = app.studentDept || app.studentId?.department || 'N/A';
                    const sCgpa = app.studentCgpa || app.studentId?.cgpa || 'N/A';
                    const jTitle = app.jobTitle || app.jobId?.title || 'Job';
                    const appDate = app.appliedDate || (app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent');

                    return (
                      <tr key={app.id || app._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-bold text-slate-900 dark:text-white">{sName}</td>
                        <td className="p-4 text-slate-600 dark:text-slate-300">{sDept}</td>
                        <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">{sCgpa}</td>
                        <td className="p-4 text-slate-600 dark:text-slate-300">{jTitle}</td>
                        <td className="p-4 text-slate-500">{appDate}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-600 text-[10px] font-semibold">
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
