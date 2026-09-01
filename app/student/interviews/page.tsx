'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Calendar, Clock, Video, ExternalLink } from 'lucide-react';

export default function StudentInterviewsPage() {
  const [student, setStudent] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/students/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.student) setStudent(data.student);
      })
      .catch(() => {});

    fetch('/api/interviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.interviews) setInterviews(data.interviews);
        else setInterviews([]);
      })
      .catch(() => setInterviews([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="STUDENT" userName={student?.name || 'Student'} userEmail={student?.email || ''} />

      <main className="flex-1 ml-64 p-8 max-w-5xl">
        <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Interview Dashboard
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Upcoming scheduled corporate interview rounds</p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading interview schedule...</div>
        ) : interviews.length === 0 ? (
          <div className="mt-8 p-12 rounded-card glass-panel text-center shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No interviews scheduled.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your interview schedules will appear here once shortlisted by recruiters.
            </p>
          </div>
        ) : (
          <div className="space-y-6 mt-8">
            {interviews.map((int) => (
              <div
                key={int.id || int._id}
                className="p-6 rounded-card glass-panel shadow-sm space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider border border-brand-200">
                      {int.roundName || 'Interview Round'}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                      {int.companyName || int.companyId?.name || 'Recruiter'}
                    </h3>
                    <p className="text-xs text-slate-500">{int.jobTitle || int.jobId?.title || 'Placement Drive'}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Status</span>
                    <span className="text-xs font-bold text-brand-600">{int.status || 'SCHEDULED'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-600" />
                    <span>Date: <strong>{int.date}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-600" />
                    <span>Time: <strong>{int.time}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-emerald-600" />
                    <span>Mode: <strong>{int.mode || 'ONLINE'}</strong></span>
                  </div>
                </div>

                {int.venueOrLink && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="text-xs text-slate-500 truncate max-w-md">
                      Link: <code className="text-brand-600 font-mono">{int.venueOrLink}</code>
                    </div>

                    <a
                      href={int.venueOrLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
                    >
                      Join Meeting <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
