'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Calendar, Plus, Video, Clock, MapPin, Link2, CheckCircle2, UserCheck, X, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function RecruiterInterviewsPage() {
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Schedule Interview Modal State
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [scheduling, setScheduling] = useState(false);

  // Select Candidate Confirmation Modal State
  const [selectingCandidate, setSelectingCandidate] = useState<any>(null);
  const [selecting, setSelecting] = useState(false);

  const [form, setForm] = useState({
    roundName: 'Technical Interview',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    mode: 'ONLINE' as 'ONLINE' | 'OFFLINE',
    venueOrLink: 'https://meet.google.com/abc-defg-hij',
    notes: '',
  });

  const fetchData = async () => {
    try {
      const [userRes, appRes, intRes] = await Promise.all([
        fetch('/api/auth/me').then((r) => r.json()),
        fetch('/api/applications').then((r) => r.json()),
        fetch('/api/interviews').then((r) => r.json()),
      ]);

      if (userRes.success && userRes.user) setUser(userRes.user);
      if (appRes.success && appRes.applications) setApplications(appRes.applications);
      if (intRes.success && intRes.interviews) setInterviews(intRes.interviews);
    } catch {
      toast.error('Failed to load interview pipeline data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Map application status lookups
  const applicationMap = new Map(applications.map((a) => [(a._id || a.id)?.toString(), a]));

  // Filter Shortlisted Candidates (Section A): Applications with status SHORTLISTED that do NOT have a scheduled interview yet
  const scheduledAppIds = new Set(interviews.map((i) => (i.applicationId?._id || i.applicationId)?.toString()));

  const shortlistedPendingSchedule = applications.filter((a) => {
    const statusUpper = (a.status || '').toUpperCase();
    const appIdStr = (a._id || a.id)?.toString();
    return (statusUpper === 'SHORTLISTED' || statusUpper === 'INTERVIEW') && !scheduledAppIds.has(appIdStr);
  });

  // Filter Active Scheduled Interviews (Section B): Exclude candidates who have already been SELECTED / PLACED
  const activeScheduledInterviews = interviews.filter((int) => {
    const appId = (int.applicationId?._id || int.applicationId)?.toString();
    const app = applicationMap.get(appId);
    const appStatus = (app?.status || '').toUpperCase();
    return appStatus !== 'SELECTED' && appStatus !== 'PLACED' && (int.status || '').toUpperCase() !== 'COMPLETED';
  });

  const handleOpenModal = (app: any) => {
    setSelectedApp(app);
    setForm({
      roundName: 'Technical Interview',
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      mode: 'ONLINE',
      venueOrLink: `https://meet.google.com/ch-${(app._id || 'room').toString().slice(-6)}`,
      notes: '',
    });
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setScheduling(true);
    try {
      const studentId = (selectedApp.studentId as any)?._id || selectedApp.studentId;
      const jobId = (selectedApp.jobId as any)?._id || selectedApp.jobId;
      const companyId = (selectedApp.companyId as any)?._id || selectedApp.companyId;

      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApp._id || selectedApp.id,
          studentId,
          jobId,
          companyId,
          roundName: form.roundName,
          date: form.date,
          startTime: form.startTime,
          endTime: form.endTime,
          mode: form.mode,
          venueOrLink: form.venueOrLink,
          notes: form.notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Interview scheduled successfully & notification sent to candidate!');
        setSelectedApp(null);
        fetchData();
      } else {
        toast.error(data.message || 'Scheduling failed');
      }
    } catch {
      toast.error('Network error during scheduling');
    } finally {
      setScheduling(false);
    }
  };

  // Handle Select Candidate Action
  const handleConfirmSelectCandidate = async () => {
    if (!selectingCandidate) return;

    setSelecting(true);
    try {
      const appId = (selectingCandidate.applicationId?._id || selectingCandidate.applicationId || selectingCandidate._id).toString();

      const res = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: appId,
          status: 'SELECTED',
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Candidate selected successfully!');
        setSelectingCandidate(null);
        fetchData();
      } else {
        toast.error(data.message || 'Failed to select candidate');
      }
    } catch {
      toast.error('Network error selecting candidate');
    } finally {
      setSelecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="RECRUITER" userName={user?.name || 'Recruiter'} userEmail={user?.email || ''} />

      <main className="flex-1 ml-64 p-8 max-w-6xl">
        <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Interview Management Pipeline
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Schedule interview rounds for shortlisted candidates & extend official selection offers
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading interview pipeline...</div>
        ) : (
          <div className="space-y-10 mt-8">
            {/* SECTION A: Shortlisted Candidates Pending Schedule */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-brand-600" /> Section A: Shortlisted Candidates (Pending Schedule)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Candidates who have been shortlisted and require an interview date & time
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold border border-brand-200">
                  {shortlistedPendingSchedule.length} Pending Schedule
                </span>
              </div>

              {shortlistedPendingSchedule.length === 0 ? (
                <div className="p-8 rounded-card glass-panel text-center text-slate-500 text-xs space-y-2 border border-slate-200/60 dark:border-slate-800">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">No shortlisted candidates pending interview scheduling.</p>
                  <p>Shortlist candidates from the Applicants page to schedule them here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shortlistedPendingSchedule.map((app) => {
                    const sName = app.studentName || app.studentId?.name || 'Student';
                    const sDept = app.studentDept || app.studentId?.department || 'N/A';
                    const sCgpa = app.studentCgpa || app.studentId?.cgpa || 'N/A';
                    const jTitle = app.jobTitle || app.jobId?.title || 'Job';

                    return (
                      <div key={app._id || app.id} className="p-5 rounded-card glass-panel shadow-sm space-y-3 border border-brand-200/60">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-base">{sName}</h3>
                            <p className="text-xs text-slate-500">{jTitle} • {sDept} ({sCgpa} CGPA)</p>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200">
                            SHORTLISTED
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                          <button
                            onClick={() => handleOpenModal(app)}
                            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                          >
                            <Calendar className="w-3.5 h-3.5" /> Schedule Interview
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SECTION B: Scheduled Interviews */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" /> Section B: Scheduled Interviews
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Confirmed interview rounds with live date, time, and venue/meeting details
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">
                  {activeScheduledInterviews.length} Scheduled
                </span>
              </div>

              {activeScheduledInterviews.length === 0 ? (
                <div className="p-8 rounded-card glass-panel text-center text-slate-500 text-xs space-y-2 border border-slate-200/60 dark:border-slate-800">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">No active scheduled interviews.</p>
                  <p>Schedule an interview for any shortlisted candidate above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeScheduledInterviews.map((int) => {
                    const sName = int.studentName || int.studentId?.name || 'Candidate';
                    const jTitle = int.jobTitle || int.jobId?.title || 'Position';

                    return (
                      <div key={int._id || int.id} className="p-6 rounded-card glass-panel shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-base">{sName}</h3>
                            <p className="text-xs text-slate-500">{jTitle} • <strong className="text-brand-600">{int.roundName || 'Technical Round'}</strong></p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> {int.status || 'SCHEDULED'}
                            </span>
                            
                            <button
                              onClick={() => setSelectingCandidate(int)}
                              className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                            >
                              <UserCheck className="w-3.5 h-3.5" /> Select Candidate
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-brand-600" /> {int.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-brand-600" /> {int.time || `${int.startTime || '10:00 AM'} - ${int.endTime || '11:00 AM'}`}
                          </span>
                          <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                            {int.mode === 'OFFLINE' ? <MapPin className="w-4 h-4 text-emerald-600" /> : <Video className="w-4 h-4 text-emerald-600" />}
                            {int.mode || 'ONLINE'}
                          </span>
                        </div>

                        {int.venueOrLink && (
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Link2 className="w-4 h-4 text-brand-600 shrink-0" />
                            <span className="font-mono text-[11px] truncate">{int.venueOrLink}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Schedule Interview Modal */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg p-6 rounded-card bg-white dark:bg-slate-900 space-y-6 shadow-xl border border-slate-200 dark:border-slate-800 relative">
              <button
                onClick={() => setSelectedApp(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Schedule Interview Round
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Candidate: <strong className="text-slate-900 dark:text-white">{selectedApp.studentName || selectedApp.studentId?.name}</strong> • Role: <strong className="text-slate-900 dark:text-white">{selectedApp.jobTitle || selectedApp.jobId?.title}</strong>
                </p>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Interview Round *
                  </label>
                  <select
                    value={form.roundName}
                    onChange={(e) => setForm({ ...form, roundName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-brand-600"
                  >
                    <option value="Technical Interview">Technical Interview</option>
                    <option value="HR Round">HR Round</option>
                    <option value="System Design & Architecture">System Design & Architecture</option>
                    <option value="Coding & Problem Solving">Coding & Problem Solving</option>
                    <option value="Managerial Round">Managerial Round</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-brand-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                      Start Time *
                    </label>
                    <input
                      type="text"
                      value={form.startTime}
                      onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                      placeholder="10:00 AM"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-brand-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                      End Time *
                    </label>
                    <input
                      type="text"
                      value={form.endTime}
                      onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                      placeholder="11:00 AM"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-brand-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Interview Mode *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold">
                      <input
                        type="radio"
                        name="mode"
                        value="ONLINE"
                        checked={form.mode === 'ONLINE'}
                        onChange={() => setForm({ ...form, mode: 'ONLINE', venueOrLink: `https://meet.google.com/ch-${(selectedApp._id || 'room').toString().slice(-6)}` })}
                        className="accent-brand-600"
                      />
                      Online (Video Call)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold">
                      <input
                        type="radio"
                        name="mode"
                        value="OFFLINE"
                        checked={form.mode === 'OFFLINE'}
                        onChange={() => setForm({ ...form, mode: 'OFFLINE', venueOrLink: 'Placement Cell - Hall 3B, Main Campus' })}
                        className="accent-brand-600"
                      />
                      Offline (On Campus)
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    {form.mode === 'ONLINE' ? 'Meeting Link (Google Meet / Zoom) *' : 'Campus Location / Venue *'}
                  </label>
                  <input
                    type="text"
                    value={form.venueOrLink}
                    onChange={(e) => setForm({ ...form, venueOrLink: e.target.value })}
                    placeholder={form.mode === 'ONLINE' ? 'https://meet.google.com/...' : 'Campus Placement Cell, Hall 3B'}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-brand-600 font-mono text-[11px]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={scheduling}
                    className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm"
                  >
                    {scheduling ? 'Scheduling...' : 'Schedule Interview'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Select Candidate Confirmation Dialog */}
        {selectingCandidate && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md p-6 rounded-card bg-white dark:bg-slate-900 space-y-6 shadow-xl border border-slate-200 dark:border-slate-800 relative">
              <button
                onClick={() => setSelectingCandidate(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 font-bold flex items-center justify-center shrink-0 border border-brand-200">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Select Candidate</h3>
                  <p className="text-xs text-slate-500">Official Campus Placement Offer Confirmation</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Are you sure you want to select <strong className="text-slate-900 dark:text-white">{selectingCandidate.studentName || selectingCandidate.studentId?.name}</strong> for the position of <strong className="text-slate-900 dark:text-white">{selectingCandidate.jobTitle || selectingCandidate.jobId?.title}</strong>?
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectingCandidate(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSelectCandidate}
                  disabled={selecting}
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  {selecting ? 'Selecting...' : 'Confirm Selection'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
