import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, MessageSquare, CheckCircle, Zap } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { formatRelativeTime } from '../../utils/dateUtils';
import { useSocket } from '../../context/SocketContext';
import { SOCKET_EVENTS } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const { socket } = useSocket();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications({ limit: 10 });
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (e) {
      console.error('Failed to load notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = ({ notification }) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, handleNewNotification);
    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION_NEW, handleNewNotification);
    };
  }, [socket]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      notificationService.markAsRead(notification._id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    setIsOpen(false);
    if (notification.taskId?._id || notification.taskId) {
      const taskId = notification.taskId?._id || notification.taskId;
      navigate(`/tasks/${taskId}`);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-ivory-muted dark:text-midnight-muted hover:text-ivory-text dark:hover:text-midnight-text hover:bg-ivory-soft dark:hover:bg-midnight-slate rounded-xl transition-colors focus:outline-none cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-coral animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-ivory-paper dark:bg-midnight-ink shadow-2xl border border-ivory-subtle dark:border-midnight-subtle z-50 overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-between px-4 py-3 border-b border-ivory-subtle dark:border-midnight-subtle bg-ivory-soft/60 dark:bg-midnight-slate/40">
            <h4 className="text-xs font-bold text-ivory-text dark:text-midnight-text uppercase tracking-wider">
              Notifications
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-violet hover:underline inline-flex items-center space-x-1 cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-ivory-subtle/60 dark:divide-midnight-subtle/80">
            {loading && notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-ivory-muted dark:text-midnight-muted">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-ivory-muted dark:text-midnight-muted">
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => {
                let icon = <Zap className="h-3.5 w-3.5" />;
                let iconStyle = 'bg-violet/10 text-violet';

                const msg = (n.message || '').toLowerCase();
                if (msg.includes('assign')) {
                  iconStyle = 'bg-blueAccent/10 text-blueAccent';
                } else if (msg.includes('comment')) {
                  icon = <MessageSquare className="h-3.5 w-3.5" />;
                  iconStyle = 'bg-violet/10 text-violet';
                } else if (msg.includes('completed') || msg.includes('status')) {
                  icon = <CheckCircle className="h-3.5 w-3.5" />;
                  iconStyle = 'bg-lime/10 text-lime';
                } else if (msg.includes('urgent') || msg.includes('overdue')) {
                  iconStyle = 'bg-coral/10 text-coral';
                }

                return (
                  <div
                    key={n._id}
                    onClick={() => handleNotificationClick(n)}
                    className="p-3.5 hover:bg-ivory-soft/70 dark:hover:bg-midnight-slate/60 transition-colors cursor-pointer flex items-start justify-between space-x-3"
                  >
                    <div className="flex items-start space-x-2.5 min-w-0 flex-1">
                      <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${iconStyle}`}>
                        {icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs leading-relaxed ${
                            !n.isRead
                              ? 'font-bold text-ivory-text dark:text-midnight-text'
                              : 'text-ivory-muted dark:text-midnight-muted'
                          }`}
                        >
                          {n.message}
                        </p>
                        <span className="text-[10px] text-ivory-muted dark:text-midnight-muted mt-0.5 block font-mono">
                          {formatRelativeTime(n.createdAt)}
                        </span>
                      </div>
                    </div>

                    {!n.isRead && (
                      <button
                        onClick={(e) => handleMarkAsRead(n._id, e)}
                        title="Mark as read"
                        className="p-1 text-coral hover:opacity-80 rounded shrink-0 cursor-pointer"
                      >
                        <span className="block h-2 w-2 rounded-full bg-coral" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
