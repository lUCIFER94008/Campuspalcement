'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from './theme-provider';
import {
  LayoutDashboard,
  User,
  Search,
  FileText,
  Calendar,
  FileUp,
  Bell,
  CheckCircle2,
  Settings,
  Building2,
  PlusSquare,
  Users,
  Award,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface SidebarProps {
  role: 'STUDENT' | 'RECRUITER' | 'ADMIN';
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export function Sidebar({ role, userName = 'User', userEmail = '', userAvatar }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const studentLinks = [
    { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', href: '/student/profile', icon: User },
    { label: 'Find Jobs', href: '/student/jobs', icon: Search },
    { label: 'My Applications', href: '/student/applications', icon: FileText },
    { label: 'Interviews', href: '/student/interviews', icon: Calendar },
    { label: 'Resume', href: '/student/resume', icon: Sparkles },
    { label: 'Notifications', href: '/student/notifications', icon: Bell },
    { label: 'Placement Status', href: '/student/status', icon: CheckCircle2 },
    { label: 'Settings', href: '/student/settings', icon: Settings },
  ];

  const recruiterLinks = [
    { label: 'Dashboard', href: '/recruiter/dashboard', icon: LayoutDashboard },
    { label: 'Company Profile', href: '/recruiter/company', icon: Building2 },
    { label: 'Jobs', href: '/recruiter/jobs', icon: Briefcase },
    { label: 'Post New Job', href: '/recruiter/jobs/create', icon: PlusSquare },
    { label: 'Applicants', href: '/recruiter/applicants', icon: Users },
    { label: 'Interviews', href: '/recruiter/interviews', icon: Calendar },
    { label: 'Selected Candidates', href: '/recruiter/selected', icon: Award },
    { label: 'Notifications', href: '/recruiter/notifications', icon: Bell },
    { label: 'Settings', href: '/recruiter/settings', icon: Settings },
  ];

  const adminLinks = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Students', href: '/admin/students', icon: Users },
    { label: 'Companies', href: '/admin/companies', icon: Building2 },
    { label: 'Jobs', href: '/admin/jobs', icon: Briefcase },
    { label: 'Placement Drives', href: '/admin/drives', icon: Layers },
    { label: 'Applications', href: '/admin/applications', icon: FileText },
    { label: 'Interviews', href: '/admin/interviews', icon: Calendar },
    { label: 'Placements', href: '/admin/placements', icon: Award },
    { label: 'Reports & Analytics', href: '/admin/reports', icon: BarChart3 },
    { label: 'Notifications', href: '/admin/notifications', icon: Bell },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'RECRUITER' ? recruiterLinks : studentLinks;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/login');
      router.refresh();
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-200 ease-in-out glass-panel border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden group">
            <div className="relative w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
              <span className="text-xs font-black">CH</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-yellow-bright border-2 border-white" />
            </div>
            {!collapsed && (
              <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight truncate">
                CampusHire
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar width"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] custom-scrollbar">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-600'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {isActive && !collapsed && (
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-bright ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Controls */}
      <div className="p-3 border-t border-slate-200/60 dark:border-slate-800 space-y-2">
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-bright shrink-0" /> : <Moon className="w-4 h-4 text-slate-600 shrink-0" />}
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        <div className={`flex items-center gap-2.5 p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 ${collapsed ? 'justify-center' : ''}`}>
          <img
            src={
              userAvatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`
            }
            alt={userName}
            className="w-7 h-7 rounded-full bg-slate-200 shrink-0 object-cover border border-brand-200"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{userName}</p>
              <p className="text-[9px] text-brand-600 truncate uppercase font-bold">{role}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout user"
              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
