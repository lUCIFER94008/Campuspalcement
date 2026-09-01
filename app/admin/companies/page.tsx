'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { initialCompanies } from '@/lib/mockStore';
import { Building2, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCompanyManagementPage() {
  const [companies, setCompanies] = useState<any[]>(initialCompanies);

  const updateCompanyStatus = (id: string, status: string) => {
    setCompanies(companies.map((c) => (c.id === id ? { ...c, status } : c)));
    toast.success(`Company status set to ${status}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar role="ADMIN" userName="Dr. Rajesh Sharma" userEmail="admin@campushire.demo" />

      <main className="flex-1 ml-64 p-8 max-w-7xl">
        <div className="pb-6 border-b border-slate-800">
          <h1 className="text-3xl font-extrabold tracking-tight">Company Verification & Approval</h1>
          <p className="text-slate-400 text-sm mt-1">Approve corporate recruiters before job drives are published live</p>
        </div>

        <div className="mt-8 rounded-3xl bg-slate-900/60 border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 pb-3 uppercase text-[10px] tracking-wider">
                <th className="p-4">Company Name</th>
                <th className="p-4">Industry</th>
                <th className="p-4">Location</th>
                <th className="p-4">Contact Person</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {companies.map((c) => (
                <tr key={c.id || c._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-3">
                    <img src={c.logo} alt={c.name} className="w-8 h-8 rounded-lg object-cover border border-slate-800" />
                    {c.name}
                  </td>
                  <td className="p-4 text-slate-300">{c.industry}</td>
                  <td className="p-4 text-slate-400">{c.location}</td>
                  <td className="p-4 text-slate-300">{c.contactPerson}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => updateCompanyStatus(c.id, 'APPROVED')}
                      className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/20"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateCompanyStatus(c.id, 'REJECTED')}
                      className="px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-[10px] border border-red-500/20"
                    >
                      Reject
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
