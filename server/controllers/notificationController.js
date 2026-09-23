const notificationService = require('../services/notificationService');
const ApiResponse = require('../utils/apiResponse');

const notificationController = {
  /**
   * Get user notifications
   */
  async getNotifications(req, res, next) {
    try {
      const isRead = req.query.isRead !== undefined ? req.query.isRead === 'true' : null;
      const limit = parseInt(req.query.limit) || 30;

      const [notifications, unreadCount] = await Promise.all([
        notificationService.getUserNotifications(req.user._id, { limit, isRead }),
        notificationService.getUnreadCount(req.user._id),
      ]);

      return ApiResponse.success(res, 'Notifications fetched', {
        notifications,
        unreadCount,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Mark single notification as read
   */
  async markRead(req, res, next) {
    try {
      const notification = await notificationService.markAsRead(req.params.id, req.user._id);
      if (!notification) {
        return ApiResponse.notFound(res, 'Notification not found');
      }
      return ApiResponse.success(res, 'Notification marked as read', { notification });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllRead(req, res, next) {
    try {
      await notificationService.markAllAsRead(req.user._id);
      return ApiResponse.success(res, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = notificationController;
