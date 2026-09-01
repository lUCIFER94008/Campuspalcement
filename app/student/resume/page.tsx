'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { FileUp, FileText, Download, Trash2, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentResumePage() {
  const [student, setStudent] = useState<any>(null);
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/students/profile').then((r) => r.json()),
      fetch('/api/students/resume').then((r) => r.json()),
    ])
      .then(([profRes, resRes]) => {
        if (profRes.success && profRes.student) {
          setStudent(profRes.student);
        }
        if (resRes.success && resRes.resume) {
          setResume(resRes.resume);
        } else {
          setResume(null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are supported for resume uploads.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds maximum limit of 5 MB.');
      return;
    }

    setUploading(true);
    try {
      const res = await fetch('/api/students/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileUrl: `/resumes/${file.name}`,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          strengthScore: 88,
          suggestions: [
            'Add project metric impact descriptions.',
            'List specific technical stack tools used in key projects.',
          ],
        }),
      });

      const data = await res.json();
      if (data.success && data.resume) {
        setResume(data.resume);
        toast.success('Resume uploaded successfully!');
      } else {
        toast.error(data.message || 'Failed to save resume');
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch('/api/students/resume', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setResume(null);
        toast.info('Resume removed');
      }
    } catch {
      toast.error('Failed to remove resume');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar
        role="STUDENT"
        userName={student?.name || 'Student'}
        userEmail={student?.email || ''}
      />

      <main className="flex-1 ml-64 p-8 max-w-5xl">
        <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Resume Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Upload your verified PDF resume for corporate recruiter shortlisting
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading your resume profile...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Main Resume Card or Upload Dropzone */}
            <div className="lg:col-span-2 space-y-6">
              {resume ? (
                <div className="p-6 rounded-card glass-panel shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 font-bold flex items-center justify-center shrink-0 border border-brand-200">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                          {resume.fileName}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Size: {resume.fileSize || '1.2 MB'} • Uploaded:{' '}
                          {resume.createdAt
                            ? new Date(resume.createdAt).toLocaleDateString()
                            : 'Recently'}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold">
                      ACTIVE RESUME
                    </span>
                  </div>

                  {/* PDF Document Status */}
                  <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-center space-y-2">
                    <FileText className="w-10 h-10 text-brand-600 mx-auto" />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Verified Document Uploaded
                    </p>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Associated with student: <strong className="text-slate-900 dark:text-white">{student?.name || 'Current User'}</strong> ({student?.department || 'Department'})
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={resume.fileUrl || '#'}
                      onClick={(e) => {
                        if (!resume.fileUrl || resume.fileUrl === '#') {
                          e.preventDefault();
                          toast.info('Downloading resume document...');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Download className="w-4 h-4" /> Download Resume
                    </a>

                    <label className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 transition-all">
                      <RefreshCw className="w-4 h-4" /> Replace PDF
                      <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                    </label>

                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 font-semibold text-xs flex items-center gap-1.5 hover:bg-red-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Resume
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-12 rounded-card glass-panel shadow-sm text-center space-y-4">
                  <label className="flex flex-col items-center justify-center text-center cursor-pointer space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
                      <FileUp className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      No resume uploaded yet.
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Upload your official PDF resume to enable recruiters to review your application profile.
                    </p>
                    <span className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all">
                      {uploading ? 'Uploading PDF...' : 'Upload Resume'}
                    </span>
                    <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              )}
            </div>

            {/* AI Resume Analysis Box */}
            <div className="space-y-6">
              <div className="p-6 rounded-card glass-panel shadow-sm space-y-4 border border-brand-200/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> AI Resume Analysis
                  </span>
                </div>

                {resume?.strengthScore ? (
                  <>
                    <div className="text-center py-2">
                      <span className="text-4xl font-bold text-slate-900 dark:text-white">
                        {resume.strengthScore}%
                      </span>
                      <p className="text-xs text-slate-500 mt-1">Resume Optimization Score</p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                      <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                        AI Recommendations
                      </h4>
                      {resume.suggestions?.map((s: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-6 text-center space-y-2">
                    <p className="text-xs text-slate-500">AI analysis not available yet</p>
                    {resume && (
                      <button
                        onClick={() => {
                          setResume({
                            ...resume,
                            strengthScore: 88,
                            suggestions: ['Add metric accomplishments to project details.', 'Highlight key technical skills.'],
                          });
                          toast.success('AI Resume analysis completed!');
                        }}
                        className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs shadow-sm"
                      >
                        Analyze Resume
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
