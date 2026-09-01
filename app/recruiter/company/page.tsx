'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Building2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RecruiterCompanyPage() {
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>({
    companyName: '',
    industry: '',
    website: '',
    location: '',
    description: '',
    status: 'APPROVED',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((r) => r.json()),
      fetch('/api/companies').then((r) => r.json()),
    ])
      .then(([userRes, compRes]) => {
        if (userRes.success && userRes.user) setUser(userRes.user);
        if (compRes.success && compRes.companies && compRes.companies.length > 0) {
          setCompany(compRes.companies[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const endpoint = company._id ? `/api/companies/${company._id}` : '/api/companies';
      const method = company._id ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(company),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Company profile updated successfully!');
        if (data.company) setCompany(data.company);
      } else {
        toast.error(data.message || 'Save failed');
      }
    } catch {
      toast.error('Failed to save company profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="RECRUITER" userName={user?.name || 'Recruiter'} userEmail={user?.email || ''} />

      <main className="flex-1 ml-64 p-8 max-w-5xl">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Company Profile
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Manage corporate details and placement accreditation</p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> VERIFIED & APPROVED
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading company profile...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6 mt-8">
            <div className="p-6 rounded-card glass-panel shadow-sm space-y-4">
              <h2 className="text-base font-bold flex items-center gap-2 text-brand-600 dark:text-brand-400">
                <Building2 className="w-5 h-5" /> Corporate Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={company.companyName || company.name || ''}
                    onChange={(e) => setCompany({ ...company, companyName: e.target.value, name: e.target.value })}
                    placeholder="Enter corporate company name"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    value={company.industry || ''}
                    onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                    placeholder="e.g. Software, Financial Services, IT"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Official Website
                  </label>
                  <input
                    type="url"
                    value={company.website || ''}
                    onChange={(e) => setCompany({ ...company, website: e.target.value })}
                    placeholder="https://company.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Office Location
                  </label>
                  <input
                    type="text"
                    value={company.location || ''}
                    onChange={(e) => setCompany({ ...company, location: e.target.value })}
                    placeholder="City, Country"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Company Description
                  </label>
                  <textarea
                    rows={3}
                    value={company.description || ''}
                    onChange={(e) => setCompany({ ...company, description: e.target.value })}
                    placeholder="Brief overview of company business..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-600"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              {saving ? 'Saving...' : 'Save Corporate Profile'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
