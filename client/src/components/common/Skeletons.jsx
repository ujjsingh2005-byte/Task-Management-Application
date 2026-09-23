import React from 'react';

export const TaskCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm animate-pulse space-y-4">
      <div className="flex justify-between items-start">
        <div className="h-5 bg-slate-200 dark:bg-white/10 rounded-lg w-20" />
        <div className="h-6 w-6 bg-slate-200 dark:bg-white/10 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-5 bg-slate-200 dark:bg-white/10 rounded w-3/4" />
        <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-full" />
        <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-2/3" />
      </div>
      <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
        <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24" />
        <div className="h-6 w-6 bg-slate-200 dark:bg-white/10 rounded-full" />
      </div>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm animate-pulse space-y-4">
      <div className="flex items-center space-x-3">
        <div className="h-12 w-12 bg-slate-200 dark:bg-white/10 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-1/2" />
          <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-3/4" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-full" />
        <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-2/3" />
      </div>
    </div>
  );
};

export const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-white/10 space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24" />
            <div className="h-8 w-8 bg-slate-200 dark:bg-white/10 rounded-xl" />
          </div>
          <div className="h-8 bg-slate-300 dark:bg-white/20 rounded w-16" />
          <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-32" />
        </div>
      ))}
    </div>
  );
};

export const ActivityItemSkeleton = () => {
  return (
    <div className="flex items-start space-x-3 py-3 animate-pulse">
      <div className="h-8 w-8 bg-slate-200 dark:bg-white/10 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-1/3" />
      </div>
    </div>
  );
};

export const SkeletonList = ({ count = 4 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3 w-3/4">
            <div className="h-8 w-8 bg-slate-200 dark:bg-white/10 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 bg-slate-200 dark:bg-white/10 rounded w-1/2" />
              <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-1/3" />
            </div>
          </div>
          <div className="h-6 w-16 bg-slate-200 dark:bg-white/10 rounded-full" />
        </div>
      ))}
    </div>
  );
};
