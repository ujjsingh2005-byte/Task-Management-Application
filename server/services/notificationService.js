const Notification = require('../models/Notification');
const taskSocketEmitter = require('../socket/taskSocketEmitter');
const logger = require('../utils/logger');

const notificationService = {
  async createNotification({ userId, taskId, message, type }) {
    try {
      const notification = await Notification.create({
        userId,
        taskId,
        message,
        type,
      });

      // Populate task information for real-time delivery
      const populated = await Notification.findById(notification._id).populate(
        'taskId',
        'title status priority'
      );

      // Emit real-time notification to the target user
      taskSocketEmitter.emitNotification(userId, populated);

      return populated;
    } catch (error) {
      logger.error(`Failed to create notification: ${error.message}`);
      return null;
    }
  },

  async getUserNotifications(userId, { limit = 20, isRead = null } = {}) {
    const query = { userId };
    if (isRead !== null) {
      query.isRead = isRead;
    }

    return await Notification.find(query)
      .populate('taskId', 'title status priority')
      .sort({ createdAt: -1 })
      .limit(limit);
  },

  async getUnreadCount(userId) {
    return await Notification.countDocuments({ userId, isRead: false });
  },

  async markAsRead(notificationId, userId) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );
  },

  async markAllAsRead(userId) {
    return await Notification.updateMany({ userId, isRead: false }, { isRead: true });
  },
};

module.exports = notificationService;
