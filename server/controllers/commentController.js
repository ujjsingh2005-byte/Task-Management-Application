const Comment = require('../models/Comment');
const Task = require('../models/Task');
const { ACTIVITY_ACTIONS, NOTIFICATION_TYPES, ROLES } = require('../config/constants');
const activityService = require('../services/activityService');
const notificationService = require('../services/notificationService');
const taskSocketEmitter = require('../socket/taskSocketEmitter');
const ApiResponse = require('../utils/apiResponse');

const commentController = {
  /**
   * Add comment to task
   */
  async addComment(req, res, next) {
    try {
      const { text } = req.body;
      const { id: taskId } = req.params;

      const task = await Task.findById(taskId);
      if (!task) {
        return ApiResponse.notFound(res, 'Task not found');
      }

      const comment = await Comment.create({
        taskId,
        userId: req.user._id,
        text,
      });

      const populatedComment = await Comment.findById(comment._id).populate(
        'userId',
        'name email avatar'
      );

      // Log activity
      await activityService.logActivity({
        taskId,
        userId: req.user._id,
        action: ACTIVITY_ACTIONS.COMMENTED,
        metadata: { commentId: comment._id, preview: text.substring(0, 50) },
      });

      // Notify task creator and assignee if different from commenter
      const recipients = new Set();
      if (task.createdBy.toString() !== req.user._id.toString()) {
        recipients.add(task.createdBy.toString());
      }
      if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
        recipients.add(task.assignedTo.toString());
      }

      for (const recipientId of recipients) {
        await notificationService.createNotification({
          userId: recipientId,
          taskId,
          message: `${req.user.name} commented on "${task.title}": "${text.substring(0, 40)}..."`,
          type: NOTIFICATION_TYPES.COMMENT_ADDED,
        });
      }

      // Emit real-time comment event to task room
      taskSocketEmitter.emitCommentAdded(taskId, populatedComment);

      return ApiResponse.created(res, 'Comment added successfully', { comment: populatedComment });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get comments for a task
   */
  async getTaskComments(req, res, next) {
    try {
      const { id: taskId } = req.params;
      const comments = await Comment.find({ taskId })
        .populate('userId', 'name email avatar')
        .sort({ createdAt: 1 });

      return ApiResponse.success(res, 'Comments retrieved', { comments });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete a comment (Author or Admin only)
   */
  async deleteComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return ApiResponse.notFound(res, 'Comment not found');
      }

      const isAuthor = comment.userId.toString() === req.user._id.toString();
      const isAdmin = req.user.role === ROLES.ADMIN;

      if (!isAuthor && !isAdmin) {
        return ApiResponse.forbidden(res, 'You cannot delete comments written by others');
      }

      await Comment.findByIdAndDelete(commentId);
      return ApiResponse.success(res, 'Comment deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = commentController;
