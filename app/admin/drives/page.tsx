'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Layers, Plus, Calendar, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPlacementDrivesPage() {
  const [drives, setDrives] = useState([
    {
      id: 'd-1',
      title: 'Microsoft Annual Campus Hiring Drive 2026',
      companyName: 'Microsoft',
      driveDate: '2026-08-29',
      venue: 'Main Auditorium / Online Teams',
      status: 'UPCOMING',
      eligibleDepartments: ['CSE', 'IT', 'ECE'],
    },
    {
      id: 'd-2',
      title: 'Google University Graduate Hiring Drive',
      companyName: 'Google India',
      driveDate: '2026-09-10',
      venue: 'Seminar Hall 3',
      status: 'UPCOMING',
      eligibleDepartments: ['CSE', 'IT'],
    },
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar role="ADMIN" userName="Dr. Rajesh Sharma" userEmail="admin@campushire.demo" />

      <main className="flex-1 ml-64 p-8 max-w-6xl">
        <div className="pb-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Placement Drive Management</h1>
            <p className="text-slate-400 text-sm mt-1">Schedule and monitor campus recruitment drives</p>
          </div>

          <button
            onClick={() => toast.success('New Placement Drive created')}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Placement Drive
          </button>
        </div>

        <div className="space-y-6 mt-8">
          {drives.map((d) => (
            <div key={d.id} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg">{d.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{d.companyName} • Venue: {d.venue}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                  {d.status}
                </span>
              </div>
              <div className="text-xs text-slate-300 pt-2 border-t border-slate-800">
                Eligible Departments: {d.eligibleDepartments.join(', ')} • Date: {d.driveDate}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
