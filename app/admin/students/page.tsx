'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { initialStudents } from '@/lib/mockStore';
import { Users, Search, Filter, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminStudentManagementPage() {
  const [students, setStudents] = useState<any[]>(initialStudents);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('ALL');

  const toggleStatus = (id: string) => {
    toast.success('Student status updated');
  };

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.registerNumber.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === 'ALL' || s.department === dept;
    return matchSearch && matchDept;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar role="ADMIN" userName="Dr. Rajesh Sharma" userEmail="admin@campushire.demo" />

      <main className="flex-1 ml-64 p-8 max-w-7xl">
        <div className="pb-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Student Management</h1>
            <p className="text-slate-400 text-sm mt-1">Manage institutional student records, CGPA, and placement eligibility</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name or register number..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
            />
          </div>

          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="MECH">MECH</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="mt-8 rounded-3xl bg-slate-900/60 border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 pb-3 uppercase text-[10px] tracking-wider">
                <th className="p-4">Reg No</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Department</th>
                <th className="p-4">CGPA</th>
                <th className="p-4">Backlogs</th>
                <th className="p-4">Placement Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((s) => (
                <tr key={s.id || s._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-semibold text-slate-300">{s.registerNumber}</td>
                  <td className="p-4 font-bold text-white">{s.name}</td>
                  <td className="p-4 text-slate-300">{s.department}</td>
                  <td className="p-4 font-bold text-emerald-400">{s.cgpa}</td>
                  <td className="p-4 text-slate-300">{s.backlogs}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                      {s.placementStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => toggleStatus(s.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px]"
                    >
                      Toggle Status
                    </button>
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
