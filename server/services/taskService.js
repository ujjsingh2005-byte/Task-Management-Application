const Task = require('../models/Task');
const Comment = require('../models/Comment');
const ActivityLog = require('../models/ActivityLog');
const { ACTIVITY_ACTIONS, NOTIFICATION_TYPES, ROLES } = require('../config/constants');
const activityService = require('./activityService');
const notificationService = require('./notificationService');
const taskSocketEmitter = require('../socket/taskSocketEmitter');

const taskService = {
  /**
   * Create a new task
   */
  async createTask(taskData, creatorUser) {
    const task = await Task.create({
      ...taskData,
      createdBy: creatorUser._id,
      version: 1,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('createdBy', 'name email avatar')
      .populate('assignedTo', 'name email avatar');

    // 1. Log Activity
    await activityService.logActivity({
      taskId: task._id,
      userId: creatorUser._id,
      action: ACTIVITY_ACTIONS.CREATED,
      metadata: { title: task.title, priority: task.priority },
    });

    // 2. Notify Assignee if assigned to someone else
    if (task.assignedTo && task.assignedTo.toString() !== creatorUser._id.toString()) {
      await notificationService.createNotification({
        userId: task.assignedTo,
        taskId: task._id,
        message: `${creatorUser.name} assigned you a new task: "${task.title}"`,
        type: NOTIFICATION_TYPES.TASK_ASSIGNED,
      });

      taskSocketEmitter.emitTaskAssigned(
        task.assignedTo,
        task._id,
        task.title,
        creatorUser.toSafeObject()
      );
    }

    // 3. Emit real-time task creation to global room
    taskSocketEmitter.emitTaskCreated(populatedTask);

    return populatedTask;
  },

  /**
   * Query tasks with search, filter, sorting, and pagination
   */
  async getTasks({
    search,
    status,
    priority,
    assignment,
    dueDateFilter,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
    userId,
    userRole,
  }) {
    const query = {};

    // Text search on title or description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // Status filter
    if (status && status !== 'ALL') {
      query.status = status;
    }

    // Priority filter
    if (priority && priority !== 'ALL') {
      query.priority = priority;
    }

    // Assignment filter
    if (assignment === 'MY_TASKS') {
      query.assignedTo = userId;
    } else if (assignment === 'ASSIGNED_BY_ME') {
      query.createdBy = userId;
    } else if (assignment === 'UNASSIGNED') {
      query.assignedTo = null;
    }

    // Due Date filters
    if (dueDateFilter) {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      const startOfTomorrow = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
      const endOfTomorrow = new Date(endOfToday.getTime() + 24 * 60 * 60 * 1000);
      const endOfWeek = new Date(startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);

      if (dueDateFilter === 'TODAY') {
        query.dueDate = { $gte: startOfToday, $lte: endOfToday };
      } else if (dueDateFilter === 'TOMORROW') {
        query.dueDate = { $gte: startOfTomorrow, $lte: endOfTomorrow };
      } else if (dueDateFilter === 'THIS_WEEK') {
        query.dueDate = { $gte: startOfToday, $lte: endOfWeek };
      } else if (dueDateFilter === 'OVERDUE') {
        query.dueDate = { $lt: startOfToday };
        query.status = { $nin: ['COMPLETED', 'CANCELLED'] };
      }
    }

    // Sorting
    const sort = {};
    const direction = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'dueDate') {
      sort.dueDate = direction;
    } else if (sortBy === 'priority') {
      sort.priority = direction;
    } else if (sortBy === 'updatedAt') {
      sort.updatedAt = direction;
    } else {
      sort.createdAt = direction;
    }

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const numericLimit = parseInt(limit);

    const [tasks, totalRecords] = await Promise.all([
      Task.find(query)
        .populate('createdBy', 'name email avatar')
        .populate('assignedTo', 'name email avatar')
        .populate('commentCount')
        .sort(sort)
        .skip(skip)
        .limit(numericLimit),
      Task.countDocuments(query),
    ]);

    return {
      tasks,
      pagination: {
        totalRecords,
        totalPages: Math.ceil(totalRecords / numericLimit) || 1,
        currentPage: parseInt(page),
        limit: numericLimit,
      },
    };
  },

  /**
   * Get single task with comments and activity timeline
   */
  async getTaskById(taskId) {
    const task = await Task.findById(taskId)
      .populate('createdBy', 'name email avatar')
      .populate('assignedTo', 'name email avatar');

    if (!task) return null;

    const [comments, activities] = await Promise.all([
      Comment.find({ taskId }).populate('userId', 'name email avatar').sort({ createdAt: 1 }),
      activityService.getTaskActivity(taskId),
    ]);

    return {
      task,
      comments,
      activities,
    };
  },

  /**
   * Update task with Optimistic Concurrency Control (OCC)
   */
  async updateTask(taskId, updateData, user) {
    const task = await Task.findById(taskId);
    if (!task) {
      return { status: 404, message: 'Task not found' };
    }

    // Check authorization: User must be creator, assignee, or admin
    const isCreator = task.createdBy.toString() === user._id.toString();
    const isAssignee = task.assignedTo && task.assignedTo.toString() === user._id.toString();
    const isAdmin = user.role === ROLES.ADMIN;

    if (!isCreator && !isAssignee && !isAdmin) {
      return { status: 403, message: 'Not authorized to edit this task' };
    }

    // OCC Version Check
    if (updateData.version !== undefined && updateData.version !== task.version) {
      const currentPopulated = await Task.findById(taskId)
        .populate('createdBy', 'name email avatar')
        .populate('assignedTo', 'name email avatar');

      return {
        status: 409,
        error: 'TASK_MODIFIED',
        message: 'This task was modified by another user.',
        currentTask: currentPopulated,
      };
    }

    // Snapshot changes for activity logging
    const changes = [];
    if (updateData.title && updateData.title !== task.title) {
      changes.push(`Title changed from "${task.title}" to "${updateData.title}"`);
      task.title = updateData.title;
    }
    if (updateData.description !== undefined && updateData.description !== task.description) {
      changes.push('Description updated');
      task.description = updateData.description;
    }
    if (updateData.status && updateData.status !== task.status) {
      changes.push(`Status changed from ${task.status} to ${updateData.status}`);
      task.status = updateData.status;
    }
    if (updateData.priority && updateData.priority !== task.priority) {
      changes.push(`Priority changed from ${task.priority} to ${updateData.priority}`);
      task.priority = updateData.priority;
    }
    if (updateData.dueDate !== undefined) {
      task.dueDate = updateData.dueDate;
      changes.push('Due date updated');
    }

    const previousAssignee = task.assignedTo ? task.assignedTo.toString() : null;
    if (updateData.assignedTo !== undefined) {
      task.assignedTo = updateData.assignedTo || null;
      if (task.assignedTo?.toString() !== previousAssignee) {
        changes.push('Assignee updated');
      }
    }

    // Increment OCC version atomically
    task.version += 1;
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('createdBy', 'name email avatar')
      .populate('assignedTo', 'name email avatar');

    // 1. Log Activity
    await activityService.logActivity({
      taskId: task._id,
      userId: user._id,
      action: ACTIVITY_ACTIONS.UPDATED,
      metadata: { changes, version: task.version },
    });

    // 2. Notify new assignee if changed
    if (
      task.assignedTo &&
      task.assignedTo.toString() !== previousAssignee &&
      task.assignedTo.toString() !== user._id.toString()
    ) {
      await notificationService.createNotification({
        userId: task.assignedTo,
        taskId: task._id,
        message: `${user.name} assigned you task "${task.title}"`,
        type: NOTIFICATION_TYPES.TASK_ASSIGNED,
      });

      taskSocketEmitter.emitTaskAssigned(
        task.assignedTo,
        task._id,
        task.title,
        user.toSafeObject()
      );
    }

    // 3. Emit real-time updates
    taskSocketEmitter.emitTaskUpdated(populatedTask);

    return { status: 200, task: populatedTask };
  },

  /**
   * Fast Status Update with OCC
   */
  async updateStatus(taskId, status, clientVersion, user) {
    const task = await Task.findById(taskId);
    if (!task) return { status: 404, message: 'Task not found' };

    if (clientVersion !== undefined && clientVersion !== task.version) {
      const currentPopulated = await Task.findById(taskId)
        .populate('createdBy', 'name email avatar')
        .populate('assignedTo', 'name email avatar');

      return {
        status: 409,
        error: 'TASK_MODIFIED',
        message: 'This task was modified by another user.',
        currentTask: currentPopulated,
      };
    }

    const previousStatus = task.status;
    task.status = status;
    task.version += 1;
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('createdBy', 'name email avatar')
      .populate('assignedTo', 'name email avatar');

    // Activity Log
    await activityService.logActivity({
      taskId: task._id,
      userId: user._id,
      action: ACTIVITY_ACTIONS.STATUS_CHANGED,
      metadata: { from: previousStatus, to: status, version: task.version },
    });

    // Notify task creator or assignee if updated by someone else
    const notifyRecipients = new Set();
    if (task.createdBy.toString() !== user._id.toString()) {
      notifyRecipients.add(task.createdBy.toString());
    }
    if (task.assignedTo && task.assignedTo.toString() !== user._id.toString()) {
      notifyRecipients.add(task.assignedTo.toString());
    }

    for (const recipientId of notifyRecipients) {
      await notificationService.createNotification({
        userId: recipientId,
        taskId: task._id,
        message: `${user.name} updated task status to ${status}: "${task.title}"`,
        type: status === 'COMPLETED' ? NOTIFICATION_TYPES.TASK_COMPLETED : NOTIFICATION_TYPES.STATUS_CHANGED,
      });
    }

    // Emit Socket.IO Events
    taskSocketEmitter.emitStatusChanged(taskId, status, task.version, user.toSafeObject());
    taskSocketEmitter.emitTaskUpdated(populatedTask);

    return { status: 200, task: populatedTask };
  },

  /**
   * Delete Task
   */
  async deleteTask(taskId, user) {
    const task = await Task.findById(taskId);
    if (!task) return { status: 404, message: 'Task not found' };

    const creatorId = task.createdBy ? task.createdBy.toString() : '';
    const userId = user._id ? user._id.toString() : '';
    const isCreator = Boolean(creatorId && userId && creatorId === userId);
    const isAdmin = Boolean(user.role === ROLES.ADMIN || user.role === 'ADMIN' || user.role === 'admin');

    if (!isCreator && !isAdmin) {
      return { status: 403, message: 'You are not authorized to delete this task' };
    }

    await Promise.all([
      Task.findByIdAndDelete(taskId),
      Comment.deleteMany({ taskId }),
      ActivityLog.deleteMany({ taskId }),
    ]);

    // Emit Real-time deletion
    taskSocketEmitter.emitTaskDeleted(taskId);

    return { status: 200, message: 'Task deleted successfully' };
  },
};

module.exports = taskService;
