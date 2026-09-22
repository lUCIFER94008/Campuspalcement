'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import {
  Briefcase,
  FileText,
  CheckCircle2,
  Sparkles,
  Award,
  ArrowRight
} from 'lucide-react';

export default function StudentDashboard() {
  const [student, setStudent] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/students/profile').then((r) => r.json()),
      fetch('/api/jobs').then((r) => r.json()),
      fetch('/api/applications').then((r) => r.json()),
    ])
      .then(([profRes, jobRes, appRes]) => {
        if (profRes.success && profRes.student) setStudent(profRes.student);
        if (jobRes.success && jobRes.jobs) setJobs(jobRes.jobs);
        if (appRes.success && appRes.applications) setApplications(appRes.applications);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const studentName = student?.name || 'Student';
  const cgpaDisplay = student?.cgpa ? `${student.cgpa} CGPA` : 'Not added';
  const deptDisplay = student?.department || 'Not added';

  // Determine overall selection status
  const selectedApp = applications.find(
    (a) => (a.status || '').toUpperCase() === 'SELECTED' || (a.status || '').toUpperCase() === 'PLACED'
  );
  const isSelected = !!selectedApp || (student?.placementStatus || '').toUpperCase() === 'PLACED';

  const latestStatus = isSelected
    ? 'SELECTED'
    : applications.length > 0
    ? (applications[0].status || 'APPLIED').toUpperCase()
    : 'NOT APPLIED';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="STUDENT" userName={studentName} userEmail={student?.email || ''} />

      <main className="flex-1 ml-64 p-8 max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Good morning, {studentName.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Here's your real-time campus placement overview.
            </p>
          </div>

          <Link
            href="/student/jobs"
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Briefcase className="w-4 h-4" /> Explore Jobs
          </Link>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="p-5 rounded-card glass-panel shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Eligible Jobs</span>
              <Briefcase className="w-4 h-4 text-brand-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {loading ? '...' : `${jobs.length} Available`}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {deptDisplay !== 'Not added' ? `Dept: ${deptDisplay}` : 'Update profile for matching'}
            </span>
          </div>

          <div className="p-5 rounded-card glass-panel shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>My Applications</span>
              <FileText className="w-4 h-4 text-brand-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {loading ? '...' : `${applications.length} Applied`}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {applications.length > 0 ? 'Active Submissions' : '0 applications submitted'}
            </span>
          </div>

          {/* Selection Status Card */}
          <div className="p-5 rounded-card glass-panel shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Selection Status</span>
              <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-brand-600'}`} />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <p
                className={`text-2xl font-extrabold uppercase ${
                  isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                }`}
              >
                {loading ? '...' : latestStatus}
              </p>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {isSelected ? '✓ Official Selection Confirmed' : 'Campus recruitment stage'}
            </span>
          </div>

          <div className="p-5 rounded-card glass-panel shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Academic Criteria</span>
              <Award className="w-4 h-4 text-brand-600" />
            </div>
            <p className="text-lg font-bold text-brand-600 dark:text-brand-400 mt-2 truncate uppercase">
              {cgpaDisplay}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">Backlogs: {student?.backlogs ?? 0}</span>
          </div>
        </div>

        {/* AI Career Assistant Banner */}
        <div className="mt-8 p-6 rounded-card glass-panel shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center shrink-0 border border-brand-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Resume & Job Matcher</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {student?.skills?.length > 0
                  ? `Profile configured with ${student.skills.length} technical skills.`
                  : 'Complete your profile and upload your resume to generate job match scores.'}
              </p>
            </div>
          </div>
          <Link
            href="/student/resume"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shrink-0 transition-all shadow-sm"
          >
            Run AI Resume Check
          </Link>
        </div>

        {/* Opportunities Grid & Placement Status Box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Campus Opportunities</h2>
              <Link href="/student/jobs" className="text-xs text-brand-600 font-semibold hover:underline">
                View All Jobs →
              </Link>
            </div>

            {jobs.length === 0 ? (
              <div className="p-8 rounded-card glass-panel text-center text-slate-500 text-xs">
                No job opportunities available yet. Check back when companies post drives.
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id || job._id}
                    className="p-5 rounded-card glass-panel shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 font-bold flex items-center justify-center text-xs shrink-0">
                        {job.companyName ? job.companyName.charAt(0) : 'C'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                            {job.title}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {job.companyName} • {job.location} • {job.salary}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/student/jobs/${job.id || job._id}`}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shrink-0 transition-colors text-center"
                    >
                      View Opportunity
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Placement Status Summary Box */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Placement Summary</h2>
            <div className="p-6 rounded-card glass-panel shadow-sm space-y-4 border border-slate-200/80 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Current Status</span>
                <h4
                  className={`text-lg font-extrabold mt-0.5 uppercase ${
                    isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {isSelected ? '✓ SELECTED' : latestStatus}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {isSelected
                    ? `Congratulations! Selected for ${selectedApp?.jobTitle || selectedApp?.jobId?.title || 'Position'}.`
                    : 'Track your application status and progress in real time.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex flex-col gap-2">
                <Link
                  href="/student/applications"
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  View My Applications <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/student/status"
                  className="w-full py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all"
                >
                  Placement Record
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
