'use client';

import React from 'react';
import { Briefcase, Award, Download, X, Printer, CheckCircle2, Building2 } from 'lucide-react';

interface SelectionLetterModalProps {
  application: any;
  student: any;
  onClose: () => void;
}

export function SelectionLetterModal({ application, student, onClose }: SelectionLetterModalProps) {
  if (!application) return null;

  const companyName = application.companyName || application.jobId?.companyName || 'Corporate Partner';
  const jobTitle = application.jobTitle || application.jobId?.title || 'Selected Position';
  const salary = application.salary || application.jobId?.salary || 'Competitive Package';
  const location = application.location || application.jobId?.location || 'Corporate Office';
  const studentName = student?.name || application.studentName || application.studentId?.name || 'Candidate';
  const regNo = student?.registerNumber || student?.studentId || 'CS2026001';
  const dept = student?.department || application.studentDept || 'Computer Science & Engineering';
  const course = student?.course || 'B.Tech';

  const selectionDate = application.updatedAt
    ? new Date(application.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-card shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 relative flex flex-col max-h-[90vh]">
        {/* Top Action Bar (hidden on print) */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
            <Award className="w-4 h-4 text-emerald-600" />
            Official Selection Letter Preview
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" /> Download / Print PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 overflow-y-auto font-sans text-slate-800 dark:text-slate-200 space-y-6 print:p-0 print:text-black">
          {/* Document Header */}
          <div className="flex items-center justify-between pb-6 border-b-2 border-brand-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                CH
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white print:text-black">
                  CampusHire Corporate Relations
                </h1>
                <p className="text-xs text-slate-500 print:text-gray-600">Unified Campus Placement Directorate</p>
              </div>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 text-xs font-bold border border-emerald-200 inline-flex items-center gap-1 print:border-gray-400 print:text-black">
                <CheckCircle2 className="w-3.5 h-3.5" /> CONFIRMED SELECTION
              </span>
              <p className="text-[11px] font-mono text-slate-400 mt-1 print:text-gray-600">
                Ref: CH/OFFER/2026/{(application._id || '101').toString().slice(-6).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Letter Meta Info */}
          <div className="flex flex-col sm:flex-row justify-between text-xs gap-4 pt-2">
            <div>
              <p className="text-slate-400 uppercase font-bold text-[10px] print:text-gray-500">To Candidate</p>
              <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 print:text-black">{studentName}</p>
              <p className="text-slate-600 dark:text-slate-400 print:text-gray-700">Reg No: {regNo}</p>
              <p className="text-slate-600 dark:text-slate-400 print:text-gray-700">Department: {dept} ({course})</p>
            </div>

            <div className="sm:text-right">
              <p className="text-slate-400 uppercase font-bold text-[10px] print:text-gray-500">Date of Selection</p>
              <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 print:text-black">{selectionDate}</p>
              <p className="text-slate-600 dark:text-slate-400 print:text-gray-700">Placement Drive: 2026 Batch</p>
            </div>
          </div>

          {/* Subject Line */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 font-bold text-xs text-brand-600 dark:text-brand-400 print:bg-gray-100 print:text-black print:border-gray-300">
            SUBJECT: OFFICIAL SELECTION CONFIRMATION FOR THE POSITION OF {jobTitle.toUpperCase()} AT {companyName.toUpperCase()}
          </div>

          {/* Body Text */}
          <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 print:text-gray-800">
            <p>Dear <strong>{studentName}</strong>,</p>
            <p>
              We are delighted to formally inform you that based on your academic profile and credentials evaluated during the corporate placement drive, you have been officially selected by <strong>{companyName}</strong> for campus placement.
            </p>
            <p>
              On behalf of the Institution and the Recruitment Management Team at {companyName}, we extend our sincere congratulations on this achievement.
            </p>
          </div>

          {/* Offer Details Box */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-800/40 print:border-gray-300 print:bg-white">
            <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider print:bg-gray-200 print:text-black">
              Official Placement Terms & Overview
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase print:text-gray-500">Hiring Organization</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block print:text-black">{companyName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase print:text-gray-500">Job Role / Designation</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block print:text-black">{jobTitle}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase print:text-gray-500">Offered CTC / Package</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block print:text-black">{salary}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase print:text-gray-500">Work Location</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block print:text-black">{location}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 print:text-gray-700">
            <p>
              <strong>Next Steps:</strong> The formal employment contract, pre-joining documentation checklist, and orientation schedule will be delivered directly by {companyName}'s Human Resources department.
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-8 text-xs print:border-gray-300">
            <div>
              <div className="h-10 flex items-end">
                <span className="font-serif italic font-bold text-brand-600 text-sm print:text-black">Dr. R. Sharma</span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white mt-1 print:text-black">Director of Corporate Placements</p>
              <p className="text-[11px] text-slate-400 print:text-gray-500">Campus Placement Directorate</p>
            </div>

            <div className="text-right">
              <div className="h-10 flex items-end justify-end">
                <span className="font-serif italic font-bold text-emerald-600 text-sm print:text-black">Head of Talent Acquisition</span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white mt-1 print:text-black">{companyName} Recruitment Cell</p>
              <p className="text-[11px] text-slate-400 print:text-gray-500">Authorized Corporate Partner</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
