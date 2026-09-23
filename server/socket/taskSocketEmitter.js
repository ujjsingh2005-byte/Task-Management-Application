const { getIO } = require('../config/socket');
const { SOCKET_EVENTS } = require('../config/constants');
const logger = require('../utils/logger');

/**
 * Helper utility to emit WebSocket events from services/controllers
 */
const taskSocketEmitter = {
  // Global + Task room task creation
  emitTaskCreated(task) {
    try {
      const io = getIO();
      io.to('tasks:global').emit(SOCKET_EVENTS.TASK_CREATED, { task });
    } catch (e) {
      logger.debug(`Socket emit error on TaskCreated: ${e.message}`);
    }
  },

  // Task updated
  emitTaskUpdated(task) {
    try {
      const io = getIO();
      const taskId = task._id.toString();
      io.to('tasks:global').to(`task:${taskId}`).emit(SOCKET_EVENTS.TASK_UPDATED, { task });
    } catch (e) {
      logger.debug(`Socket emit error on TaskUpdated: ${e.message}`);
    }
  },

  // Task deleted
  emitTaskDeleted(taskId) {
    try {
      const io = getIO();
      const idStr = taskId.toString();
      io.to('tasks:global').to(`task:${idStr}`).emit(SOCKET_EVENTS.TASK_DELETED, { taskId: idStr });
    } catch (e) {
      logger.debug(`Socket emit error on TaskDeleted: ${e.message}`);
    }
  },

  // Task status changed
  emitStatusChanged(taskId, status, version, updatedBy) {
    try {
      const io = getIO();
      const idStr = taskId.toString();
      io.to('tasks:global')
        .to(`task:${idStr}`)
        .emit(SOCKET_EVENTS.TASK_STATUS_CHANGED, {
          taskId: idStr,
          status,
          version,
          updatedBy,
        });
    } catch (e) {
      logger.debug(`Socket emit error on StatusChanged: ${e.message}`);
    }
  },

  // Task assigned to specific user
  emitTaskAssigned(assignedToUserId, taskId, taskTitle, assignedBy) {
    try {
      const io = getIO();
      const userRoom = `user:${assignedToUserId.toString()}`;
      io.to(userRoom).emit(SOCKET_EVENTS.TASK_ASSIGNED, {
        taskId: taskId.toString(),
        taskTitle,
        assignedBy,
      });
    } catch (e) {
      logger.debug(`Socket emit error on TaskAssigned: ${e.message}`);
    }
  },

  // Comment added to a task room
  emitCommentAdded(taskId, comment) {
    try {
      const io = getIO();
      const idStr = taskId.toString();
      io.to(`task:${idStr}`).emit(SOCKET_EVENTS.COMMENT_ADDED, { taskId: idStr, comment });
    } catch (e) {
      logger.debug(`Socket emit error on CommentAdded: ${e.message}`);
    }
  },

  // Notification sent to target user
  emitNotification(userId, notification) {
    try {
      const io = getIO();
      const userRoom = `user:${userId.toString()}`;
      io.to(userRoom).emit(SOCKET_EVENTS.NOTIFICATION_NEW, { notification });
    } catch (e) {
      logger.debug(`Socket emit error on Notification: ${e.message}`);
    }
  },
};

module.exports = taskSocketEmitter;
