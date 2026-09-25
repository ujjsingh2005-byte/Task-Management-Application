import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import {
  BarChart3,
  Shield,
  Download,
  CheckCircle2,
  Clock,
  Layers,
  Users,
  Activity,
  Zap,
  TrendingUp,
  Percent,
} from 'lucide-react';

export const AdminReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await taskService.getAdminStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const { overview = {}, statusMap = {}, priorityMap = {} } = stats || {};

  const total = overview.totalTasks || 0;
  const completed = statusMap.COMPLETED || 0;
  const inProgress = statusMap.IN_PROGRESS || 0;
  const todo = statusMap.TODO || 0;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-lime/15 text-lime-deep dark:text-lime text-xs font-bold mb-2 border border-lime/30">
            <Shield className="h-3.5 w-3.5" />
            <span>Platform Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory-text dark:text-midnight-text tracking-tight">
            System Reports & Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-ivory-muted dark:text-midnight-muted mt-1">
            Executive metrics, completion velocity, team productivity breakdown, and audit exports.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-violet hover:bg-violet-light text-white text-xs font-semibold shadow-violet-glow transition-all self-start md:self-auto cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>Export Summary (PDF)</span>
        </button>
      </div>

      {/* Primary KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-ivory-muted dark:text-midnight-muted uppercase tracking-wider">
            <span>Completion Rate</span>
            <TrendingUp className="h-4 w-4 text-lime" />
          </div>
          <h2 className="text-4xl font-black text-lime">{completionRate}%</h2>
          <p className="text-xs text-ivory-muted dark:text-midnight-muted">
            {completed} of {total} total tasks resolved
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-ivory-muted dark:text-midnight-muted uppercase tracking-wider">
            <span>Work in Flight</span>
            <Clock className="h-4 w-4 text-violet" />
          </div>
          <h2 className="text-4xl font-black text-violet">{inProgress}</h2>
          <p className="text-xs text-ivory-muted dark:text-midnight-muted">Tasks currently in progress</p>
        </div>

        <div className="p-6 rounded-2xl bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-ivory-muted dark:text-midnight-muted uppercase tracking-wider">
            <span>Backlog Queue</span>
            <Layers className="h-4 w-4 text-blueAccent" />
          </div>
          <h2 className="text-4xl font-black text-blueAccent">{todo}</h2>
          <p className="text-xs text-ivory-muted dark:text-midnight-muted">Tasks waiting to be started</p>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Breakdown */}
        <div className="bg-ivory-paper dark:bg-midnight-ink p-6 rounded-2xl border border-ivory-subtle dark:border-midnight-subtle space-y-4">
          <h3 className="text-sm font-bold text-ivory-text dark:text-midnight-text flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-violet" />
            <span>Task Distribution by Status</span>
          </h3>

          <div className="space-y-3">
            {[
              { label: 'Completed', count: completed, color: 'bg-lime' },
              { label: 'In Progress', count: inProgress, color: 'bg-violet' },
              { label: 'To Do', count: todo, color: 'bg-blueAccent' },
              { label: 'Cancelled', count: statusMap.CANCELLED || 0, color: 'bg-roseAccent' },
            ].map(({ label, count, color }) => {
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

        {/* Priority Distribution Breakdown */}
        <div className="bg-ivory-paper dark:bg-midnight-ink p-6 rounded-2xl border border-ivory-subtle dark:border-midnight-subtle space-y-4">
          <h3 className="text-sm font-bold text-ivory-text dark:text-midnight-text flex items-center space-x-2">
            <Zap className="h-4 w-4 text-coral" />
            <span>Task Distribution by Priority</span>
          </h3>

          <div className="space-y-3">
            {[
              { label: 'Urgent Priority', count: priorityMap.URGENT || 0, color: 'bg-coral' },
              { label: 'High Priority', count: priorityMap.HIGH || 0, color: 'bg-amber' },
              { label: 'Medium Priority', count: priorityMap.MEDIUM || 0, color: 'bg-blueAccent' },
              { label: 'Low Priority', count: priorityMap.LOW || 0, color: 'bg-ivory-muted' },
            ].map(({ label, count, color }) => {
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
    </div>
  );
};
export default AdminReportsPage;
