const User = require('../models/User');
const Task = require('../models/Task');
const Comment = require('../models/Comment');
const ActivityLog = require('../models/ActivityLog');
const ApiResponse = require('../utils/apiResponse');

const adminController = {
  /**
   * Global system statistics
   */
  async getSystemStats(req, res, next) {
    try {
      const [
        totalUsers,
        totalTasks,
        totalComments,
        totalActivities,
        tasksByStatus,
        tasksByPriority,
      ] = await Promise.all([
        User.countDocuments(),
        Task.countDocuments(),
        Comment.countDocuments(),
        ActivityLog.countDocuments(),
        Task.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        Task.aggregate([
          { $group: { _id: '$priority', count: { $sum: 1 } } },
        ]),
      ]);

      const statusMap = tasksByStatus.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {});

      const priorityMap = tasksByPriority.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {});

      return ApiResponse.success(res, 'System stats retrieved', {
        overview: {
          totalUsers,
          totalTasks,
          totalComments,
          totalActivities,
        },
        statusMap,
        priorityMap,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * User management list
   */
  async getUsers(req, res, next) {
    try {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return ApiResponse.success(res, 'Users fetched', { users });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Deactivate or remove user
   */
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      if (id === req.user._id.toString()) {
        return ApiResponse.badRequest(res, 'You cannot delete your own admin account');
      }

      const user = await User.findById(id);
      if (!user) {
        return ApiResponse.notFound(res, 'User not found');
      }

      await User.findByIdAndDelete(id);

      // Nullify assignee on their tasks
      await Task.updateMany({ assignedTo: id }, { assignedTo: null });

      return ApiResponse.success(res, `User ${user.name} removed successfully`);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update user role (promote/demote)
   */
  async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['USER', 'ADMIN'].includes(role)) {
        return ApiResponse.badRequest(res, 'Invalid role value');
      }

      const user = await User.findById(id);
      if (!user) return ApiResponse.notFound(res, 'User not found');

      user.role = role;
      await user.save();

      return ApiResponse.success(res, `Role updated to ${role} for ${user.name}`, {
        user: user.toSafeObject(),
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminController;
