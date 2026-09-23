const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');
const ApiResponse = require('../utils/apiResponse');

const dashboardController = {
  /**
   * Get personalized dashboard stats for the authenticated user
   */
  async getStats(req, res, next) {
    try {
      const userId = req.user._id;
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const [
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        cancelledTasks,
        assignedToMe,
        createdByMe,
        highPriorityTasks,
        overdueTasks,
        urgentTasks,
        recentActivities,
      ] = await Promise.all([
        Task.countDocuments(),
        Task.countDocuments({ status: 'TODO' }),
        Task.countDocuments({ status: 'IN_PROGRESS' }),
        Task.countDocuments({ status: 'COMPLETED' }),
        Task.countDocuments({ status: 'CANCELLED' }),
        Task.countDocuments({ assignedTo: userId }),
        Task.countDocuments({ createdBy: userId }),
        Task.countDocuments({ priority: { $in: ['HIGH', 'URGENT'] }, status: { $ne: 'COMPLETED' } }),
        Task.countDocuments({
          dueDate: { $lt: startOfToday },
          status: { $nin: ['COMPLETED', 'CANCELLED'] },
        }),
        Task.find({
          $or: [{ assignedTo: userId }, { createdBy: userId }],
          priority: { $in: ['HIGH', 'URGENT'] },
          status: { $nin: ['COMPLETED', 'CANCELLED'] },
        })
          .populate('assignedTo', 'name email avatar')
          .populate('createdBy', 'name email avatar')
          .sort({ dueDate: 1 })
          .limit(5),
        ActivityLog.find()
          .populate('userId', 'name email avatar')
          .populate('taskId', 'title status priority')
          .sort({ createdAt: -1 })
          .limit(8),
      ]);

      return ApiResponse.success(res, 'Dashboard stats retrieved', {
        stats: {
          totalTasks,
          pendingTasks,
          inProgressTasks,
          completedTasks,
          cancelledTasks,
          assignedToMe,
          createdByMe,
          highPriorityTasks,
          overdueTasks,
        },
        urgentTasks,
        recentActivities,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get workspace activity log feed with pagination and action filtering
   */
  async getActivities(req, res, next) {
    try {
      const { action, limit = 20, page = 1 } = req.query;
      const filter = {};
      if (action) {
        filter.action = action;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [activities, total] = await Promise.all([
        ActivityLog.find(filter)
          .populate('userId', 'name email avatar role')
          .populate('taskId', 'title status priority')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        ActivityLog.countDocuments(filter),
      ]);

      return ApiResponse.success(res, 'Activities retrieved successfully', {
        activities,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = dashboardController;
