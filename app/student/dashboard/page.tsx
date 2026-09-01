'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import {
  Briefcase,
  FileText,
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';

export default function StudentDashboard() {
  const [student, setStudent] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/students/profile').then((r) => r.json()),
      fetch('/api/jobs').then((r) => r.json()),
      fetch('/api/applications').then((r) => r.json()),
      fetch('/api/interviews').then((r) => r.json()),
    ])
      .then(([profRes, jobRes, appRes, intRes]) => {
        if (profRes.success && profRes.student) setStudent(profRes.student);
        if (jobRes.success && jobRes.jobs) setJobs(jobRes.jobs);
        if (appRes.success && appRes.applications) setApplications(appRes.applications);
        if (intRes.success && intRes.interviews) setInterviews(intRes.interviews);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const studentName = student?.name || 'Student';
  const cgpaDisplay = student?.cgpa ? `${student.cgpa} CGPA` : 'Not added';
  const deptDisplay = student?.department || 'Not added';

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
              Here's your real-time placement overview.
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
              {applications.length > 0 ? 'Active Applications' : '0 applications submitted'}
            </span>
          </div>

          <div className="p-5 rounded-card glass-panel shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Scheduled Interviews</span>
              <Calendar className="w-4 h-4 text-brand-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {loading ? '...' : `${interviews.length} Scheduled`}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {interviews.length > 0 ? 'Upcoming Round' : 'No interviews scheduled'}
            </span>
          </div>

          <div className="p-5 rounded-card glass-panel shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Placement Status</span>
              <Award className="w-4 h-4 text-brand-600" />
            </div>
            <p className="text-lg font-bold text-brand-600 dark:text-brand-400 mt-2 truncate uppercase">
              {student?.placementStatus || 'UNPLACED'}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">Academic CGPA: {cgpaDisplay}</span>
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

        {/* Opportunities Grid & Empty States */}
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

          {/* Upcoming Interview Box */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Interview</h2>
            {interviews.length === 0 ? (
              <div className="p-8 rounded-card glass-panel text-center text-slate-500 text-xs">
                No interviews scheduled.
              </div>
            ) : (
              <div className="p-6 rounded-card glass-panel shadow-sm space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {interviews[0].companyName || 'Company Round'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{interviews[0].roundName || 'Interview'}</p>
                </div>
                <Link
                  href="/student/interviews"
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center justify-center transition-all shadow-sm"
                >
                  View Schedule
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
