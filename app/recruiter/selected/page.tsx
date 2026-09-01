'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Award, CheckCircle2 } from 'lucide-react';

export default function SelectedCandidatesPage() {
  const [user, setUser] = useState<any>(null);
  const [placements, setPlacements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((r) => r.json()),
      fetch('/api/applications').then((r) => r.json()),
    ])
      .then(([userRes, appRes]) => {
        if (userRes.success && userRes.user) setUser(userRes.user);
        if (appRes.success && appRes.applications) {
          const selected = appRes.applications.filter((a: any) => a.status === 'SELECTED');
          setPlacements(selected);
        } else {
          setPlacements([]);
        }
      })
      .catch(() => setPlacements([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="RECRUITER" userName={user?.name || 'Recruiter'} userEmail={user?.email || ''} />

      <main className="flex-1 ml-64 p-8 max-w-5xl">
        <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Selected Candidates
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Candidates extended official placement offers</p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading selected candidates...</div>
        ) : placements.length === 0 ? (
          <div className="mt-8 p-12 rounded-card glass-panel text-center shadow-sm space-y-3">
            <Award className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No candidates selected yet.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Candidates marked as SELECTED during interview evaluation rounds will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {placements.map((p) => {
              const sName = p.studentName || p.studentId?.name || 'Candidate';
              const jTitle = p.jobTitle || p.jobId?.title || 'Placement Offer';
              const sDept = p.studentDept || p.studentId?.department || 'N/A';

              return (
                <div key={p.id || p._id} className="p-6 rounded-card glass-panel shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{sName}</h3>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Offered
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{jTitle}</p>
                  <p className="text-xs text-slate-500">Department: {sDept}</p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
