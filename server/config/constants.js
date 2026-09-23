/**
 * Application Constants and Enums
 */
const ROLES = Object.freeze({
  USER: 'USER',
  ADMIN: 'ADMIN',
});

const TASK_STATUS = Object.freeze({
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
});

const TASK_PRIORITY = Object.freeze({
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
});

const NOTIFICATION_TYPES = Object.freeze({
  TASK_ASSIGNED: 'TASK_ASSIGNED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  PRIORITY_CHANGED: 'PRIORITY_CHANGED',
  COMMENT_ADDED: 'COMMENT_ADDED',
  TASK_COMPLETED: 'TASK_COMPLETED',
  TASK_DELETED: 'TASK_DELETED',
});

const ACTIVITY_ACTIONS = Object.freeze({
  CREATED: 'CREATED',
  UPDATED: 'UPDATED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  PRIORITY_CHANGED: 'PRIORITY_CHANGED',
  ASSIGNED: 'ASSIGNED',
  COMMENTED: 'COMMENTED',
  DELETED: 'DELETED',
});

const SOCKET_EVENTS = Object.freeze({
  // Server-to-Client
  TASK_CREATED: 'task:created',
  TASK_UPDATED: 'task:updated',
  TASK_DELETED: 'task:deleted',
  TASK_STATUS_CHANGED: 'task:statusChanged',
  TASK_ASSIGNED: 'task:assigned',
  COMMENT_ADDED: 'comment:added',
  NOTIFICATION_NEW: 'notification:new',
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  PRESENCE_SYNC: 'presence:sync',

  // Client-to-Server
  JOIN_TASK: 'join:task',
  LEAVE_TASK: 'leave:task',
  TYPING_COMMENT: 'typing:comment',
});

module.exports = {
  ROLES,
  TASK_STATUS,
  TASK_PRIORITY,
  NOTIFICATION_TYPES,
  ACTIVITY_ACTIONS,
  SOCKET_EVENTS,
};
