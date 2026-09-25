import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { DashboardStatsSkeleton } from '../components/common/Skeletons';
import { PresenceIndicator } from '../components/common/PresenceIndicator';
import { formatDate } from '../utils/dateUtils';
import { Link } from 'react-router-dom';
import {
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
  Github,
  Server,
  Radio,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const { connected, onlineUserIds } = useSocket();
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminConsoleData = async () => {
      try {
        setLoading(true);
        const [statsRes, actRes, usersRes] = await Promise.all([
          taskService.getAdminStats(),
          taskService.getActivities({ limit: 6 }),
          taskService.getAdminUsers(),
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
        if (actRes.success && actRes.data) {
          setRecentActivities(actRes.data.activities || []);
        }
        if (usersRes.success && usersRes.data) {
          setRecentUsers(usersRes.data.users?.slice(0, 5) || []);
        }
      } catch (err) {
        console.error('Failed to load admin console:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAdminConsoleData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-pearl-text dark:text-navy-text font-sans">Admin Console</h1>
        <DashboardStatsSkeleton />
      </div>
    );
  }

  const { overview = {}, statusMap = {}, priorityMap = {} } = stats;
  const activeCount = onlineUserIds ? onlineUserIds.size : 1;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Admin Executive Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-midnight-deep via-midnight-ink to-midnight-slate rounded-3xl p-6 sm:p-8 text-midnight-text border border-midnight-subtle shadow-2xl">
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
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet/20 text-violet-light text-xs font-bold border border-violet/40 shadow-xs">
                <Shield className="h-3.5 w-3.5 text-violet-light" />
                <span>Admin Console Authority</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-aqua/10 text-aqua border border-aqua/30">
                <span className="w-1.5 h-1.5 rounded-full bg-aqua animate-pulse-live mr-1" />
                <span>Active Master Session</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Ujjwal Singh
            </h1>

            <p className="text-xs text-midnight-muted max-w-xl">
              System Governance • Full-Stack Workspace Management • Real-Time Database Analytics & OCC Concurrency
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

      {/* System Overview Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
            System Overview
          </h2>
          <span className="text-[11px] font-mono text-aqua flex items-center space-x-1">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>Telemetry Live</span>
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl p-5 border border-ivory-subtle dark:border-midnight-subtle shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
                Users
              </p>
              <h3 className="text-3xl font-black text-blueAccent mt-1">
                {overview.totalUsers ?? 0}
              </h3>
            </div>
            <div className="p-3 bg-blueAccent/10 text-blueAccent rounded-xl">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl p-5 border border-ivory-subtle dark:border-midnight-subtle shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
                Tasks
              </p>
              <h3 className="text-3xl font-black text-violet mt-1">
                {overview.totalTasks ?? 0}
              </h3>
            </div>
            <div className="p-3 bg-violet/10 text-violet rounded-xl">
              <Layers className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl p-5 border border-ivory-subtle dark:border-midnight-subtle shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
                Active
              </p>
              <h3 className="text-3xl font-black text-aqua mt-1">
                {activeCount}
              </h3>
            </div>
            <div className="p-3 bg-aqua/10 text-aqua rounded-xl">
              <Activity className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl p-5 border border-ivory-subtle dark:border-midnight-subtle shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
                System
              </p>
              <h3 className="text-3xl font-black text-lime mt-1">
                99.9%
              </h3>
            </div>
            <div className="p-3 bg-lime/10 text-lime rounded-xl">
              <Server className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid: User Activity & System Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Section */}
        <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl p-6 border border-ivory-subtle dark:border-midnight-subtle shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-subtle dark:border-midnight-subtle">
            <h3 className="text-sm font-bold text-ivory-text dark:text-midnight-text flex items-center space-x-2">
              <Users className="h-4 w-4 text-blueAccent" />
              <span>User Activity & Governance</span>
            </h3>
            <Link
              to="/admin/users"
              className="text-xs font-semibold text-violet hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-xs text-ivory-muted dark:text-midnight-muted text-center py-6">
                No user activity recorded.
              </p>
            ) : (
              recentUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-ivory-soft/60 dark:bg-midnight-slate/40 border border-ivory-subtle dark:border-midnight-subtle text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-violet/10 text-violet flex items-center justify-center font-bold text-xs overflow-hidden border border-violet/20">
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} className="h-full w-full object-cover" />
                      ) : (
                        u.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-ivory-text dark:text-midnight-text">{u.name}</p>
                      <p className="text-[11px] text-ivory-muted dark:text-midnight-muted">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <PresenceIndicator userId={u._id} size="sm" />
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        u.role === 'ADMIN'
                          ? 'bg-violet/15 text-violet border-violet/30'
                          : 'bg-ivory-soft dark:bg-midnight-slate text-ivory-muted border-ivory-subtle'
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Activity Section */}
        <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl p-6 border border-ivory-subtle dark:border-midnight-subtle shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-subtle dark:border-midnight-subtle">
            <h3 className="text-sm font-bold text-ivory-text dark:text-midnight-text flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-lime" />
              <span>System Activity & Task Throughput</span>
            </h3>
            <Link
              to="/admin/reports"
              className="text-xs font-semibold text-violet hover:underline flex items-center space-x-1"
            >
              <span>Full Analytics</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Completed Tasks', count: statusMap.COMPLETED || 0, total: overview.totalTasks, color: 'bg-lime' },
              { label: 'In Progress Tasks', count: statusMap.IN_PROGRESS || 0, total: overview.totalTasks, color: 'bg-violet' },
              { label: 'Pending / To Do', count: statusMap.TODO || 0, total: overview.totalTasks, color: 'bg-blueAccent' },
              { label: 'Urgent Attention Required', count: priorityMap.URGENT || 0, total: overview.totalTasks, color: 'bg-coral' },
            ].map(({ label, count, total, color }) => {
              const pct = total ? Math.round((count / total) * 100) : 0;
              return (
                <div key={label} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-ivory-text dark:text-midnight-text">
                    <span>{label}</span>
                    <span>{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-ivory-soft dark:bg-midnight-slate overflow-hidden">
                    <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Audit Events Stream */}
      <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl p-6 border border-ivory-subtle dark:border-midnight-subtle shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-ivory-subtle dark:border-midnight-subtle">
          <h3 className="text-sm font-bold text-ivory-text dark:text-midnight-text flex items-center space-x-2">
            <Activity className="h-4 w-4 text-aqua" />
            <span>Recent Audit Events</span>
          </h3>
          <Link
            to="/admin/activity"
            className="text-xs font-semibold text-violet hover:underline flex items-center space-x-1"
          >
            <span>View All Logs</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {recentActivities.length === 0 ? (
            <p className="text-xs text-ivory-muted dark:text-midnight-muted text-center py-6">
              No audit events logged yet.
            </p>
          ) : (
            recentActivities.map((act) => (
              <div
                key={act._id}
                className="flex items-center justify-between p-3 rounded-xl bg-ivory-soft/50 dark:bg-midnight-slate/40 border border-ivory-subtle dark:border-midnight-subtle text-xs gap-4"
              >
                <div className="flex items-center space-x-3 truncate">
                  <span className="font-bold text-ivory-text dark:text-midnight-text shrink-0">
                    {act.userId?.name || 'System'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet/10 text-violet font-bold shrink-0">
                    {act.action}
                  </span>
                  <span className="text-ivory-muted dark:text-midnight-muted truncate">
                    {act.metadata?.title ? `"${act.metadata.title}"` : `Event on #${act.taskId || 'Platform'}`}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-ivory-muted dark:text-midnight-muted shrink-0">
                  {formatDate(act.createdAt)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminDashboardPage;
