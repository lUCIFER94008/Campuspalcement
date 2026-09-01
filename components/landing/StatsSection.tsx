'use client';

import React, { useEffect, useState } from 'react';

export function StatsSection() {
  const [statsData, setStatsData] = useState({
    totalStudents: 0,
    activeCompanies: 0,
    placedStudents: 0,
    placementRate: '0%',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data?.summary) {
          setStatsData({
            totalStudents: resData.data.summary.totalStudents || 0,
            activeCompanies: resData.data.summary.activeCompanies || 0,
            placedStudents: resData.data.summary.placedStudents || 0,
            placementRate: resData.data.summary.placementRate || '0%',
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Registered Students', value: statsData.totalStudents },
    { label: 'Recruiting Companies', value: statsData.activeCompanies },
    { label: 'Successful Placements', value: statsData.placedStudents },
    { label: 'Placement Rate', value: statsData.placementRate },
  ];

  return (
    <section className="py-20 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-card p-8 sm:p-12 text-center relative overflow-hidden">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-10 flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-bright" />
            LIVE INSTITUTIONAL METRICS
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200/60 dark:divide-slate-800">
            {stats.map((s, idx) => (
              <div key={idx} className="pt-4 sm:pt-0">
                <p className="text-3xl sm:text-5xl font-black tracking-tight text-brand-600 dark:text-brand-400">
                  {loading ? (
                    <span className="inline-block w-16 h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
                  ) : (
                    s.value
                  )}
                </p>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-2">{s.label}</p>
                <span className="text-[10px] text-slate-400 font-medium mt-1 block">Database Verified</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
