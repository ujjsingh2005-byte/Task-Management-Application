import React from 'react';
import { formatRelativeTime } from '../../utils/dateUtils';
import { History, CheckCircle, Clock, Plus, Edit2, UserCheck, MessageSquare } from 'lucide-react';

export const ActivityTimeline = ({ activities = [] }) => {
  const getActionIcon = (action) => {
    switch (action) {
      case 'CREATED':
      case 'TASK_CREATED':
        return <Plus className="h-3.5 w-3.5 text-lime" />;
      case 'STATUS_CHANGED':
      case 'STATUS_UPDATED':
        return <CheckCircle className="h-3.5 w-3.5 text-violet" />;
      case 'ASSIGNED':
        return <UserCheck className="h-3.5 w-3.5 text-blueAccent" />;
      case 'COMMENTED':
      case 'COMMENT_ADDED':
        return <MessageSquare className="h-3.5 w-3.5 text-coral" />;
      default:
        return <Edit2 className="h-3.5 w-3.5 text-ivory-muted dark:text-midnight-muted" />;
    }
  };

  const formatActionText = (activity) => {
    const actor = activity.userId?.name || 'A user';
    switch (activity.action) {
      case 'CREATED':
      case 'TASK_CREATED':
        return `${actor} created this task`;
      case 'STATUS_CHANGED':
      case 'STATUS_UPDATED':
        return `${actor} changed status`;
      case 'ASSIGNED':
        return `${actor} reassigned this task`;
      case 'COMMENTED':
      case 'COMMENT_ADDED':
        return `${actor} left a comment`;
      case 'UPDATED':
      case 'TASK_UPDATED':
        return `${actor} modified task details`;
      default:
        return `${actor} updated the task`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-sm font-bold text-ivory-text dark:text-midnight-text pb-3 border-b border-ivory-subtle dark:border-midnight-subtle">
        <History className="h-4 w-4 text-violet" />
        <span>Activity History</span>
      </div>

      {activities.length === 0 ? (
        <p className="text-center py-8 text-xs text-ivory-muted dark:text-midnight-muted font-medium">
          No activity recorded yet
        </p>
      ) : (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-ivory-subtle dark:before:bg-midnight-subtle">
          {activities.map((act) => (
            <div key={act._id} className="relative flex items-start space-x-3 text-xs">
              <span className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle shadow-xs">
                {getActionIcon(act.action)}
              </span>

              <div className="flex-1">
                <p className="text-ivory-text dark:text-midnight-text font-medium">
                  {formatActionText(act)}
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
  );
};
