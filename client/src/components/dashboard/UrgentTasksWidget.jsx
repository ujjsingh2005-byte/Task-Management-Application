import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PriorityBadge } from '../tasks/PriorityBadge';
import { StatusPill } from '../tasks/StatusPill';
import { formatDate } from '../../utils/dateUtils';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const UrgentTasksWidget = ({ tasks = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FFF4F1] dark:bg-midnight border border-coral/30 dark:border-coral/20 rounded-modal p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-coral/20 dark:border-midnight-border mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-coral/15 text-coral border border-coral/30">
              <AlertCircle className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-coral font-sans">
              Urgent Focus Tasks
            </h3>
          </div>
          <button
            onClick={() => navigate('/tasks?priority=URGENT')}
            className="text-xs font-semibold text-coral hover:underline flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <span>View all</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-10 h-10 mx-auto text-lime-deep dark:text-lime opacity-80 mb-2" />
            <p className="text-xs text-ivory-muted dark:text-midnight-muted font-medium">
              No urgent tasks pending. You're all caught up!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-coral/15 dark:divide-midnight-border">
            {tasks.map((task) => (
              <div
                key={task._id}
                onClick={() => navigate(`/tasks/${task._id}`)}
                className="py-3 hover:bg-white/60 dark:hover:bg-midnight-elevated/60 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="min-w-0 mr-3">
                  <h5 className="text-xs font-bold text-ivory-text dark:text-midnight-text group-hover:text-coral truncate transition-colors">
                    {task.title}
                  </h5>
                  <span className="text-[10px] text-coral font-medium block mt-0.5">
                    Due: {formatDate(task.dueDate)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <PriorityBadge priority={task.priority} />
                  <StatusPill status={task.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
