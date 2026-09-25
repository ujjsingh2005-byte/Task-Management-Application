import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationService } from '../services/notificationService';
import { formatDate } from '../utils/dateUtils';
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'READ') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber/15 text-amber text-xs font-bold mb-2 border border-amber/30">
            <Bell className="h-3.5 w-3.5" />
            <span>Workspace Notifications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory-text dark:text-midnight-text tracking-tight">
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-ivory-muted dark:text-midnight-muted mt-1">
            Real-time updates regarding task assignments, mentions, status transitions, and comments.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-ivory-soft dark:bg-midnight-slate text-xs font-semibold text-ivory-text dark:text-midnight-text hover:bg-ivory-subtle transition-all cursor-pointer"
            >
              <CheckCheck className="h-3.5 w-3.5 text-aqua" />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            onClick={loadNotifications}
            className="p-2 rounded-xl bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle text-ivory-muted dark:text-midnight-muted hover:text-violet transition-all cursor-pointer"
            title="Refresh Notifications"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-ivory-subtle dark:border-midnight-subtle pb-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'ALL'
              ? 'bg-violet/15 text-violet'
              : 'text-ivory-muted dark:text-midnight-muted hover:text-ivory-text'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'UNREAD'
              ? 'bg-amber/15 text-amber'
              : 'text-ivory-muted dark:text-midnight-muted hover:text-ivory-text'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('READ')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'READ'
              ? 'bg-ivory-soft dark:bg-midnight-slate text-ivory-text dark:text-midnight-text'
              : 'text-ivory-muted dark:text-midnight-muted hover:text-ivory-text'
          }`}
        >
          Read ({notifications.length - unreadCount})
        </button>
      </div>

      {/* List */}
      <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl border border-ivory-subtle dark:border-midnight-subtle p-6 shadow-sm space-y-3">
        {loading ? (
          <div className="py-12 text-center text-ivory-muted dark:text-midnight-muted text-xs">
            Loading notifications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-ivory-muted dark:text-midnight-muted text-xs">
            No notifications in this filter.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item._id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                item.isRead
                  ? 'bg-ivory-soft/30 dark:bg-midnight-slate/30 border-ivory-subtle/50 dark:border-midnight-subtle/50'
                  : 'bg-violet/5 dark:bg-violet/10 border-violet/30'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    item.isRead ? 'bg-ivory-soft dark:bg-midnight-slate text-ivory-muted' : 'bg-violet/15 text-violet'
                  }`}
                >
                  <Bell className="h-4 w-4" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-xs font-bold text-ivory-text dark:text-midnight-text">
                      {item.title || 'Workspace Update'}
                    </p>
                    {!item.isRead && (
                      <span className="h-2 w-2 rounded-full bg-amber animate-pulse-live" />
                    )}
                  </div>
                  <p className="text-xs text-ivory-muted dark:text-midnight-muted">
                    {item.message}
                  </p>
                  <p className="text-[10px] font-mono text-ivory-muted dark:text-midnight-muted pt-1">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {item.taskId && (
                  <Link
                    to={`/tasks/${item.taskId}`}
                    className="p-1.5 rounded-lg bg-ivory-soft dark:bg-midnight-slate hover:bg-violet/15 text-ivory-muted hover:text-violet transition-colors"
                    title="Open Task"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                )}
                {!item.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(item._id)}
                    className="p-1.5 rounded-lg bg-ivory-soft dark:bg-midnight-slate hover:bg-aqua/15 text-ivory-muted hover:text-aqua transition-colors cursor-pointer"
                    title="Mark as Read"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-1.5 rounded-lg bg-ivory-soft dark:bg-midnight-slate hover:bg-roseAccent/15 text-ivory-muted hover:text-roseAccent transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;
