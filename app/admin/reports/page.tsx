'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

export default function AdminReportsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/reports')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) setData(resData.data);
      })
      .catch(() => {});
  }, []);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  const exportPDF = () => {
    window.print();
    toast.success('Report printed/saved');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="ADMIN" userName="Dr. Rajesh Sharma" userEmail="admin@campushire.demo" />

      <main className="flex-1 ml-64 p-8 max-w-7xl">
        <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Reports & Analytics Suite</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Interactive placement performance data for institutional accreditation</p>
          </div>

          <button
            onClick={exportPDF}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" /> Export Report (PDF)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* Chart 1: Department-wise placement */}
          <div className="p-6 rounded-card bg-white dark:bg-[#11141B] border border-slate-200/80 dark:border-[#20242D] shadow-card space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500">1. Department Placement (%)</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.departmentPlacements || []}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px' }} />
                  <Bar dataKey="percentage" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Company Hiring */}
          <div className="p-6 rounded-card bg-white dark:bg-[#11141B] border border-slate-200/80 dark:border-[#20242D] shadow-card space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500">2. Company-wise Hires</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.topRecruiters || []}>
                  <XAxis dataKey="company" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px' }} />
                  <Bar dataKey="hired" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Monthly Applications */}
          <div className="p-6 rounded-card bg-white dark:bg-[#11141B] border border-slate-200/80 dark:border-[#20242D] shadow-card space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500">3. Monthly Applications</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.monthlyTrends || []}>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="applications" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Selection Ratio */}
          <div className="p-6 rounded-card bg-white dark:bg-[#11141B] border border-slate-200/80 dark:border-[#20242D] shadow-card space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500">4. Selection Funnel Ratio</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[
                    { name: 'Applied', value: 610 },
                    { name: 'Shortlisted', value: 240 },
                    { name: 'Interviewed', value: 180 },
                    { name: 'Selected', value: 135 },
                  ]} dataKey="value" cx="50%" cy="50%" outerRadius={55}>
                    {COLORS.map((c, i) => (
                      <Cell key={i} fill={c} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 5: Salary Distribution */}
          <div className="p-6 rounded-card bg-white dark:bg-[#11141B] border border-slate-200/80 dark:border-[#20242D] shadow-card space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500">5. Salary CTC Distribution</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.salaryDistribution || []}>
                  <XAxis dataKey="range" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px' }} />
                  <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 6: Placement Trend */}
          <div className="p-6 rounded-card bg-white dark:bg-[#11141B] border border-slate-200/80 dark:border-[#20242D] shadow-card space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500">6. Offers Extended Trend</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.monthlyTrends || []}>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="offers" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
