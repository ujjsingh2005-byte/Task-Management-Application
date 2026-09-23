export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
};

export const STATUS_CONFIG = {
  TODO: {
    label: 'To Do',
    color: 'bg-blueAccent/10 text-blueAccent border-blueAccent/30',
    badge: 'bg-blueAccent/10 text-blueAccent dark:text-blueAccent-soft border border-blueAccent/30',
    dot: 'bg-blueAccent',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'bg-violet/10 text-violet dark:text-violet-bright border-violet/30',
    badge: 'bg-violet/10 text-violet dark:text-violet-bright border border-violet/30',
    dot: 'bg-violet',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-lime/10 text-lime-deep dark:text-lime border-lime/30',
    badge: 'bg-lime/10 text-lime-deep dark:text-lime border border-lime/30',
    dot: 'bg-lime',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-roseAccent/10 text-roseAccent border-roseAccent/30',
    badge: 'bg-roseAccent/10 text-roseAccent border border-roseAccent/30',
    dot: 'bg-roseAccent',
  },
};

export const PRIORITY_CONFIG = {
  LOW: {
    label: 'Low',
    badge: 'bg-midnight-graphite/15 text-midnight-muted dark:text-midnight-muted border border-ivory-border dark:border-midnight-border',
    dot: 'bg-midnight-graphite',
    border: 'border-l-blueAccent',
  },
  MEDIUM: {
    label: 'Medium',
    badge: 'bg-blueAccent/10 text-blueAccent border border-blueAccent/30',
    dot: 'bg-blueAccent',
    border: 'border-l-blueAccent',
  },
  HIGH: {
    label: 'High',
    badge: 'bg-amber/10 text-amber-deep dark:text-amber-bright border border-amber/30',
    dot: 'bg-amber',
    border: 'border-l-amber',
  },
  URGENT: {
    label: 'Urgent',
    badge: 'bg-coral/10 text-coral-deep dark:text-coral border border-coral/30 font-bold',
    dot: 'bg-coral',
    border: 'border-l-coral',
  },
};

export const SOCKET_EVENTS = {
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
  JOIN_TASK: 'join:task',
  LEAVE_TASK: 'leave:task',
  TYPING_COMMENT: 'typing:comment',
};
