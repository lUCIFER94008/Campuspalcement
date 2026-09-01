'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Award, GraduationCap, Building2 } from 'lucide-react';

export default function PlacementStatusPage() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/students/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.student) setStudent(data.student);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const placementStatus = student?.placementStatus || 'NOT PLACED';

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PLACED':
      case 'SELECTED':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200';
      case 'SHORTLISTED':
      case 'INTERVIEW':
        return 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 border-brand-200';
      default:
        return 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="STUDENT" userName={student?.name || 'Student'} userEmail={student?.email || ''} />

      <main className="flex-1 ml-64 p-8 max-w-4xl">
        <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Placement Status Record
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Official institutional placement status log</p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading placement status record...</div>
        ) : (
          <div className="p-8 rounded-card glass-panel shadow-sm mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                  Current Official Placement Status
                </span>
                <h2 className={`text-2xl sm:text-3xl font-bold mt-2 uppercase ${getStatusColor(placementStatus).split(' ')[0]}`}>
                  {placementStatus}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-200">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800 text-xs">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <GraduationCap className="w-4 h-4 text-brand-600" /> Student Profile Info
                </div>
                <p className="font-bold text-slate-900 dark:text-white text-sm mt-1">{student?.name || 'Student'}</p>
                <p className="text-slate-500">Reg No: {student?.registerNumber || 'Not added'}</p>
                <p className="text-slate-500">Department: {student?.department || 'Not added'} ({student?.batch || '2026'})</p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Building2 className="w-4 h-4 text-brand-600" /> Academic Criteria
                </div>
                <p className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                  CGPA: {student?.cgpa ?? 'Not added'}
                </p>
                <p className="text-slate-500">Backlogs: {student?.backlogs ?? 0}</p>
                <p className="text-slate-500">
                  Profile Completion: {student?.profileCompletion || 0}%
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
