import React from 'react';
import { formatRelativeTime } from '../../utils/dateUtils';
import { Activity, Plus, CheckCircle, UserCheck, MessageSquare, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecentActivityWidget = ({ activities = [] }) => {
  const getActionIcon = (action) => {
    switch (action) {
      case 'CREATED':
      case 'TASK_CREATED':
        return <Plus className="h-3.5 w-3.5 text-blueAccent" />;
      case 'STATUS_CHANGED':
      case 'STATUS_UPDATED':
        return <CheckCircle className="h-3.5 w-3.5 text-lime-deep dark:text-lime" />;
      case 'ASSIGNED':
        return <UserCheck className="h-3.5 w-3.5 text-aqua" />;
      case 'COMMENTED':
      case 'COMMENT_ADDED':
        return <MessageSquare className="h-3.5 w-3.5 text-violet" />;
      default:
        return <Edit2 className="h-3.5 w-3.5 text-violet" />;
    }
  };

  const formatText = (act) => {
    const actor = act.userId?.name || 'Someone';
    const taskTitle = act.taskId?.title ? `"${act.taskId.title}"` : 'a task';

    switch (act.action) {
      case 'CREATED':
      case 'TASK_CREATED':
        return `${actor} created ${taskTitle}`;
      case 'STATUS_CHANGED':
      case 'STATUS_UPDATED':
        return `${actor} updated status of ${taskTitle}`;
      case 'ASSIGNED':
        return `${actor} assigned ${taskTitle}`;
      case 'COMMENTED':
      case 'COMMENT_ADDED':
        return `${actor} commented on ${taskTitle}`;
      default:
        return `${actor} updated ${taskTitle}`;
    }
  };

  return (
    <div className="bg-aqua/5 dark:bg-midnight border border-aqua/30 dark:border-aqua/20 rounded-modal p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-aqua/20 dark:border-midnight-border mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-aqua/15 text-aqua border border-aqua/30">
              <Activity className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-aqua-deep dark:text-aqua font-sans">
              Live Activity Stream
            </h3>
          </div>
          <Link
            to="/activity"
            className="text-xs font-semibold text-aqua-deep dark:text-aqua hover:underline transition-colors"
          >
            Full Log →
          </Link>
        </div>

        {activities.length === 0 ? (
          <p className="text-center py-12 text-xs text-ivory-muted dark:text-midnight-muted">No activity yet</p>
        ) : (
          <div className="divide-y divide-aqua/15 dark:divide-midnight-border">
            {activities.map((act) => (
              <div key={act._id} className="py-3 flex items-start space-x-3 text-xs">
                <span className="p-1.5 rounded-lg bg-white/70 dark:bg-midnight-elevated mt-0.5 shrink-0 border border-aqua/20">
                  {getActionIcon(act.action)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-ivory-text dark:text-midnight-text font-medium truncate">
                    {formatText(act)}
                  </p>
                  <span className="text-[10px] text-ivory-muted dark:text-midnight-muted font-mono">
                    {formatRelativeTime(act.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
