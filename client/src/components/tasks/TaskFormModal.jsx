import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useTasks } from '../../context/TaskContext';
import { authService } from '../../services/authService';
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants';

export const TaskFormModal = ({ isOpen, onClose, initialData = null, defaultStatus = null }) => {
  const { createTask, updateTask } = useTasks();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: defaultStatus || TASK_STATUS.TODO,
    priority: TASK_PRIORITY.MEDIUM,
    assignedTo: '',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await authService.getAllUsers();
        if (res.success && res.data?.users) {
          setUsers(res.data.users);
        }
      } catch (err) {
        console.error('Failed to load users:', err);
      }
    };
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || TASK_STATUS.TODO,
        priority: initialData.priority || TASK_PRIORITY.MEDIUM,
        assignedTo: initialData.assignedTo?._id || initialData.assignedTo || '',
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: defaultStatus || TASK_STATUS.TODO,
        priority: TASK_PRIORITY.MEDIUM,
        assignedTo: '',
        dueDate: '',
      });
    }
    setErrors({});
  }, [initialData, defaultStatus, isOpen]);

  const validateForm = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo || null,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      };

      if (initialData?._id) {
        payload.version = initialData.version;
        await updateTask(initialData._id, payload);
      } else {
        await createTask(payload);
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Task Specifications' : 'Create a New Task'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title - Violet Focus */}
        <div>
          <label className="block text-xs font-bold text-ivory-text dark:text-midnight-text mb-1.5">
            Task Title <span className="text-coral">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Implement Optimistic Concurrency Control"
            className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-ivory-soft/60 dark:bg-midnight-slate/60 border rounded-xl text-ivory-text dark:text-midnight-text placeholder-ivory-muted dark:placeholder-midnight-muted focus:bg-ivory-paper dark:focus:bg-midnight-ink focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet transition-all ${
              errors.title
                ? 'border-roseAccent ring-1 ring-roseAccent/50'
                : 'border-ivory-subtle dark:border-midnight-subtle'
            }`}
          />
          {errors.title && <p className="text-xs text-roseAccent mt-1 font-medium">{errors.title}</p>}
        </div>

        {/* Description - Violet Focus */}
        <div>
          <label className="block text-xs font-bold text-ivory-text dark:text-midnight-text mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add relevant context, acceptance criteria or links..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-ivory-soft/60 dark:bg-midnight-slate/60 border border-ivory-subtle dark:border-midnight-subtle text-ivory-text dark:text-midnight-text placeholder-ivory-muted dark:placeholder-midnight-muted rounded-xl focus:bg-ivory-paper dark:focus:bg-midnight-ink focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet transition-all"
          />
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Priority - Amber Focus */}
          <div>
            <label className="block text-xs font-bold text-ivory-text dark:text-midnight-text mb-1.5 flex items-center justify-between">
              <span>Priority</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber">Urgency</span>
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-ivory-soft/60 dark:bg-midnight-slate/60 border border-ivory-subtle dark:border-midnight-subtle text-ivory-text dark:text-midnight-text rounded-xl focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber cursor-pointer transition-all"
            >
              <option value={TASK_PRIORITY.LOW} className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Low</option>
              <option value={TASK_PRIORITY.MEDIUM} className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Medium</option>
              <option value={TASK_PRIORITY.HIGH} className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">High</option>
              <option value={TASK_PRIORITY.URGENT} className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Urgent</option>
            </select>
          </div>

          {/* Status - Violet Focus */}
          <div>
            <label className="block text-xs font-bold text-ivory-text dark:text-midnight-text mb-1.5 flex items-center justify-between">
              <span>Workflow State</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-violet">Status</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-ivory-soft/60 dark:bg-midnight-slate/60 border border-ivory-subtle dark:border-midnight-subtle text-ivory-text dark:text-midnight-text rounded-xl focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet cursor-pointer transition-all"
            >
              <option value={TASK_STATUS.TODO} className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">To Do</option>
              <option value={TASK_STATUS.IN_PROGRESS} className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">In Progress</option>
              <option value={TASK_STATUS.COMPLETED} className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Completed</option>
              <option value={TASK_STATUS.CANCELLED} className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Assignee & Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Assignee - Electric Blue Focus */}
          <div>
            <label className="block text-xs font-bold text-ivory-text dark:text-midnight-text mb-1.5 flex items-center justify-between">
              <span>Assignee</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blueAccent">Member</span>
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-ivory-soft/60 dark:bg-midnight-slate/60 border border-ivory-subtle dark:border-midnight-subtle text-ivory-text dark:text-midnight-text rounded-xl focus:outline-none focus:ring-2 focus:ring-blueAccent/40 focus:border-blueAccent cursor-pointer transition-all"
            >
              <option value="" className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Unassigned</option>
              {users.map((u) => (
                <option key={u._id} value={u._id} className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>

          {/* Due Date - Coral Focus */}
          <div>
            <label className="block text-xs font-bold text-ivory-text dark:text-midnight-text mb-1.5 flex items-center justify-between">
              <span>Target Delivery</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-coral">Timeline</span>
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-ivory-soft/60 dark:bg-midnight-slate/60 border border-ivory-subtle dark:border-midnight-subtle text-ivory-text dark:text-midnight-text rounded-xl focus:bg-ivory-paper dark:focus:bg-midnight-ink focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral cursor-pointer transition-all"
            />
          </div>
        </div>

        {/* Form Actions (Coral CTA Primary, Ghost/Secondary Cancel) */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-ivory-subtle dark:border-midnight-subtle">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {initialData ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
