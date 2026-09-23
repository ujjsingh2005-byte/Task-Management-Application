const { SOCKET_EVENTS } = require('../config/constants');
const presenceManager = require('./presenceHandler');
const logger = require('../utils/logger');

/**
 * Socket.IO Master Event Router & Connection Handler
 */
const registerSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    const user = socket.user;
    const userId = user._id.toString();

    logger.info(`WebSocket connected: ${user.name} (${user.email}) [socket: ${socket.id}]`);

    // 1. Join personal user room for direct alerts/notifications
    socket.join(`user:${userId}`);

    // 2. Join global tasks feed room
    socket.join('tasks:global');

    // 3. Track Presence: If first socket connection for this user, broadcast user:online
    const isFirstConnection = presenceManager.userConnected(userId, socket.id);
    if (isFirstConnection) {
      io.emit(SOCKET_EVENTS.USER_ONLINE, { userId, name: user.name });
    }

    // 4. Send list of all currently online users to newly connected client
    socket.emit(SOCKET_EVENTS.PRESENCE_SYNC, {
      onlineUserIds: presenceManager.getOnlineUserIds(),
    });

    // 5. Client joins a specific task details room
    socket.on(SOCKET_EVENTS.JOIN_TASK, ({ taskId }) => {
      if (taskId) {
        socket.join(`task:${taskId}`);
        logger.debug(`User ${user.name} joined room: task:${taskId}`);
      }
    });

    // 6. Client leaves a task details room
    socket.on(SOCKET_EVENTS.LEAVE_TASK, ({ taskId }) => {
      if (taskId) {
        socket.leave(`task:${taskId}`);
        logger.debug(`User ${user.name} left room: task:${taskId}`);
      }
    });

    // 7. Typing indicator for task comments
    socket.on(SOCKET_EVENTS.TYPING_COMMENT, ({ taskId, isTyping }) => {
      if (taskId) {
        socket.to(`task:${taskId}`).emit('user:typing', {
          taskId,
          userId,
          userName: user.name,
          isTyping,
        });
      }
    });

    // 8. Disconnect handler
    socket.on('disconnect', () => {
      logger.info(`WebSocket disconnected: ${user.name} [socket: ${socket.id}]`);
      const isLastConnection = presenceManager.userDisconnected(userId, socket.id);
      if (isLastConnection) {
        io.emit(SOCKET_EVENTS.USER_OFFLINE, { userId });
      }
    });
  });
};

module.exports = registerSocketHandlers;
