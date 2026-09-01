'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { initialPlacements } from '@/lib/mockStore';
import { Award, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPlacementsPage() {
  const [placements] = useState<any[]>(initialPlacements);

  const exportCSV = () => {
    const headers = 'Student Name,Company,Role,Package,Joining Date,Department,Batch\n';
    const rows = placements
      .map((p) => `"${p.studentName}","${p.companyName}","${p.role}","${p.packageOffered}","${p.joiningDate}","${p.department}","${p.batch}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CampusHire_Placement_Report_2026.csv';
    a.click();
    toast.success('CSV Report exported successfully');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar role="ADMIN" userName="Dr. Rajesh Sharma" userEmail="admin@campushire.demo" />

      <main className="flex-1 ml-64 p-8 max-w-6xl">
        <div className="pb-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Placement Records</h1>
            <p className="text-slate-400 text-sm mt-1">Official list of placed candidates and offer packages</p>
          </div>

          <button
            onClick={exportCSV}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export CSV Report
          </button>
        </div>

        <div className="mt-8 rounded-3xl bg-slate-900/60 border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 pb-3 uppercase text-[10px] tracking-wider">
                <th className="p-4">Student</th>
                <th className="p-4">Department</th>
                <th className="p-4">Company</th>
                <th className="p-4">Role Offered</th>
                <th className="p-4">Package (CTC)</th>
                <th className="p-4">Joining Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {placements.map((p) => (
                <tr key={p.id || p._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white">{p.studentName}</td>
                  <td className="p-4 text-slate-300">{p.department}</td>
                  <td className="p-4 font-semibold text-indigo-400">{p.companyName}</td>
                  <td className="p-4 text-slate-300">{p.role}</td>
                  <td className="p-4 font-black text-emerald-400">{p.packageOffered}</td>
                  <td className="p-4 text-slate-400">{p.joiningDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
