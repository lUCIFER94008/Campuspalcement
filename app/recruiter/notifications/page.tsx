'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Bell } from 'lucide-react';

export default function RecruiterNotificationsPage() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((r) => r.json()),
      fetch('/api/notifications').then((r) => r.json()),
    ])
      .then(([userRes, notifRes]) => {
        if (userRes.success && userRes.user) setUser(userRes.user);
        if (notifRes.success && notifRes.notifications) setNotifications(notifRes.notifications);
        else setNotifications([]);
      })
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="RECRUITER" userName={user?.name || 'Recruiter'} userEmail={user?.email || ''} />

      <main className="flex-1 ml-64 p-8 max-w-4xl">
        <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Recruiter Notifications
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Application submissions and interview status alerts
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="mt-8 p-12 rounded-card glass-panel text-center shadow-sm space-y-3">
            <Bell className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No new notifications.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Real-time candidate submissions and placement updates will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mt-8">
            {notifications.map((n) => (
              <div key={n.id || n._id} className="p-5 rounded-card glass-panel shadow-sm border border-slate-200/60 dark:border-slate-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-200">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{n.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
