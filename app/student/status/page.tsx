'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Award, GraduationCap, Building2, CheckCircle2, FileText, Eye, Download } from 'lucide-react';
import { SelectionLetterModal } from '@/components/SelectionLetterModal';

export default function PlacementStatusPage() {
  const [student, setStudent] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppForLetter, setSelectedAppForLetter] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/students/profile').then((r) => r.json()),
      fetch('/api/applications').then((r) => r.json()),
    ])
      .then(([profRes, appRes]) => {
        if (profRes.success && profRes.student) setStudent(profRes.student);
        if (appRes.success && appRes.applications) setApplications(appRes.applications);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Determine real placement status from student profile and applications
  const selectedApp = applications.find(
    (a) => (a.status || '').toUpperCase() === 'SELECTED' || (a.status || '').toUpperCase() === 'PLACED'
  );

  const isSelected = !!selectedApp || (student?.placementStatus || '').toUpperCase() === 'PLACED';

  let placementStatus = 'NOT APPLIED';
  if (isSelected) {
    placementStatus = 'SELECTED';
  } else if (applications.length > 0) {
    const statuses = applications.map((a) => (a.status || '').toUpperCase());
    if (statuses.includes('SHORTLISTED')) placementStatus = 'SHORTLISTED';
    else if (statuses.includes('UNDER REVIEW') || statuses.includes('UNDER_REVIEW')) placementStatus = 'UNDER REVIEW';
    else if (statuses.includes('APPLIED')) placementStatus = 'APPLIED';
    else placementStatus = 'REJECTED';
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PLACED':
      case 'SELECTED':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200';
      case 'SHORTLISTED':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200';
      case 'UNDER REVIEW':
      case 'APPLIED':
        return 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 border-brand-200';
      case 'REJECTED':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200';
      default:
        return 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="STUDENT" userName={student?.name || 'Student'} userEmail={student?.email || ''} />

      <main className="flex-1 ml-64 p-8 max-w-5xl">
        <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Placement Status Record
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Official institutional placement status and selection record
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading placement status record...</div>
        ) : (
          <div className="space-y-6 mt-8">
            <div className="p-8 rounded-card glass-panel shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                    Official Placement Record
                  </span>
                  <h2 className={`text-2xl sm:text-3xl font-extrabold mt-2 uppercase flex items-center gap-2 ${getStatusColor(placementStatus).split(' ')[0]}`}>
                    {isSelected && <CheckCircle2 className="w-8 h-8 text-emerald-600" />}
                    {placementStatus}
                  </h2>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm ${isSelected ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-brand-50 text-brand-600 border-brand-200'}`}>
                  <Award className="w-7 h-7" />
                </div>
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <GraduationCap className="w-4 h-4 text-brand-600" /> Student Profile Info
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm mt-1">{student?.name || 'Student'}</p>
                  <p className="text-slate-500">Reg No: {student?.registerNumber || student?.studentId || 'CS2026001'}</p>
                  <p className="text-slate-500">Department: {student?.department || 'CSE'} ({student?.batch || '2026'})</p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <Building2 className="w-4 h-4 text-brand-600" /> Academic Criteria
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                    CGPA: {student?.cgpa ?? 'Not added'}
                  </p>
                  <p className="text-slate-500">Backlogs: {student?.backlogs ?? 0}</p>
                  <p className="text-slate-500">
                    Profile Completion: {student?.profileCompletion || 0}%
                  </p>
                </div>
              </div>
            </div>

            {/* If SELECTED: Selection Details & Selection Letter Card */}
            {isSelected && selectedApp && (
              <div className="p-8 rounded-card bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 shadow-sm space-y-6">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-300">
                    🎉 Official Placement Offer
                  </span>
                  <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">
                    Selected for {selectedApp.jobTitle || selectedApp.jobId?.title || 'Position'} at {selectedApp.companyName || selectedApp.jobId?.companyName || 'Corporate Partner'}
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-800 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold text-[10px] uppercase block">Company</span>
                    <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{selectedApp.companyName || selectedApp.jobId?.companyName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold text-[10px] uppercase block">Position</span>
                    <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{selectedApp.jobTitle || selectedApp.jobId?.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold text-[10px] uppercase block">Package</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{selectedApp.salary || selectedApp.jobId?.salary}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold text-[10px] uppercase block">Location</span>
                    <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{selectedApp.location || selectedApp.jobId?.location || 'Corporate HQ'}</span>
                  </div>
                </div>

                {/* Selection Letter Section */}
                <div className="pt-4 border-t border-emerald-200/80 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-600" /> Selection Letter
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      View or print your official institutional placement selection letter
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <button
                      onClick={() => setSelectedAppForLetter(selectedApp)}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Selection Letter
                    </button>
                    <button
                      onClick={() => setSelectedAppForLetter(selectedApp)}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Selection Letter
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Selection Letter Modal */}
      {selectedAppForLetter && (
        <SelectionLetterModal
          application={selectedAppForLetter}
          student={student}
          onClose={() => setSelectedAppForLetter(null)}
        />
      )}
    </div>
  );
}
