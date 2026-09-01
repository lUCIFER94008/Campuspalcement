'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { initialInterviews } from '@/lib/mockStore';

export default function AdminInterviewsPage() {
  const [interviews] = useState<any[]>(initialInterviews);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar role="ADMIN" userName="Dr. Rajesh Sharma" userEmail="admin@campushire.demo" />

      <main className="flex-1 ml-64 p-8 max-w-5xl">
        <div className="pb-6 border-b border-slate-800">
          <h1 className="text-3xl font-extrabold tracking-tight">Institutional Interview Registry</h1>
          <p className="text-slate-400 text-sm mt-1">Audit active and completed corporate interview sessions</p>
        </div>

        <div className="space-y-4 mt-8">
          {interviews.map((i) => (
            <div key={i.id || i._id} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-base">{i.studentName} — {i.companyName} ({i.roundName})</h3>
              <p className="text-xs text-slate-400">Date: {i.date} • Time: {i.time} • Mode: {i.mode}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
