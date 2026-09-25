import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { formatDate } from '../utils/dateUtils';
import {
  Activity,
  Shield,
  Search,
  Filter,
  RefreshCw,
  PlusCircle,
  Edit3,
  Trash2,
  UserCheck,
  Tag,
  CheckCircle2,
} from 'lucide-react';

export const AdminActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const loadActivities = async () => {
    try {
      setLoading(true);
      const res = await taskService.getActivities({ limit: 100 });
      if (res.success && res.data) {
        setActivities(res.data.activities || []);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const getActionBadge = (action) => {
    switch (action) {
      case 'CREATED':
        return { label: 'Created', color: 'bg-aqua/10 text-aqua border-aqua/30', icon: PlusCircle };
      case 'STATUS_CHANGED':
        return { label: 'Status Changed', color: 'bg-violet/10 text-violet border-violet/30', icon: CheckCircle2 };
      case 'UPDATED':
        return { label: 'Updated', color: 'bg-blueAccent/10 text-blueAccent border-blueAccent/30', icon: Edit3 };
      case 'ASSIGNED':
        return { label: 'Assigned', color: 'bg-amber/10 text-amber border-amber/30', icon: UserCheck };
      case 'PRIORITY_CHANGED':
        return { label: 'Priority Changed', color: 'bg-coral/10 text-coral border-coral/30', icon: Tag };
      case 'DELETED':
        return { label: 'Deleted', color: 'bg-roseAccent/10 text-roseAccent border-roseAccent/30', icon: Trash2 };
      default:
        return { label: action, color: 'bg-ivory-soft dark:bg-midnight-slate text-ivory-muted dark:text-midnight-muted', icon: Activity };
    }
  };

  const filtered = activities.filter((act) => {
    const matchSearch =
      act.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      act.metadata?.title?.toLowerCase().includes(search.toLowerCase()) ||
      act.action?.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === 'ALL' || act.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-aqua/15 text-aqua text-xs font-bold mb-2 border border-aqua/30">
            <Shield className="h-3.5 w-3.5 text-aqua" />
            <span>Audit Trail & Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory-text dark:text-midnight-text tracking-tight">
            Platform Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-ivory-muted dark:text-midnight-muted mt-1">
            Complete cryptographic activity timeline across all workspace tasks and user interactions.
          </p>
        </div>

        <button
          onClick={loadActivities}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle text-xs font-semibold text-ivory-text dark:text-midnight-text hover:border-aqua/40 transition-all self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="p-4 rounded-2xl bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ivory-muted dark:text-midnight-muted" />
          <input
            type="text"
            placeholder="Search by actor name, action, or task title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-ivory-soft dark:bg-midnight-slate border border-ivory-subtle dark:border-midnight-subtle rounded-xl text-ivory-text dark:text-midnight-text focus:outline-none focus:ring-2 focus:ring-aqua/30"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-ivory-soft dark:bg-midnight-slate border border-ivory-subtle dark:border-midnight-subtle rounded-xl text-ivory-text dark:text-midnight-text focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Actions</option>
          <option value="CREATED">Task Created</option>
          <option value="STATUS_CHANGED">Status Changed</option>
          <option value="UPDATED">Task Updated</option>
          <option value="ASSIGNED">Assignee Changed</option>
          <option value="PRIORITY_CHANGED">Priority Changed</option>
          <option value="DELETED">Task Deleted</option>
        </select>
      </div>

      {/* Log Feed */}
      <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl border border-ivory-subtle dark:border-midnight-subtle p-6 shadow-sm space-y-4">
        {loading ? (
          <div className="py-12 text-center text-ivory-muted dark:text-midnight-muted text-xs">
            Loading audit timeline...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-ivory-muted dark:text-midnight-muted text-xs">
            No audit records match the selected filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((log) => {
              const badge = getActionBadge(log.action);
              const Icon = badge.icon;
              return (
                <div
                  key={log._id}
                  className="flex items-start justify-between p-4 rounded-xl bg-ivory-soft/60 dark:bg-midnight-slate/40 border border-ivory-subtle dark:border-midnight-subtle hover:border-aqua/30 transition-all gap-4"
                >
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-full bg-violet/10 text-violet flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-violet/20">
                      {log.userId?.avatar ? (
                        <img src={log.userId.avatar} alt={log.userId.name} className="h-full w-full object-cover" />
                      ) : (
                        log.userId?.name?.charAt(0) || 'U'
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-ivory-text dark:text-midnight-text">
                          {log.userId?.name || 'System User'}
                        </span>
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
                          <Icon className="h-2.5 w-2.5" />
                          <span>{badge.label}</span>
                        </span>
                      </div>

                      <p className="text-xs text-ivory-muted dark:text-midnight-muted">
                        {log.metadata?.title ? (
                          <span>
                            Target task:{' '}
                            <strong className="text-ivory-text dark:text-midnight-text font-semibold">
                              "{log.metadata.title}"
                            </strong>
                          </span>
                        ) : (
                          <span>Action performed on entity #{log.taskId || 'General'}</span>
                        )}
                        {log.metadata?.from && log.metadata?.to && (
                          <span className="ml-1 text-[11px] font-mono text-violet">
                            ({log.metadata.from} → {log.metadata.to})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-ivory-muted dark:text-midnight-muted shrink-0">
                    {formatDate(log.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminActivityPage;
