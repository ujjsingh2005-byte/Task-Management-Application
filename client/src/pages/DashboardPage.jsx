import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { taskService } from '../services/taskService';
import { StatCards } from '../components/dashboard/StatCards';
import { UrgentTasksWidget } from '../components/dashboard/UrgentTasksWidget';
import { RecentActivityWidget } from '../components/dashboard/RecentActivityWidget';
import { DashboardStatsSkeleton } from '../components/common/Skeletons';
import { Button } from '../components/common/Button';
import { Plus, CheckSquare, Sparkles } from 'lucide-react';
import { SOCKET_EVENTS } from '../utils/constants';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { onOpenCreateTask } = useOutletContext() || {};
  const { socket, connected } = useSocket();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await taskService.getDashboardStats();
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardStats();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleTaskEvent = () => {
      loadDashboardStats();
    };

    socket.on(SOCKET_EVENTS.TASK_CREATED, handleTaskEvent);
    socket.on(SOCKET_EVENTS.TASK_STATUS_CHANGED, handleTaskEvent);
    socket.on(SOCKET_EVENTS.TASK_DELETED, handleTaskEvent);

    return () => {
      socket.off(SOCKET_EVENTS.TASK_CREATED, handleTaskEvent);
      socket.off(SOCKET_EVENTS.TASK_STATUS_CHANGED, handleTaskEvent);
      socket.off(SOCKET_EVENTS.TASK_DELETED, handleTaskEvent);
    };
  }, [socket]);

  // Greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Editorial Dashboard Hero Banner */}
      <div className="relative overflow-hidden bg-ivory-paper dark:bg-midnight border border-ivory-border dark:border-midnight-border rounded-modal p-6 sm:p-8 shadow-soft-light dark:shadow-soft-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Subtle Violet → Aqua → Coral ambient background glow */}
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-violet/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/3 w-64 h-64 bg-aqua/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-coral/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-aqua/10 border border-aqua/30 text-aqua-deep dark:text-aqua text-xs font-bold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-aqua animate-pulse-live" />
            <span>{connected ? 'Workspace Live' : 'Connecting to Live Sync...'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-ivory-text dark:text-midnight-text tracking-tight font-sans">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Teammate'}.
          </h1>
          <p className="text-xs sm:text-sm text-ivory-muted dark:text-midnight-muted mt-1 max-w-xl font-normal">
            "Here is what deserves your attention today."
          </p>
        </div>

        <div className="flex items-center space-x-3 relative z-10 w-full sm:w-auto">
          <Link to="/tasks" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              icon={CheckSquare}
              className="w-full sm:w-auto"
            >
              View Tasks
            </Button>
          </Link>
          {onOpenCreateTask && (
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={onOpenCreateTask}
              className="w-full sm:w-auto"
            >
              Create Task
            </Button>
          )}
        </div>
      </div>

      {/* Main Statistics Metric Cards */}
      {loading && !dashboardData ? (
        <DashboardStatsSkeleton />
      ) : (
        <StatCards stats={dashboardData?.stats} />
      )}

      {/* Two Column Section for Urgent Focus Tasks and Live Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UrgentTasksWidget tasks={dashboardData?.urgentTasks} />
        <RecentActivityWidget activities={dashboardData?.recentActivities} />
      </div>
    </div>
  );
};
