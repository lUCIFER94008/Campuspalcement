'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Search, MapPin, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { checkEligibility } from '@/lib/eligibility';

export default function FindJobsPage() {
  const [student, setStudent] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [workModeFilter, setWorkModeFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/students/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.student) setStudent(data.student);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (departmentFilter !== 'ALL') params.set('department', departmentFilter);
    if (jobTypeFilter) params.set('jobType', jobTypeFilter);
    if (workModeFilter) params.set('workMode', workModeFilter);

    fetch(`/api/jobs?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.jobs) setJobs(data.jobs);
        else setJobs([]);
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [search, departmentFilter, jobTypeFilter, workModeFilter]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="STUDENT" userName={student?.name || 'Student'} userEmail={student?.email || ''} />

      <main className="flex-1 ml-64 p-8 max-w-7xl">
        <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Find Placement Opportunities
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Explore verified corporate recruitment drives with real-time eligibility checking
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-8 p-4 rounded-card glass-panel shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs by title, company, or skills..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Eligible Dept</label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs outline-none"
              >
                <option value="ALL">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="EEE">EEE</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Job Type</label>
              <select
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs outline-none"
              >
                <option value="">All Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONVERTIBLE">Convertible</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Work Mode</label>
              <select
                value={workModeFilter}
                onChange={(e) => setWorkModeFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs outline-none"
              >
                <option value="">All Work Modes</option>
                <option value="ON_SITE">On-Site</option>
                <option value="HYBRID">Hybrid</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Cards Grid or Empty State */}
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading placement opportunities...</div>
        ) : jobs.length === 0 ? (
          <div className="mt-8 p-12 rounded-card glass-panel text-center shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No job opportunities available yet.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Check back when recruiters publish new campus recruitment drives.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {jobs.map((job) => {
              const eligibility = checkEligibility(
                {
                  cgpa: student?.cgpa || 0,
                  backlogs: student?.backlogs || 0,
                  department: student?.department || '',
                  batch: student?.batch || '',
                },
                {
                  minCgpa: job.minCgpa,
                  maxBacklogs: job.maxBacklogs,
                  eligibleDepartments: job.eligibleDepartments || [],
                  eligibleBatches: job.eligibleBatches || [],
                }
              );

              return (
                <div
                  key={job.id || job._id}
                  className="p-6 rounded-card glass-panel shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 font-bold flex items-center justify-center text-sm shrink-0">
                          {job.companyName ? job.companyName.charAt(0) : 'C'}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                            {job.title}
                          </h3>
                          <p className="text-xs text-slate-500">{job.companyName}</p>
                        </div>
                      </div>

                      {eligibility.isEligible ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200 flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3 h-3" /> Eligible
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold border border-red-200 flex items-center gap-1 shrink-0">
                          <AlertCircle className="w-3 h-3" /> Ineligible
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-600" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> {job.salary}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">
                      Min CGPA: <strong className="text-slate-900 dark:text-white">{job.minCgpa}</strong>
                    </span>
                    <Link
                      href={`/student/jobs/${job.id || job._id}`}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
