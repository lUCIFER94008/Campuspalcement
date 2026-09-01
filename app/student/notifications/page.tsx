'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Bell, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationsCenterPage() {
  const [student, setStudent] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/students/profile').then((r) => r.json()),
      fetch('/api/notifications').then((r) => r.json()),
    ])
      .then(([profRes, notifRes]) => {
        if (profRes.success && profRes.student) setStudent(profRes.student);
        if (notifRes.success && notifRes.notifications) setNotifications(notifRes.notifications);
        else setNotifications([]);
      })
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    try {
      const res = await fetch('/api/notifications', { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
        toast.success('All notifications marked as read');
      }
    } catch {
      toast.error('Failed to update notifications');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="STUDENT" userName={student?.name || 'Student'} userEmail={student?.email || ''} />

      <main className="flex-1 ml-64 p-8 max-w-4xl">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Notifications Center
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Application updates, interview invites, and campus alerts
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={markAllRead}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 text-brand-600 font-semibold text-xs transition-all shadow-sm"
            >
              Mark All Read
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="mt-8 p-12 rounded-card glass-panel shadow-sm text-center space-y-3">
            <Bell className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">You're all caught up.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No unread notifications or campus alerts at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mt-8">
            {notifications.map((n) => (
              <div
                key={n.id || n._id}
                className={`p-5 rounded-card glass-panel shadow-sm border transition-all flex items-start gap-4 ${
                  !n.read
                    ? 'border-brand-200 bg-brand-50/20'
                    : 'border-slate-200/60 dark:border-slate-800 opacity-80'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-200">
                  {n.type === 'INTERVIEW' ? <Calendar className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{n.title}</h4>
                    <span className="text-[10px] text-slate-400">
                      {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
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
