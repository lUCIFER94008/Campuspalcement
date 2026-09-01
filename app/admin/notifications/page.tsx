'use client';

import React from 'react';
import { Sidebar } from '@/components/sidebar';
import { Bell } from 'lucide-react';

export default function AdminNotificationsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar role="ADMIN" userName="Dr. Rajesh Sharma" userEmail="admin@campushire.demo" />

      <main className="flex-1 ml-64 p-8 max-w-4xl">
        <div className="pb-6 border-b border-slate-800">
          <h1 className="text-3xl font-extrabold tracking-tight">Admin System Notifications</h1>
          <p className="text-slate-400 text-sm mt-1">Institutional system alerts and recruitment drive logs</p>
        </div>

        <div className="space-y-4 mt-8">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 flex items-start gap-4">
            <Bell className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-sm">System Database Seeded</h4>
              <p className="text-xs text-slate-300 mt-1">CampusPlacement database ready with demo records & accounts.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
