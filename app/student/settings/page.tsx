'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Bell, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentSettingsPage() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/students/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.student) setStudent(data.student);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Account preferences saved');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="STUDENT" userName={student?.name || 'Student'} userEmail={student?.email || ''} />

      <main className="flex-1 ml-64 p-8 max-w-4xl">
        <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Account Settings
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Manage security, email alerts, and preferences</p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading settings...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6 mt-8">
            <div className="p-6 rounded-card glass-panel shadow-sm space-y-4">
              <h3 className="text-base font-bold flex items-center gap-2 text-brand-600 dark:text-brand-400">
                <Bell className="w-5 h-5" /> Notification Preferences
              </h3>
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <span>Email notification for new eligible job drives</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-600 rounded" />
              </label>
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <span>Email notification when shortlisted for interviews</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-600 rounded" />
              </label>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              Save Settings
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
