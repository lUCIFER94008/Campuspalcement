'use client';

import React from 'react';
import { Sidebar } from '@/components/sidebar';
import { Settings, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Admin portal configuration saved');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar role="ADMIN" userName="Dr. Rajesh Sharma" userEmail="admin@campushire.demo" />

      <main className="flex-1 ml-64 p-8 max-w-4xl">
        <div className="pb-6 border-b border-slate-800">
          <h1 className="text-3xl font-extrabold tracking-tight">Institutional System Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Configure campus placement policies and global parameters</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6 mt-8">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-400">
              <ShieldCheck className="w-5 h-5" /> Global Security & Policy
            </h3>
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs cursor-pointer">
              <span>Strict Server Eligibility Enforcement (Blocks non-eligible student applications)</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs cursor-pointer">
              <span>Require Placement Officer Approval for New Corporate Companies</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
            </label>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow transition-all"
          >
            Save Configuration
          </button>
        </form>
      </main>
    </div>
  );
}
