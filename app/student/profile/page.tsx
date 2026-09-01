'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { User, GraduationCap, Code, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<any>({
    name: '',
    email: '',
    phone: '',
    dob: '',
    registerNumber: '',
    department: '',
    batch: '',
    cgpa: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    backlogs: 0,
    skills: [],
    profileCompletion: 0,
  });
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/students/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.student) {
          setProfile(data.student);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/students/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Profile updated successfully!');
        if (data.student) setProfile(data.student);
      }
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const currentSkills = profile.skills || [];
    if (currentSkills.includes(newSkill.trim())) return;
    setProfile({ ...profile, skills: [...currentSkills, newSkill.trim()] });
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    const currentSkills = profile.skills || [];
    setProfile({ ...profile, skills: currentSkills.filter((s: string) => s !== skill) });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex">
      <Sidebar role="STUDENT" userName={profile.name || 'Student'} userEmail={profile.email || ''} />

      <main className="flex-1 ml-64 p-8 max-w-5xl">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Student Profile
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Manage your academic and personal profile details</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-500">Profile Completion</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-brand-600 rounded-full transition-all duration-500"
                    style={{ width: `${profile.profileCompletion || 0}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-brand-600">{profile.profileCompletion || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading student profile...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8 mt-8">
            {/* 1. Personal Information */}
            <div className="p-6 rounded-card glass-panel shadow-sm space-y-4">
              <h2 className="text-base font-bold flex items-center gap-2 text-brand-600 dark:text-brand-400">
                <User className="w-5 h-5" /> Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name || ''}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email || ''}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profile.phone || ''}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={profile.dob || ''}
                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-600"
                  />
                </div>
              </div>
            </div>

            {/* 2. Academic Information */}
            <div className="p-6 rounded-card glass-panel shadow-sm space-y-4">
              <h2 className="text-base font-bold flex items-center gap-2 text-brand-600 dark:text-brand-400">
                <GraduationCap className="w-5 h-5" /> Academic Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Register Number
                  </label>
                  <input
                    type="text"
                    value={profile.registerNumber || ''}
                    onChange={(e) => setProfile({ ...profile, registerNumber: e.target.value })}
                    placeholder="e.g. CS2026001"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={profile.department || ''}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="MECH">MECH</option>
                    <option value="EEE">EEE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Batch Year
                  </label>
                  <input
                    type="text"
                    value={profile.batch || ''}
                    onChange={(e) => setProfile({ ...profile, batch: e.target.value })}
                    placeholder="2026"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Current CGPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={profile.cgpa ?? ''}
                    onChange={(e) => setProfile({ ...profile, cgpa: parseFloat(e.target.value) || '' })}
                    placeholder="e.g. 8.5"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-brand-600 font-bold text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Skills */}
            <div className="p-6 rounded-card glass-panel shadow-sm space-y-4">
              <h2 className="text-base font-bold flex items-center gap-2 text-brand-600 dark:text-brand-400">
                <Code className="w-5 h-5" /> Technical Skills
              </h2>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill (e.g. React, TypeScript, Python)"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {profile.skills?.length === 0 ? (
                  <span className="text-xs text-slate-400">No skills added yet.</span>
                ) : (
                  profile.skills?.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-600 text-xs font-semibold flex items-center gap-2 border border-brand-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-500 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              {saving ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
