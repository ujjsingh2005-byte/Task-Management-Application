const ActivityLog = require('../models/ActivityLog');
const logger = require('../utils/logger');

const activityService = {
  async logActivity({ taskId, userId, action, metadata = {} }) {
    try {
      const log = await ActivityLog.create({
        taskId,
        userId,
        action,
        metadata,
      });
      return log;
    } catch (error) {
      logger.error(`Failed to record activity log: ${error.message}`);
      return null;
    }
  },

  async getTaskActivity(taskId) {
    return await ActivityLog.find({ taskId })
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(50);
  },

  async getRecentActivities(limit = 10) {
    return await ActivityLog.find()
      .populate('userId', 'name email avatar')
      .populate('taskId', 'title status priority')
      .sort({ createdAt: -1 })
      .limit(limit);
  },
};

module.exports = activityService;
