import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import { StatusPill } from '../components/tasks/StatusPill';
import { PriorityBadge } from '../components/tasks/PriorityBadge';
import { formatDate } from '../utils/dateUtils';
import {
  CheckSquare,
  Search,
  Trash2,
  Filter,
  ExternalLink,
  Shield,
  Layers,
  AlertTriangle,
  UserCheck,
  RefreshCw,
} from 'lucide-react';

export const AdminTasksPage = () => {
  const { user: currentAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await taskService.getTasks({ limit: 100 });
      if (res.success && res.data) {
        setTasks(res.data.tasks || []);
      }
    } catch (err) {
      console.error('Failed to load tasks for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDelete = async (taskId, title) => {
    if (window.confirm(`Admin Action: Are you sure you want to permanently delete task "${title}"?`)) {
      try {
        await taskService.deleteTask(taskId);
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
      } catch (err) {
        console.error('Failed to delete task:', err);
        alert('Could not delete task');
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus, currentVersion) => {
    try {
      const res = await taskService.updateStatus(taskId, newStatus, currentVersion);
      if (res.success && res.data) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, status: newStatus, version: res.data.version } : t))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.assignedTo?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const totalTasks = tasks.length;
  const urgentCount = tasks.filter((t) => t.priority === 'URGENT').length;
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const unassignedCount = tasks.filter((t) => !t.assignedTo).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet/15 text-violet-light text-xs font-bold mb-2 border border-violet/30">
            <Shield className="h-3.5 w-3.5 text-violet-light" />
            <span>Admin Task Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory-text dark:text-midnight-text tracking-tight">
            Workspace Task Control
          </h1>
          <p className="text-xs sm:text-sm text-ivory-muted dark:text-midnight-muted mt-1">
            Global oversight across all workspace tasks, assignments, priorities, and lifecycles.
          </p>
        </div>

        <button
          onClick={loadTasks}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle text-xs font-semibold text-ivory-text dark:text-midnight-text hover:border-violet/40 transition-all self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
            Total Tasks
          </p>
          <h3 className="text-2xl font-extrabold text-blueAccent mt-1">{totalTasks}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
            Completed
          </p>
          <h3 className="text-2xl font-extrabold text-lime mt-1">{completedCount}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
            Urgent Tasks
          </p>
          <h3 className="text-2xl font-extrabold text-coral mt-1">{urgentCount}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
            Unassigned
          </p>
          <h3 className="text-2xl font-extrabold text-amber mt-1">{unassignedCount}</h3>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="p-4 rounded-2xl bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ivory-muted dark:text-midnight-muted" />
          <input
            type="text"
            placeholder="Search by task title, description, or assignee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-ivory-soft dark:bg-midnight-slate border border-ivory-subtle dark:border-midnight-subtle rounded-xl text-ivory-text dark:text-midnight-text focus:outline-none focus:ring-2 focus:ring-violet/30"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-ivory-soft dark:bg-midnight-slate border border-ivory-subtle dark:border-midnight-subtle rounded-xl text-ivory-text dark:text-midnight-text focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-ivory-soft dark:bg-midnight-slate border border-ivory-subtle dark:border-midnight-subtle rounded-xl text-ivory-text dark:text-midnight-text focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl border border-ivory-subtle dark:border-midnight-subtle shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ivory-soft/60 dark:bg-midnight-slate/40 border-b border-ivory-subtle dark:border-midnight-subtle text-[11px] font-bold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
                <th className="py-3.5 px-4">Task</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Assignee</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-subtle/60 dark:divide-midnight-subtle/80 text-xs text-ivory-text dark:text-midnight-text">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-ivory-muted dark:text-midnight-muted">
                    Loading workspace tasks...
                  </td>
                </tr>
              ) : filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-ivory-muted dark:text-midnight-muted">
                    No tasks match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((t) => (
                  <tr key={t._id} className="hover:bg-ivory-soft/50 dark:hover:bg-midnight-slate/40 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <Link
                        to={`/tasks/${t._id}`}
                        className="font-bold text-ivory-text dark:text-midnight-text hover:text-violet transition-colors flex items-center space-x-1.5 group"
                      >
                        <span className="truncate">{t.title}</span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </Link>
                      <p className="text-[11px] text-ivory-muted dark:text-midnight-muted truncate mt-0.5">
                        {t.description || 'No description provided'}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={t.status}
                        onChange={(e) => handleStatusChange(t._id, e.target.value, t.version)}
                        className="text-[11px] font-bold py-1 px-2 rounded-lg bg-ivory-soft dark:bg-midnight-slate border border-ivory-subtle dark:border-midnight-subtle text-ivory-text dark:text-midnight-text focus:outline-none cursor-pointer"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      {t.assignedTo ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 rounded-full bg-violet/10 text-violet flex items-center justify-center font-bold text-[10px] overflow-hidden border border-violet/20">
                            {t.assignedTo.avatar ? (
                              <img src={t.assignedTo.avatar} alt={t.assignedTo.name} className="h-full w-full object-cover" />
                            ) : (
                              t.assignedTo.name?.charAt(0) || 'U'
                            )}
                          </div>
                          <span className="text-xs font-medium">{t.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-ivory-muted dark:text-midnight-muted italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-ivory-muted dark:text-midnight-muted font-mono">
                      {t.dueDate ? formatDate(t.dueDate) : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(t._id, t.title)}
                        className="p-1.5 text-ivory-muted dark:text-midnight-muted hover:text-roseAccent hover:bg-roseAccent/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Task Permanently"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminTasksPage;
