'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import {
  Users,
  Building2,
  Briefcase,
  Layers,
  FileText,
  Award,
  Download,
  Percent
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function AdminDashboard() {
  const [reportsData, setReportsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) setReportsData(resData.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const summary = reportsData?.summary || {
    totalStudents: 0,
    activeCompanies: 0,
    placedStudents: 0,
    placementRate: '0%',
    totalOffers: 0,
  };

  const stats = [
    { label: 'Students', value: loading ? '...' : summary.totalStudents, icon: Users },
    { label: 'Companies', value: loading ? '...' : summary.activeCompanies, icon: Building2 },
    { label: 'Placed Students', value: loading ? '...' : summary.placedStudents, icon: Award },
    { label: 'Total Offers', value: loading ? '...' : summary.totalOffers, icon: FileText },
    { label: 'Placement Rate', value: loading ? '...' : summary.placementRate, icon: Percent },
  ];

  const deptData = reportsData?.departmentPlacements || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="ADMIN" userName="Placement Officer" userEmail="admin@campushire.demo" />

      <main className="flex-1 ml-64 p-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Placement Officer Overview
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Real-time institutional metrics computed from MongoDB records
            </p>
          </div>

          <Link
            href="/admin/reports"
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" /> Export Reports
          </Link>
        </div>

        {/* Real Dynamic Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="p-4 rounded-card glass-panel shadow-sm text-left">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] font-bold uppercase truncate">{s.label}</span>
                  <Icon className="w-4 h-4 text-brand-600 shrink-0" />
                </div>
                <p className="text-xl font-bold text-slate-900 dark:text-white truncate">{s.value}</p>
                <span className="text-[9px] text-slate-400 font-medium mt-1 block">Live DB Count</span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Charts or Empty State */}
        <div className="mt-8">
          <div className="p-6 rounded-card glass-panel shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Department Placement Distribution
            </h3>

            {deptData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-xs text-slate-500">
                No placement records in database yet.
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} unit="%" />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="percentage" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
