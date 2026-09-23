const taskService = require('../services/taskService');
const ApiResponse = require('../utils/apiResponse');

const taskController = {
  /**
   * Create task
   */
  async create(req, res, next) {
    try {
      const task = await taskService.createTask(req.body, req.user);
      return ApiResponse.created(res, 'Task created successfully', { task });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all tasks (with filters, search, pagination, sorting)
   */
  async getAll(req, res, next) {
    try {
      const { search, status, priority, assignment, dueDateFilter, sortBy, sortOrder, page, limit } =
        req.query;

      const result = await taskService.getTasks({
        search,
        status,
        priority,
        assignment,
        dueDateFilter,
        sortBy,
        sortOrder,
        page,
        limit,
        userId: req.user._id,
        userRole: req.user.role,
      });

      return ApiResponse.success(res, 'Tasks retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get single task details with comments & activity logs
   */
  async getById(req, res, next) {
    try {
      const result = await taskService.getTaskById(req.params.id);
      if (!result) {
        return ApiResponse.notFound(res, 'Task not found');
      }
      return ApiResponse.success(res, 'Task details retrieved', result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update full task details (with OCC check)
   */
  async update(req, res, next) {
    try {
      const result = await taskService.updateTask(req.params.id, req.body, req.user);

      if (result.status === 404) {
        return ApiResponse.notFound(res, result.message);
      }
      if (result.status === 403) {
        return ApiResponse.forbidden(res, result.message);
      }
      if (result.status === 409) {
        return ApiResponse.conflict(res, result.message, result.error, {
          currentTask: result.currentTask,
        });
      }

      return ApiResponse.success(res, 'Task updated successfully', { task: result.task });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update status endpoint (with OCC)
   */
  async updateStatus(req, res, next) {
    try {
      const { status, version } = req.body;
      const result = await taskService.updateStatus(req.params.id, status, version, req.user);

      if (result.status === 404) return ApiResponse.notFound(res, result.message);
      if (result.status === 409) {
        return ApiResponse.conflict(res, result.message, result.error, {
          currentTask: result.currentTask,
        });
      }

      return ApiResponse.success(res, 'Status updated successfully', { task: result.task });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update assignment endpoint
   */
  async updateAssignee(req, res, next) {
    try {
      const { assignedTo, version } = req.body;
      const result = await taskService.updateTask(
        req.params.id,
        { assignedTo, version },
        req.user
      );

      if (result.status === 404) return ApiResponse.notFound(res, result.message);
      if (result.status === 403) return ApiResponse.forbidden(res, result.message);
      if (result.status === 409) {
        return ApiResponse.conflict(res, result.message, result.error, {
          currentTask: result.currentTask,
        });
      }

      return ApiResponse.success(res, 'Task assignee updated', { task: result.task });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update priority endpoint
   */
  async updatePriority(req, res, next) {
    try {
      const { priority, version } = req.body;
      const result = await taskService.updateTask(
        req.params.id,
        { priority, version },
        req.user
      );

      if (result.status === 404) return ApiResponse.notFound(res, result.message);
      if (result.status === 403) return ApiResponse.forbidden(res, result.message);
      if (result.status === 409) {
        return ApiResponse.conflict(res, result.message, result.error, {
          currentTask: result.currentTask,
        });
      }

      return ApiResponse.success(res, 'Task priority updated', { task: result.task });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete task
   */
  async delete(req, res, next) {
    try {
      const result = await taskService.deleteTask(req.params.id, req.user);
      if (result.status === 404) return ApiResponse.notFound(res, result.message);
      if (result.status === 403) return ApiResponse.forbidden(res, result.message);

      return ApiResponse.success(res, result.message);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = taskController;
