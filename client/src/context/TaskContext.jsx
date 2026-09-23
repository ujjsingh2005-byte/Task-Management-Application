import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { SOCKET_EVENTS } from '../utils/constants';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { socket } = useSocket();
  const { isAuthenticated } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 12,
  });

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
    priority: 'ALL',
    assignment: 'ALL',
    dueDateFilter: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 12,
  });

  // OCC Conflict State (for modal popups)
  const [occConflict, setOccConflict] = useState(null);

  // Toast / Live Alert Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', action = null) => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type, action }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch Tasks with active filters
  const fetchTasks = useCallback(async (customFilters = {}) => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const activeFilters = { ...filters, ...customFilters };
      const res = await taskService.getTasks(activeFilters);
      if (res.success && res.data) {
        setTasks(res.data.tasks || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters, isAuthenticated]);

  // Real-Time Socket Event Listeners
  useEffect(() => {
    if (!socket) return;

    // 1. Task Created
    const handleTaskCreated = ({ task }) => {
      setTasks((prev) => {
        // Avoid duplicate if already inserted optimistically
        if (prev.some((t) => t._id === task._id)) return prev;
        return [task, ...prev];
      });
      addToast(`New task created: "${task.title}"`, 'info');
    };

    // 2. Task Updated
    const handleTaskUpdated = ({ task }) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, ...task } : t))
      );
    };

    // 3. Task Status Changed
    const handleStatusChanged = ({ taskId, status, version, updatedBy }) => {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId ? { ...t, status, version } : t
        )
      );
      addToast(`Task status changed to ${status} by ${updatedBy?.name || 'teammate'}`, 'info');
    };

    // 4. Task Deleted
    const handleTaskDeleted = ({ taskId }) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      addToast('A task was deleted', 'info');
    };

    // 5. Task Assigned
    const handleTaskAssigned = ({ taskId, taskTitle, assignedBy }) => {
      addToast(`🔔 ${assignedBy?.name || 'Someone'} assigned you "${taskTitle}"`, 'success');
      fetchTasks();
    };

    // 6. Direct Notification
    const handleNotificationNew = ({ notification }) => {
      addToast(`🔔 ${notification.message}`, 'info');
    };

    socket.on(SOCKET_EVENTS.TASK_CREATED, handleTaskCreated);
    socket.on(SOCKET_EVENTS.TASK_UPDATED, handleTaskUpdated);
    socket.on(SOCKET_EVENTS.TASK_STATUS_CHANGED, handleStatusChanged);
    socket.on(SOCKET_EVENTS.TASK_DELETED, handleTaskDeleted);
    socket.on(SOCKET_EVENTS.TASK_ASSIGNED, handleTaskAssigned);
    socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, handleNotificationNew);

    return () => {
      socket.off(SOCKET_EVENTS.TASK_CREATED, handleTaskCreated);
      socket.off(SOCKET_EVENTS.TASK_UPDATED, handleTaskUpdated);
      socket.off(SOCKET_EVENTS.TASK_STATUS_CHANGED, handleStatusChanged);
      socket.off(SOCKET_EVENTS.TASK_DELETED, handleTaskDeleted);
      socket.off(SOCKET_EVENTS.TASK_ASSIGNED, handleTaskAssigned);
      socket.off(SOCKET_EVENTS.NOTIFICATION_NEW, handleNotificationNew);
    };
  }, [socket, addToast, fetchTasks]);

  // Create Task
  const createTask = async (taskData) => {
    try {
      const res = await taskService.createTask(taskData);
      if (res.success && res.data?.task) {
        addToast('Task created successfully', 'success');
        return res.data.task;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create task';
      addToast(msg, 'error');
      throw err;
    }
  };

  // Update Task (with OCC conflict handling)
  const updateTask = async (id, updateData) => {
    try {
      const res = await taskService.updateTask(id, updateData);
      if (res.success && res.data?.task) {
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? res.data.task : t))
        );
        addToast('Task updated successfully', 'success');
        return res.data.task;
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setOccConflict({
          taskId: id,
          message: err.response.data.message,
          currentTask: err.response.data.error?.currentTask,
        });
      } else {
        const msg = err.response?.data?.message || 'Failed to update task';
        addToast(msg, 'error');
      }
      throw err;
    }
  };

  // Update Task Status
  const updateTaskStatus = async (id, status, version) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status } : t))
    );

    try {
      const res = await taskService.updateStatus(id, status, version);
      if (res.success && res.data?.task) {
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? res.data.task : t))
        );
        return res.data.task;
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setOccConflict({
          taskId: id,
          message: err.response.data.message,
          currentTask: err.response.data.error?.currentTask,
        });
      }
      // Revert on failure
      fetchTasks();
      throw err;
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      const res = await taskService.deleteTask(id);
      if (res.success) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
        addToast('Task deleted successfully', 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete task';
      addToast(msg, 'error');
      throw err;
    }
  };

  const clearOccConflict = () => setOccConflict(null);

  const value = {
    tasks,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    occConflict,
    clearOccConflict,
    toasts,
    addToast,
    removeToast,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
