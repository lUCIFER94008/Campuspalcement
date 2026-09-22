'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { CheckCircle2, Award, FileText, Download, Eye, Sparkles, Building2, MapPin, Calendar, Briefcase } from 'lucide-react';
import { SelectionLetterModal } from '@/components/SelectionLetterModal';

export default function MyApplicationsPage() {
  const [student, setStudent] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Modal State for Selection Letter
  const [selectedAppForLetter, setSelectedAppForLetter] = useState<any>(null);

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
    const statusUpper = (app.status || '').toUpperCase();
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return statusUpper !== 'REJECTED';
    if (filter === 'SHORTLISTED') return statusUpper === 'SHORTLISTED';
    if (filter === 'SELECTED') return statusUpper === 'SELECTED' || statusUpper === 'PLACED';
    return statusUpper === filter;
  });

  const getStatusBadge = (status: string) => {
    const u = (status || '').toUpperCase();
    switch (u) {
      case 'SELECTED':
      case 'PLACED':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200';
      case 'SHORTLISTED':
        return 'bg-yellow-bright/20 text-yellow-amber border-yellow-bright';
      case 'REJECTED':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
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
          {['ALL', 'ACTIVE', 'SHORTLISTED', 'SELECTED', 'REJECTED'].map((f) => (
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
            {filteredApps.map((app) => {
              const statusUpper = (app.status || '').toUpperCase();
              const isSelected = statusUpper === 'SELECTED' || statusUpper === 'PLACED';
              const isShortlisted = isSelected || statusUpper === 'SHORTLISTED';
              const isUnderReview = isShortlisted || statusUpper === 'UNDER REVIEW' || statusUpper === 'UNDER_REVIEW';

              const companyName = app.companyName || app.jobId?.companyName || 'Corporate Partner';
              const jobTitle = app.jobTitle || app.jobId?.title || 'Job Opportunity';
              const salary = app.salary || app.jobId?.salary || 'Competitive Package';
              const location = app.location || app.jobId?.location || 'Corporate Office';
              const selectionDate = app.updatedAt
                ? new Date(app.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                : new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

              return (
                <div key={app.id || app._id} className="p-6 rounded-card glass-panel shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {jobTitle}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {companyName} • {location}
                      </p>
                    </div>

                    <span className={`px-3.5 py-1.5 rounded-full border text-xs font-bold text-center flex items-center gap-1.5 ${getStatusBadge(app.status)}`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {app.status}
                    </span>
                  </div>

                  {/* 4-Stage Application Pipeline */}
                  <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Application Pipeline</p>
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                      {/* Step 1: Applied */}
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        Applied ✓
                      </div>
                      {/* Step 2: Under Review */}
                      <div className={`p-2.5 rounded-xl border ${isUnderReview ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'}`}>
                        Under Review
                      </div>
                      {/* Step 3: Shortlisted */}
                      <div className={`p-2.5 rounded-xl border ${isShortlisted ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'}`}>
                        Shortlisted
                      </div>
                      {/* Step 4: Selected */}
                      <div className={`p-2.5 rounded-xl border ${isSelected ? 'bg-emerald-600 text-white font-black shadow-sm' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'}`}>
                        Selected
                      </div>
                    </div>
                  </div>

                  {/* Selected Candidate Confirmation Card & Selection Letter */}
                  {isSelected && (
                    <div className="mt-4 p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 shadow-sm">
                          🎉
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                            Congratulations!
                          </h4>
                          <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                            You have been officially selected for this campus placement opportunity.
                          </p>
                        </div>
                      </div>

                      {/* Offer Highlights Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200/80 dark:border-emerald-800/60 text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px] font-bold uppercase block">Company</span>
                          <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{companyName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] font-bold uppercase block">Position</span>
                          <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{jobTitle}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] font-bold uppercase block">Package</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{salary}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] font-bold uppercase block">Selection Date</span>
                          <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{selectionDate}</span>
                        </div>
                      </div>

                      {/* Selection Letter Section */}
                      <div className="pt-4 border-t border-emerald-200/60 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-emerald-600" /> Selection Letter
                          </h5>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            View or download your official placement offer confirmation letter
                          </p>
                        </div>

                        <div className="flex items-center gap-2.5 w-full sm:w-auto">
                          <button
                            onClick={() => setSelectedAppForLetter(app)}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Selection Letter
                          </button>
                          <button
                            onClick={() => setSelectedAppForLetter(app)}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Download className="w-3.5 h-3.5" /> Download Selection Letter
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Selection Letter Modal */}
      {selectedAppForLetter && (
        <SelectionLetterModal
          application={selectedAppForLetter}
          student={student}
          onClose={() => setSelectedAppForLetter(null)}
        />
      )}
    </div>
  );
}
