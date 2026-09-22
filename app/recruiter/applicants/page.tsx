'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Search, CheckCircle2, UserCheck, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function ApplicantManagementPage() {
  const [user, setUser] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [tabFilter, setTabFilter] = useState<'PENDING' | 'SHORTLISTED' | 'SELECTED' | 'ALL'>('PENDING');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((r) => r.json()),
      fetch('/api/applications').then((r) => r.json()),
    ])
      .then(([userRes, appRes]) => {
        if (userRes.success && userRes.user) setUser(userRes.user);
        if (appRes.success && appRes.applications) setApplicants(appRes.applications);
        else setApplicants([]);
      })
      .catch(() => setApplicants([]))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (appId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setApplicants(
          applicants.map((a) => (a.id === appId || a._id === appId ? { ...a, status: newStatus } : a))
        );
        toast.success(
          newStatus === 'SHORTLISTED'
            ? 'Candidate shortlisted successfully!'
            : newStatus === 'SELECTED'
            ? 'Candidate selected successfully! Selection letter is now available to the student.'
            : `Application status set to ${newStatus}`
        );
      } else {
        toast.error(data.message || 'Unable to update candidate status');
      }
    } catch {
      toast.error('Unable to update candidate status. Please try again.');
    }
  };

  const filteredApplicants = applicants.filter((a) => {
    const sName = a.studentName || a.studentId?.name || '';
    const jTitle = a.jobTitle || a.jobId?.title || '';
    const sDept = a.studentDept || a.studentId?.department || '';
    const statusUpper = (a.status || '').toUpperCase();

    const matchSearch =
      sName.toLowerCase().includes(search.toLowerCase()) ||
      jTitle.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'ALL' || sDept === deptFilter;

    let matchTab = true;
    if (tabFilter === 'PENDING') {
      matchTab = statusUpper === 'APPLIED' || statusUpper === 'UNDER REVIEW' || statusUpper === 'UNDER_REVIEW';
    } else if (tabFilter === 'SHORTLISTED') {
      matchTab = statusUpper === 'SHORTLISTED';
    } else if (tabFilter === 'SELECTED') {
      matchTab = statusUpper === 'SELECTED' || statusUpper === 'PLACED';
    }

    return matchSearch && matchDept && matchTab;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="RECRUITER" userName={user?.name || 'Recruiter'} userEmail={user?.email || ''} />

      <main className="flex-1 ml-64 p-8 max-w-7xl">
        <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Applicant Management
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Review candidates, shortlist profiles, and select candidates for final placement
            </p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={() => setTabFilter('PENDING')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              tabFilter === 'PENDING'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Pending Applicants ({applicants.filter((a) => (a.status || '').toUpperCase() === 'APPLIED' || (a.status || '').toUpperCase() === 'UNDER_REVIEW').length})
          </button>
          <button
            onClick={() => setTabFilter('SHORTLISTED')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              tabFilter === 'SHORTLISTED'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Shortlisted ({applicants.filter((a) => (a.status || '').toUpperCase() === 'SHORTLISTED').length})
          </button>
          <button
            onClick={() => setTabFilter('SELECTED')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              tabFilter === 'SELECTED'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Selected Candidates ({applicants.filter((a) => (a.status || '').toUpperCase() === 'SELECTED' || (a.status || '').toUpperCase() === 'PLACED').length})
          </button>
          <button
            onClick={() => setTabFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              tabFilter === 'ALL'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            All Submissions ({applicants.length})
          </button>
        </div>

        {/* Search & Filters */}
        <div className="mt-4 p-4 rounded-card glass-panel shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name or job role..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
            </select>
          </div>
        </div>

        {/* Table or Empty State */}
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading applicants...</div>
        ) : filteredApplicants.length === 0 ? (
          <div className="mt-8 p-12 rounded-card glass-panel text-center shadow-sm space-y-3">
            <UserCheck className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No applicants found in this tab.
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {tabFilter === 'PENDING'
                ? 'No pending applications requiring shortlisting.'
                : 'No candidates matched the current search filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="mt-8 rounded-card glass-panel shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-200/60 dark:border-slate-800 uppercase text-[10px] tracking-wider">
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">CGPA</th>
                  <th className="p-4">Job Role</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredApplicants.map((app) => {
                  const sName = app.studentName || app.studentId?.name || 'Student';
                  const sDept = app.studentDept || app.studentId?.department || 'N/A';
                  const sCgpa = app.studentCgpa || app.studentId?.cgpa || 'N/A';
                  const jTitle = app.jobTitle || app.jobId?.title || 'Job';
                  const statusUpper = (app.status || '').toUpperCase();
                  const isSelected = statusUpper === 'SELECTED' || statusUpper === 'PLACED';
                  const isShortlisted = statusUpper === 'SHORTLISTED';

                  return (
                    <tr key={app.id || app._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {sName[0]}
                        </div>
                        {sName}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{sDept}</td>
                      <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">{sCgpa}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{jTitle}</td>
                      <td className="p-4 text-slate-500">{app.appliedDate || 'Recent'}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : isShortlisted
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-brand-50 text-brand-600 border border-brand-200'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {isSelected ? (
                          <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold shadow-sm inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Selected
                          </span>
                        ) : isShortlisted ? (
                          <div className="inline-flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Shortlisted
                            </span>
                            <button
                              onClick={() => updateStatus(app.id || app._id, 'SELECTED')}
                              className="px-3 py-1 rounded-lg bg-brand-600 text-white hover:bg-brand-700 font-bold text-[10px] shadow-sm flex-inline items-center gap-1 transition-all"
                            >
                              <Award className="w-3 h-3 inline mr-1" /> Select Candidate
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => updateStatus(app.id || app._id, 'SHORTLISTED')}
                              className="px-3 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-[10px] shadow-sm transition-all"
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => updateStatus(app.id || app._id, 'SELECTED')}
                              className="px-3 py-1 rounded-lg bg-brand-600 text-white hover:bg-brand-700 font-semibold text-[10px] shadow-sm transition-all"
                            >
                              Select
                            </button>
                            <button
                              onClick={() => updateStatus(app.id || app._id, 'REJECTED')}
                              className="px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-[10px] border border-red-200 transition-all"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
