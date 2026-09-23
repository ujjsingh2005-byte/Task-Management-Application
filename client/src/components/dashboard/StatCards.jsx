import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
  TrendingUp,
  Activity,
  Zap,
} from 'lucide-react';

export const StatCards = ({ stats = {} }) => {
  const total = stats.totalTasks || 0;
  const inProgress = stats.inProgressTasks || 0;
  const completed = stats.completedTasks || 0;
  const overdue = stats.overdueTasks || 0;
  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 4 Distinct Personality Stat Cards (Section 16) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1 — TOTAL TASKS (Blue Theme) */}
        <div className="bg-[#EBF2FF] dark:bg-[#0D1E3A] border border-blueAccent/30 dark:border-blueAccent/20 rounded-modal p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blueAccent dark:text-blueAccent-soft mb-1">
                Total Tasks
              </p>
              <h3 className="text-3xl font-black text-ivory-text dark:text-midnight-text tracking-tight font-sans">
                {total}
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-blueAccent/15 text-blueAccent border border-blueAccent/30">
              <ListTodo className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-blueAccent/20 flex items-center justify-between text-[11px] font-medium text-blueAccent">
            <span>+12.4% this month</span>
          </div>
        </div>

        {/* CARD 2 — IN PROGRESS (Violet Theme) */}
        <div className="bg-[#F3F0FF] dark:bg-[#1A1333] border border-violet/30 dark:border-violet/20 rounded-modal p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-violet dark:text-violet-bright mb-1">
                In Progress
              </p>
              <h3 className="text-3xl font-black text-ivory-text dark:text-midnight-text tracking-tight font-sans">
                {inProgress}
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-violet/15 text-violet border border-violet/30">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-violet/20 flex items-center justify-between text-[11px] font-medium text-violet dark:text-violet-bright">
            <span>Active development</span>
          </div>
        </div>

        {/* CARD 3 — COMPLETED (Lime Theme) */}
        <div className="bg-[#F2FCE2] dark:bg-[#132B13] border border-lime/30 dark:border-lime/20 rounded-modal p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-lime-deep dark:text-lime mb-1">
                Completed
              </p>
              <h3 className="text-3xl font-black text-ivory-text dark:text-midnight-text tracking-tight font-sans">
                {completed}
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-lime/15 text-lime-deep dark:text-lime border border-lime/30">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-lime/20 flex items-center justify-between text-[11px] font-medium text-lime-deep dark:text-lime">
            <span>Shipped & verified</span>
          </div>
        </div>

        {/* CARD 4 — OVERDUE / URGENT (Coral Theme) */}
        <div className="bg-[#FFF1F0] dark:bg-[#331414] border border-coral/30 dark:border-coral/20 rounded-modal p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-coral mb-1">
                Overdue Focus
              </p>
              <h3 className="text-3xl font-black text-ivory-text dark:text-midnight-text tracking-tight font-sans">
                {overdue}
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-coral/15 text-coral border border-coral/30">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-coral/20 flex items-center justify-between text-[11px] font-medium text-coral">
            <span>Requires urgent action</span>
          </div>
        </div>
      </div>

      {/* Featured Productivity Overview Card (Section 17: Midnight + Aqua/Violet) */}
      <div className="bg-midnight border border-midnight-border rounded-modal p-6 text-midnight-text shadow-elevated-dark relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-violet/15 via-aqua/5 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-violet/20 border border-violet/30 text-violet-bright text-[10px] font-bold uppercase tracking-wider mb-1">
            <Zap className="w-3 h-3" />
            <span>Velocity Engine</span>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-white">
            Productivity Overview
          </h4>
          <p className="text-xs text-midnight-muted max-w-md">
            +14% completed tasks compared with last workspace sprint cycle.
          </p>
        </div>

        <div className="relative z-10 w-full md:w-80 flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-midnight-muted">Completion Rate</span>
            <span className="text-aqua text-sm font-black font-mono">{completionPct}%</span>
          </div>
          <div className="w-full bg-midnight-elevated h-3 rounded-full overflow-hidden border border-midnight-border">
            <div
              className="bg-gradient-to-r from-violet to-aqua shadow-aqua-glow h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-midnight-secondary pt-0.5">
            <span>{completed} closed</span>
            <span>{total - completed} remaining</span>
          </div>
        </div>
      </div>
    </div>
  );
};
