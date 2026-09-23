import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { useSocket } from '../context/SocketContext';
import {
  Activity,
  PlusCircle,
  Edit,
  CheckCircle2,
  UserPlus,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { SkeletonList } from '../components/common/Skeletons';
import { Link } from 'react-router-dom';

const ACTION_FILTERS = [
  { id: '', label: 'All Activities' },
  { id: 'TASK_CREATED', label: 'Tasks Created' },
  { id: 'TASK_UPDATED', label: 'Tasks Updated' },
  { id: 'STATUS_UPDATED', label: 'Status Changes' },
  { id: 'COMMENT_ADDED', label: 'Comments' },
  { id: 'ASSIGNED', label: 'Assignments' },
];

export const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { socket } = useSocket();

  const fetchActivities = async (filterAction = selectedFilter, pageNum = 1) => {
    try {
      setLoading(true);
      const res = await taskService.getActivities({
        action: filterAction || undefined,
        page: pageNum,
        limit: 20,
      });
      if (res.success && res.data?.activities) {
        setActivities(res.data.activities);
        setTotalPages(res.data.pagination?.pages || 1);
      }
    } catch (err) {
      console.error('Failed to load activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(selectedFilter, page);
  }, [selectedFilter, page]);

  // Real-time listener for new activities
  useEffect(() => {
    if (!socket) return;

    const handleTaskUpdated = () => {
      fetchActivities(selectedFilter, 1);
    };

    socket.on('task:created', handleTaskUpdated);
    socket.on('task:updated', handleTaskUpdated);
    socket.on('task:status_updated', handleTaskUpdated);
    socket.on('comment:new', handleTaskUpdated);

    return () => {
      socket.off('task:created', handleTaskUpdated);
      socket.off('task:updated', handleTaskUpdated);
      socket.off('task:status_updated', handleTaskUpdated);
      socket.off('comment:new', handleTaskUpdated);
    };
  }, [socket, selectedFilter]);

  const getActionBadge = (action) => {
    switch (action) {
      case 'TASK_CREATED':
        return {
          icon: PlusCircle,
          color: 'bg-lime/10 text-lime border-lime/30',
          text: 'Created task',
        };
      case 'STATUS_UPDATED':
        return {
          icon: CheckCircle2,
          color: 'bg-violet/10 text-violet border-violet/30',
          text: 'Changed status',
        };
      case 'ASSIGNED':
        return {
          icon: UserPlus,
          color: 'bg-blueAccent/10 text-blueAccent border-blueAccent/30',
          text: 'Assigned task',
        };
      case 'COMMENT_ADDED':
        return {
          icon: MessageSquare,
          color: 'bg-coral/10 text-coral border-coral/30',
          text: 'Commented',
        };
      default:
        return {
          icon: Edit,
          color: 'bg-ivory-soft dark:bg-midnight-slate text-ivory-muted dark:text-midnight-muted border-ivory-subtle dark:border-midnight-subtle',
          text: 'Updated task',
        };
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-ivory-paper dark:bg-midnight-ink p-6 sm:p-8 rounded-2xl border border-ivory-subtle dark:border-midnight-subtle shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-aqua/10 border border-aqua/30 text-aqua text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-aqua animate-pulse-live" />
            <span>Workspace Audit Stream</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory-text dark:text-midnight-text tracking-tight">
            Activity Timeline
          </h1>
          <p className="text-sm text-ivory-muted dark:text-midnight-muted mt-1 max-w-xl">
            Complete transparent real-time log of everything happening across all projects, tasks, and assignments.
          </p>
        </div>

        <button
          onClick={() => fetchActivities(selectedFilter, page)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-ivory-soft dark:bg-midnight-slate border border-ivory-subtle dark:border-midnight-subtle hover:bg-ivory-subtle dark:hover:bg-midnight-subtle text-ivory-text dark:text-midnight-text text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-violet" />
          <span>Refresh Log</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {ACTION_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setSelectedFilter(f.id);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
              selectedFilter === f.id
                ? 'bg-violet text-white font-bold border-violet shadow-violet-glow'
                : 'bg-ivory-paper dark:bg-midnight-ink text-ivory-muted dark:text-midnight-muted border-ivory-subtle dark:border-midnight-subtle hover:bg-ivory-soft dark:hover:bg-midnight-slate'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Activity Timeline List */}
      <div className="bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle rounded-2xl p-6 sm:p-8 shadow-sm">
        {loading ? (
          <SkeletonList count={6} />
        ) : activities.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="w-12 h-12 mx-auto text-ivory-muted dark:text-midnight-muted opacity-60 mb-3" />
            <h3 className="text-base font-bold text-ivory-text dark:text-midnight-text">
              No activity logs recorded yet
            </h3>
            <p className="text-xs text-ivory-muted dark:text-midnight-muted mt-1">
              Events will appear here automatically as teammates make updates.
            </p>
          </div>
        ) : (
          <div className="relative border-l-2 border-ivory-subtle dark:border-midnight-subtle ml-4 pl-6 space-y-6">
            {activities.map((act) => {
              const badge = getActionBadge(act.action);
              const Icon = badge.icon;
              const date = new Date(act.createdAt);

              return (
                <div key={act._id} className="relative group">
                  {/* Dot indicator */}
                  <div
                    className={`absolute -left-[35px] top-1 w-6 h-6 rounded-full border-2 border-ivory-paper dark:border-midnight-ink flex items-center justify-center shadow-xs ${badge.color}`}
                  >
                    <Icon className="w-3 h-3" />
                  </div>

                  {/* Activity Card */}
                  <div className="p-4 rounded-xl bg-ivory-soft/60 dark:bg-midnight-slate/40 border border-ivory-subtle dark:border-midnight-subtle hover:border-violet/40 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-violet/10 text-violet border border-violet/20 flex items-center justify-center font-bold text-xs shrink-0">
                          {act.userId?.name?.charAt(0) || 'U'}
                        </div>
                        <p className="text-xs text-ivory-text dark:text-midnight-text font-medium">
                          <span className="font-bold text-ivory-text dark:text-midnight-text">
                            {act.userId?.name || 'A team member'}
                          </span>{' '}
                          <span className="text-ivory-muted dark:text-midnight-muted">
                            {badge.text.toLowerCase()}
                          </span>
                        </p>
                      </div>

                      <span className="text-[11px] text-ivory-muted dark:text-midnight-muted flex items-center space-x-1 shrink-0 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>
                          {date.toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          at{' '}
                          {date.toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </span>
                    </div>

                    {/* Associated Task */}
                    {act.taskId && (
                      <div className="mt-2.5 flex items-center space-x-2">
                        <Link
                          to={`/tasks/${act.taskId._id || act.taskId}`}
                          className="text-xs font-semibold text-violet hover:underline inline-flex items-center space-x-1"
                        >
                          <span>{act.taskId.title || 'Task Details'}</span>
                        </Link>
                      </div>
                    )}

                    {/* Details diff */}
                    {act.details && Object.keys(act.details).length > 0 && (
                      <div className="mt-2 text-xs text-ivory-text dark:text-midnight-text bg-ivory-paper dark:bg-midnight-ink p-2.5 rounded-xl font-mono border border-ivory-subtle dark:border-midnight-subtle text-[11px]">
                        {JSON.stringify(act.details, null, 2)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 pt-4 border-t border-ivory-subtle dark:border-midnight-subtle flex items-center justify-between">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-ivory-soft dark:bg-midnight-slate hover:bg-violet/10 disabled:opacity-40 transition-colors text-ivory-text dark:text-midnight-text cursor-pointer"
            >
              Previous
            </button>
            <span className="text-xs text-ivory-muted dark:text-midnight-muted">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-ivory-soft dark:bg-midnight-slate hover:bg-violet/10 disabled:opacity-40 transition-colors text-ivory-text dark:text-midnight-text cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
