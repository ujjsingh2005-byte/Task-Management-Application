import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import { DashboardStatsSkeleton } from '../components/common/Skeletons';
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  Clock,
  Layers,
  BarChart3,
  MessageSquare,
  Activity,
  Shield,
  Zap,
  Mail,
  Phone,
  MapPin,
  Github,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await taskService.getAdminStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-pearl-text dark:text-navy-text font-sans">Admin Metrics & Platform Health</h1>
        <DashboardStatsSkeleton />
      </div>
    );
  }

  const { overview = {}, statusMap = {}, priorityMap = {} } = stats;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner with Admin Identity */}
      <div className="relative overflow-hidden bg-gradient-to-br from-midnight-deep via-midnight-ink to-midnight-slate rounded-3xl p-6 sm:p-8 text-midnight-text border border-midnight-subtle shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Admin Photo */}
          <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-gradient-to-tr from-violet to-aqua p-0.5 shadow-xl shrink-0 ring-4 ring-midnight-border/60 overflow-hidden">
            <img
              src="/admin-avatar.jpg"
              alt="Ujjwal Singh"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = user?.avatar || '/admin-avatar.jpg';
              }}
              className="h-full w-full object-cover object-top"
            />
          </div>

          {/* Admin Info */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet/20 text-violet-light text-xs font-bold border border-violet/40">
                <Shield className="h-3.5 w-3.5 text-violet-light" />
                <span>System Administrator</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-aqua/10 text-aqua border border-aqua/30">
                <span>Lead Full-Stack Architect</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Ujjwal Singh
            </h1>

            <p className="text-xs text-midnight-muted max-w-xl">
              B.Tech in Computer Science & Engineering (AKTU, Lucknow) • MERN & Python Full-Stack Engineer • System Governance & Real-Time Analytics
            </p>

            {/* Quick Contacts */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-midnight-muted pt-1">
              <span className="flex items-center space-x-1">
                <Mail className="h-3 w-3 text-violet-light" />
                <span>ujjsingh203@gmail.com</span>
              </span>
              <span className="flex items-center space-x-1">
                <Phone className="h-3 w-3 text-lime" />
                <span>+91 8604913255</span>
              </span>
              <a
                href="https://github.com/ujjsingh2005-byte"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 text-violet-light hover:underline"
              >
                <Github className="h-3 w-3" />
                <span>ujjsingh2005-byte</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Global Totals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl p-5 border border-ivory-subtle dark:border-midnight-subtle shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
              Total Users
            </p>
            <h3 className="text-3xl font-extrabold text-blueAccent mt-1">
              {overview.totalUsers ?? 0}
            </h3>
          </div>
          <div className="p-3 bg-blueAccent/10 text-blueAccent rounded-xl">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl p-5 border border-ivory-subtle dark:border-midnight-subtle shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
              Total Tasks
            </p>
            <h3 className="text-3xl font-extrabold text-violet mt-1">
              {overview.totalTasks ?? 0}
            </h3>
          </div>
          <div className="p-3 bg-violet/10 text-violet rounded-xl">
            <Layers className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl p-5 border border-ivory-subtle dark:border-midnight-subtle shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
              Total Comments
            </p>
            <h3 className="text-3xl font-extrabold text-aqua mt-1">
              {overview.totalComments ?? 0}
            </h3>
          </div>
          <div className="p-3 bg-aqua/10 text-aqua rounded-xl">
            <MessageSquare className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl p-5 border border-ivory-subtle dark:border-midnight-subtle shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
              Activity Logs
            </p>
            <h3 className="text-3xl font-extrabold text-lime mt-1">
              {overview.totalActivities ?? 0}
            </h3>
          </div>
          <div className="p-3 bg-lime/10 text-lime rounded-xl">
            <Activity className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Task Distribution Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl p-6 sm:p-8 border border-ivory-subtle dark:border-midnight-subtle shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-ivory-subtle dark:border-midnight-subtle">
            <div className="p-2 rounded-lg bg-violet/10 text-violet">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-ivory-text dark:text-midnight-text">
              Task Status Distribution
            </h3>
          </div>

          <div className="space-y-4">
            {[
              { label: 'To Do', key: 'TODO', color: 'bg-blueAccent' },
              { label: 'In Progress', key: 'IN_PROGRESS', color: 'bg-violet' },
              { label: 'Completed', key: 'COMPLETED', color: 'bg-lime' },
              { label: 'Cancelled', key: 'CANCELLED', color: 'bg-roseAccent' },
            ].map(({ label, key, color }) => {
              const count = statusMap[key] || 0;
              const pct = overview.totalTasks ? Math.round((count / overview.totalTasks) * 100) : 0;
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-ivory-text dark:text-midnight-text">
                    <span>{label}</span>
                    <span>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-ivory-soft dark:bg-midnight-slate rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl p-6 sm:p-8 border border-ivory-subtle dark:border-midnight-subtle shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-ivory-subtle dark:border-midnight-subtle">
            <div className="p-2 rounded-lg bg-coral/10 text-coral">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-ivory-text dark:text-midnight-text">
              Task Priority Distribution
            </h3>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Low', key: 'LOW', color: 'bg-ivory-muted dark:bg-midnight-muted' },
              { label: 'Medium', key: 'MEDIUM', color: 'bg-blueAccent' },
              { label: 'High', key: 'HIGH', color: 'bg-amber' },
              { label: 'Urgent', key: 'URGENT', color: 'bg-coral' },
            ].map(({ label, key, color }) => {
              const count = priorityMap[key] || 0;
              const pct = overview.totalTasks ? Math.round((count / overview.totalTasks) * 100) : 0;
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-ivory-text dark:text-midnight-text">
                    <span>{label}</span>
                    <span>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-ivory-soft dark:bg-midnight-slate rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
