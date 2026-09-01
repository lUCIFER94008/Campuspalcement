'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { initialApplications } from '@/lib/mockStore';

export default function AdminApplicationsPage() {
  const [applications] = useState<any[]>(initialApplications);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar role="ADMIN" userName="Dr. Rajesh Sharma" userEmail="admin@campushire.demo" />

      <main className="flex-1 ml-64 p-8 max-w-6xl">
        <div className="pb-6 border-b border-slate-800">
          <h1 className="text-3xl font-extrabold tracking-tight">Global Applications Audit</h1>
          <p className="text-slate-400 text-sm mt-1">Monitor all candidate applications across drives</p>
        </div>

        <div className="mt-8 rounded-3xl bg-slate-900/60 border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 pb-3 uppercase text-[10px]">
                <th className="p-4">Student</th>
                <th className="p-4">Dept</th>
                <th className="p-4">Job Role</th>
                <th className="p-4">Company</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {applications.map((a) => (
                <tr key={a.id || a._id}>
                  <td className="p-4 font-bold text-white">{a.studentName}</td>
                  <td className="p-4 text-slate-300">{a.studentDept}</td>
                  <td className="p-4 text-slate-300">{a.jobTitle}</td>
                  <td className="p-4 font-semibold text-indigo-400">{a.companyName}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
