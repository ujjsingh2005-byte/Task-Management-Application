import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { StatusPill } from '../components/tasks/StatusPill';
import { PriorityBadge } from '../components/tasks/PriorityBadge';
import { CommentList } from '../components/comments/CommentList';
import { ActivityTimeline } from '../components/activity/ActivityTimeline';
import { PresenceIndicator } from '../components/common/PresenceIndicator';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { Button } from '../components/common/Button';
import { formatDate, isOverdue } from '../utils/dateUtils';
import { SOCKET_EVENTS } from '../utils/constants';
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Trash2,
  Edit3,
  Layers,
  CheckCircle2,
  Eye,
  Sparkles,
} from 'lucide-react';

export const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { updateTaskStatus, deleteTask } = useTasks();
  const { socket, joinTaskRoom, leaveTaskRoom } = useSocket();

  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await taskService.getTaskById(id);
      if (res.success && res.data) {
        setTaskData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  // Join Task Room on Mount
  useEffect(() => {
    loadTask();
    joinTaskRoom(id);

    return () => {
      leaveTaskRoom(id);
    };
  }, [id]);

  // Real-Time Socket Event Listeners for this Task
  useEffect(() => {
    if (!socket) return;

    const handleTaskUpdated = ({ task }) => {
      if (task._id === id) {
        setTaskData((prev) => (prev ? { ...prev, task } : prev));
      }
    };

    const handleCommentAdded = ({ taskId, comment }) => {
      if (taskId === id) {
        setTaskData((prev) => {
          if (!prev) return prev;
          if (prev.comments?.some((c) => c._id === comment._id)) return prev;
          return { ...prev, comments: [...(prev.comments || []), comment] };
        });
      }
    };

    const handleStatusChanged = ({ taskId, status, version }) => {
      if (taskId === id) {
        setTaskData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            task: { ...prev.task, status, version },
          };
        });
      }
    };

    const handleTaskDeleted = ({ taskId }) => {
      if (taskId === id) {
        alert('This task has been deleted by an administrator or the creator.');
        navigate('/tasks');
      }
    };

    socket.on(SOCKET_EVENTS.TASK_UPDATED, handleTaskUpdated);
    socket.on(SOCKET_EVENTS.COMMENT_ADDED, handleCommentAdded);
    socket.on(SOCKET_EVENTS.TASK_STATUS_CHANGED, handleStatusChanged);
    socket.on(SOCKET_EVENTS.TASK_DELETED, handleTaskDeleted);

    return () => {
      socket.off(SOCKET_EVENTS.TASK_UPDATED, handleTaskUpdated);
      socket.off(SOCKET_EVENTS.COMMENT_ADDED, handleCommentAdded);
      socket.off(SOCKET_EVENTS.TASK_STATUS_CHANGED, handleStatusChanged);
      socket.off(SOCKET_EVENTS.TASK_DELETED, handleTaskDeleted);
    };
  }, [socket, id, navigate]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-mint mx-auto" />
        <p className="text-xs text-pearl-dim dark:text-navy-muted mt-3 font-medium">
          Loading task specifications & real-time room...
        </p>
      </div>
    );
  }

  if (error || !taskData?.task) {
    return (
      <div className="bg-pearl-surface dark:bg-navy-surface rounded-3xl p-12 border border-pearl-border dark:border-navy-border text-center max-w-md mx-auto my-12 shadow-sm">
        <h3 className="text-lg font-bold text-pearl-text dark:text-navy-text">Task Not Found</h3>
        <p className="text-xs text-pearl-dim dark:text-navy-muted mt-1 mb-6">
          {error || 'The requested task does not exist or has been removed.'}
        </p>
        <Link to="/tasks">
          <Button variant="primary" icon={ArrowLeft}>
            Back to Workspace
          </Button>
        </Link>
      </div>
    );
  }

  const { task, comments = [], activities = [] } = taskData;
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
  const taskOverdue = isOverdue(task.dueDate, task.status);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTaskStatus(task._id, newStatus, task.version);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete "${task.title}"?`)) {
      await deleteTask(task._id);
      navigate('/tasks');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Top navigation back button & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/tasks')}
          className="inline-flex items-center text-xs font-bold text-ivory-muted dark:text-midnight-muted hover:text-ivory-text dark:hover:text-midnight-text transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5 text-violet" />
          <span>Back to Tasks</span>
        </button>

        <div className="flex items-center space-x-2">
          {canEdit && (
            <Button
              variant="secondary"
              size="sm"
              icon={Edit3}
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Details
            </Button>
          )}
          {canDelete && (
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Main Task Card */}
      <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl p-6 sm:p-8 border border-ivory-subtle dark:border-midnight-subtle shadow-sm space-y-6">
        {/* Badges & OCC Version */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-ivory-subtle dark:border-midnight-subtle">
          <div className="flex items-center space-x-2.5">
            <PriorityBadge priority={task.priority} />
            <StatusPill
              status={task.status}
              isInteractive={true}
              onChange={handleStatusChange}
            />
          </div>

          <div className="flex items-center space-x-3 text-xs text-ivory-muted dark:text-midnight-muted font-mono">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-aqua animate-pulse-live" />
              <span className="text-aqua font-bold">LIVE ROOM</span>
            </span>
            <span>•</span>
            <span className="px-2.5 py-0.5 rounded-full bg-violet/10 text-violet border border-violet/30 font-bold text-[11px]">
              OCC v{task.version}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory-text dark:text-midnight-text tracking-tight leading-tight">
            {task.title}
          </h1>
          <div className="mt-4 p-5 rounded-xl bg-ivory-soft/60 dark:bg-midnight-slate/40 border border-ivory-subtle dark:border-midnight-subtle text-xs sm:text-sm text-ivory-text dark:text-midnight-text leading-relaxed whitespace-pre-wrap">
            {task.description || 'No detailed description provided for this task.'}
          </div>
        </div>

        {/* Task Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-ivory-subtle dark:border-midnight-subtle text-xs">
          {/* Assignee */}
          <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-ivory-soft/60 dark:bg-midnight-slate/50 border border-ivory-subtle dark:border-midnight-subtle">
            <div className="relative">
              <div className="h-9 w-9 rounded-xl bg-midnight-ink dark:bg-midnight-slate text-aqua border border-aqua/30 flex items-center justify-center font-bold text-xs overflow-hidden">
                {task.assignedTo?.avatar ? (
                  <img
                    src={task.assignedTo.avatar}
                    alt={task.assignedTo.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  task.assignedTo?.name?.charAt(0) || '?'
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5">
                <PresenceIndicator userId={task.assignedTo?._id} size="sm" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blueAccent">
                Assignee
              </p>
              <p className="font-bold text-ivory-text dark:text-midnight-text">
                {task.assignedTo?.name || 'Unassigned'}
              </p>
            </div>
          </div>

          {/* Created By */}
          <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-ivory-soft/60 dark:bg-midnight-slate/50 border border-ivory-subtle dark:border-midnight-subtle">
            <div className="h-9 w-9 rounded-xl bg-violet/10 text-violet flex items-center justify-center font-bold text-xs overflow-hidden border border-violet/20">
              {task.createdBy?.avatar ? (
                <img
                  src={task.createdBy.avatar}
                  alt={task.createdBy.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                task.createdBy?.name?.charAt(0) || 'C'
              )}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-violet">
                Author
              </p>
              <p className="font-bold text-ivory-text dark:text-midnight-text">
                {task.createdBy?.name || 'Unknown'}
              </p>
            </div>
          </div>

          {/* Due Date */}
          <div
            className={`flex items-center space-x-3 p-3.5 rounded-xl border ${
              taskOverdue
                ? 'bg-coral/10 border-coral/30 text-coral'
                : 'bg-ivory-soft/60 dark:bg-midnight-slate/50 border-ivory-subtle dark:border-midnight-subtle text-ivory-text dark:text-midnight-text'
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                taskOverdue
                  ? 'bg-coral/20 text-coral'
                  : 'bg-ivory-soft dark:bg-midnight-slate text-ivory-muted dark:text-midnight-muted'
              }`}
            >
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-coral">
                Target Deadline
              </p>
              <p className="font-bold">{formatDate(task.dueDate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two column layout: Comments & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comments Section */}
        <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl p-6 border border-ivory-subtle dark:border-midnight-subtle shadow-sm">
          <CommentList
            taskId={task._id}
            comments={comments}
            onCommentAdded={(newComment) => {
              setTaskData((prev) => ({
                ...prev,
                comments: [...prev.comments, newComment],
              }));
            }}
            onCommentDeleted={(commentId) => {
              setTaskData((prev) => ({
                ...prev,
                comments: prev.comments.filter((c) => c._id !== commentId),
              }));
            }}
          />
        </div>

        {/* Activity Timeline Section */}
        <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl p-6 border border-ivory-subtle dark:border-midnight-subtle shadow-sm">
          <ActivityTimeline activities={activities} />
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <TaskFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={task}
        />
      )}
    </div>
  );
};
