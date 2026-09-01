'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import {
  CheckCircle2,
  XCircle,
  MapPin,
  DollarSign,
  Briefcase,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [student, setStudent] = useState<any>(null);
  const [job, setJob] = useState<any>(null);
  const [eligibility, setEligibility] = useState<any>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/students/profile').then((r) => r.json()),
      fetch(`/api/jobs/${jobId}`).then((r) => r.json()),
    ])
      .then(([profRes, jobRes]) => {
        if (profRes.success && profRes.student) setStudent(profRes.student);
        if (jobRes.success && jobRes.job) {
          setJob(jobRes.job);
          setEligibility(jobRes.eligibility);
          setHasApplied(jobRes.hasApplied);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading || !job) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
        <Sidebar role="STUDENT" userName={student?.name || 'Student'} userEmail={student?.email || ''} />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <p className="text-slate-500 text-xs">Loading opportunity details...</p>
        </main>
      </div>
    );
  }

  const isEligible = eligibility
    ? eligibility.isEligible
    : student
    ? (student.cgpa || 0) >= job.minCgpa && (student.backlogs || 0) <= job.maxBacklogs
    : false;

  const handleApply = async () => {
    setApplying(true);
    try {
      const res = await fetch(`/api/jobs/${job._id || job.id}/apply`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Application submitted successfully!');
        setHasApplied(true);
        setShowConfirmModal(false);
      } else {
        toast.error(data.message || 'Application failed');
      }
    } catch {
      toast.error('Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="STUDENT" userName={student?.name || 'Student'} userEmail={student?.email || ''} />

      <main className="flex-1 ml-64 p-8 max-w-6xl">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </button>

        {/* Top Header Card */}
        <div className="p-8 rounded-card glass-panel shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-brand-50 text-brand-600 font-bold flex items-center justify-center text-lg shrink-0 border border-brand-200">
                {job.companyName ? job.companyName.charAt(0) : 'C'}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {job.title}
                </h1>
                <p className="text-xs text-slate-500 mt-1">{job.companyName}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> {job.salary}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-brand-600" /> {job.jobType}
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              {hasApplied ? (
                <button
                  disabled
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold text-xs cursor-not-allowed"
                >
                  ✓ Already Applied
                </button>
              ) : isEligible ? (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  Apply Now
                </button>
              ) : (
                <button
                  disabled
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-semibold text-xs cursor-not-allowed"
                >
                  Not Eligible
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-card glass-panel shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Job Description</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{job.description}</p>
              </div>

              {job.responsibilities && job.responsibilities.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Key Responsibilities</h3>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    {job.responsibilities.map((r: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-1.5 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.skills && job.skills.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Required Skillset</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((s: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-brand-50 text-brand-600 border border-brand-200 text-xs font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Eligibility Panel */}
          <div className="space-y-6">
            <div className="p-6 rounded-card glass-panel shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" /> Eligibility Status
              </h3>

              {isEligible ? (
                <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> You meet all criteria for this position
                  </div>
                  <div className="space-y-1.5 text-xs pt-2 border-t border-emerald-200">
                    <div className="flex justify-between">
                      <span>CGPA:</span>
                      <span className="font-bold">{student?.cgpa ?? 'Not set'} / Min {job.minCgpa} ✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Backlogs:</span>
                      <span className="font-bold">{student?.backlogs ?? 0} / Max {job.maxBacklogs} ✓</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <XCircle className="w-4 h-4" /> Ineligible for this job
                  </div>
                  <p className="text-xs">
                    {eligibility?.reasons?.[0] || `Required CGPA: ${job.minCgpa} (Your CGPA: ${student?.cgpa ?? 0})`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md p-6 rounded-card bg-white dark:bg-slate-900 space-y-6 shadow-xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Job Application</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Submit application for <strong className="text-slate-900 dark:text-white">{job.title}</strong> at{' '}
                <strong className="text-slate-900 dark:text-white">{job.companyName}</strong>?
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm"
                >
                  {applying ? 'Submitting...' : 'Confirm & Apply'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
