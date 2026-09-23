import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PriorityBadge } from './PriorityBadge';
import { StatusPill } from './StatusPill';
import { PresenceIndicator } from '../common/PresenceIndicator';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, User, Trash2, Edit3, Clock } from 'lucide-react';

export const TaskCard = ({ task, onEdit, onDelete, isKanbanCompact = false }) => {
  const navigate = useNavigate();
  const { updateTaskStatus, deleteTask } = useTasks();
  const { user, isAdmin } = useAuth();

  const isTaskOverdue = isOverdue(task.dueDate, task.status);

  const currentUserId = user?._id ? String(user._id) : '';
  const creatorId = task.createdBy?._id
    ? String(task.createdBy._id)
    : task.createdBy
    ? String(task.createdBy)
    : '';
  const assigneeId = task.assignedTo?._id
    ? String(task.assignedTo._id)
    : task.assignedTo
    ? String(task.assignedTo)
    : '';

  const isCreator = Boolean(currentUserId && creatorId && currentUserId === creatorId);
  const isAssignee = Boolean(currentUserId && assigneeId && currentUserId === assigneeId);
  const isUserAdmin = Boolean(isAdmin || user?.role === 'ADMIN' || user?.role === 'admin');

  const canDelete = Boolean(isCreator || isUserAdmin);
  const canEdit = Boolean(isCreator || isAssignee || isUserAdmin);

  const getPriorityLeftBorder = (priority) => {
    switch (priority) {
      case 'URGENT':
        return 'border-l-4 border-l-coral';
      case 'HIGH':
        return 'border-l-4 border-l-amber';
      case 'MEDIUM':
        return 'border-l-4 border-l-blueAccent';
      case 'LOW':
      default:
        return 'border-l-4 border-l-midnight-graphite/40 dark:border-l-midnight-muted/40';
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTaskStatus(task._id, newStatus, task.version);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        if (onDelete) {
          await onDelete(task);
        } else {
          await deleteTask(task._id);
        }
      } catch (err) {
        console.error('Delete task failed:', err);
      }
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) onEdit(task);
  };

  return (
    <div
      onClick={() => navigate(`/tasks/${task._id}`)}
      className={`group relative bg-ivory-paper dark:bg-midnight border border-ivory-border dark:border-midnight-border ${getPriorityLeftBorder(
        task.priority
      )} hover:border-violet/40 rounded-2xl shadow-soft-light dark:shadow-soft-dark hover:-translate-y-0.5 hover:shadow-elevated-light dark:hover:shadow-elevated-dark transition-all duration-200 flex flex-col justify-between cursor-pointer ${
        isKanbanCompact ? 'p-3.5' : 'p-5'
      }`}
    >
      {/* Top Header: Priority, Overdue indicator & Actions */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-1.5">
            <PriorityBadge priority={task.priority} />
            {isTaskOverdue && (
              <span className="text-[10px] font-bold text-coral bg-coral/10 border border-coral/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                Overdue
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            {canEdit && (
              <button
                onClick={handleEditClick}
                className="p-1 text-ivory-muted dark:text-midnight-muted hover:text-violet hover:bg-ivory-stone dark:hover:bg-midnight-elevated rounded-lg transition-colors cursor-pointer"
                title="Edit Task"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="p-1 text-ivory-muted dark:text-midnight-muted hover:text-roseAccent hover:bg-roseAccent/10 rounded-lg transition-colors cursor-pointer"
                title="Delete Task"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Task Title & Description */}
        <h4
          className={`font-bold text-ivory-text dark:text-midnight-text group-hover:text-violet transition-colors line-clamp-2 ${
            isKanbanCompact ? 'text-xs mb-1' : 'text-sm mb-1.5'
          }`}
        >
          {task.title}
        </h4>
        <p
          className={`text-ivory-muted dark:text-midnight-muted line-clamp-2 leading-relaxed ${
            isKanbanCompact ? 'text-[11px] mb-3' : 'text-xs mb-4'
          }`}
        >
          {task.description || 'No description provided.'}
        </p>
      </div>

      {/* Footer Details: Date, Comments & Status */}
      <div className="pt-2.5 border-t border-ivory-border/60 dark:border-midnight-border/80 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-ivory-muted dark:text-midnight-muted">
          <div
            className={`flex items-center space-x-1 text-[11px] ${
              isTaskOverdue ? 'text-coral font-semibold' : ''
            }`}
          >
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>{formatDate(task.dueDate)}</span>
          </div>

          <div className="flex items-center space-x-1 text-[11px] text-violet">
            <MessageSquare className="h-3.5 w-3.5 shrink-0" />
            <span className="font-semibold">{task.commentCount || 0}</span>
          </div>
        </div>

        {/* Assignee and Status Selector */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center space-x-2">
            {task.assignedTo ? (
              <div className="flex items-center space-x-1.5">
                <div className="relative">
                  <div className="h-6 w-6 rounded-full bg-violet/20 text-violet border border-violet/30 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                    {task.assignedTo.avatar ? (
                      <img
                        src={task.assignedTo.avatar}
                        alt={task.assignedTo.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      task.assignedTo.name?.charAt(0)
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5">
                    <PresenceIndicator userId={task.assignedTo._id} size="sm" />
                  </div>
                </div>
                <span className="text-[11px] font-medium text-ivory-text dark:text-midnight-text truncate max-w-[80px]">
                  {task.assignedTo.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-[11px] text-ivory-muted dark:text-midnight-muted">
                <User className="h-3.5 w-3.5" />
                <span>Unassigned</span>
              </div>
            )}
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <StatusPill
              status={task.status}
              isInteractive={true}
              onChange={handleStatusChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
