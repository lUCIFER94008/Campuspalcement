'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { initialJobs } from '@/lib/mockStore';
import { Briefcase, CheckCircle2 } from 'lucide-react';

export default function AdminJobsPage() {
  const [jobs] = useState<any[]>(initialJobs);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar role="ADMIN" userName="Dr. Rajesh Sharma" userEmail="admin@campushire.demo" />

      <main className="flex-1 ml-64 p-8 max-w-6xl">
        <div className="pb-6 border-b border-slate-800">
          <h1 className="text-3xl font-extrabold tracking-tight">Global Jobs Registry</h1>
          <p className="text-slate-400 text-sm mt-1">Audit all active and archived recruitment job postings</p>
        </div>

        <div className="space-y-4 mt-8">
          {jobs.map((j) => (
            <div key={j.id || j._id} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">{j.title}</h3>
                <p className="text-xs text-slate-400">{j.companyName} • Package: {j.salary} • Location: {j.location}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                {j.status}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
