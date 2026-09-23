const express = require('express');
const { body, query } = require('express-validator');
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { TASK_STATUS, TASK_PRIORITY } = require('../config/constants');

const router = express.Router();

// Apply auth to all task routes
router.use(protect);

// Task Creation Validation
const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('status')
    .optional()
    .isIn(Object.values(TASK_STATUS))
    .withMessage(`Status must be one of: ${Object.values(TASK_STATUS).join(', ')}`),
  body('priority')
    .optional()
    .isIn(Object.values(TASK_PRIORITY))
    .withMessage(`Priority must be one of: ${Object.values(TASK_PRIORITY).join(', ')}`),
  body('assignedTo')
    .optional({ nullable: true })
    .isMongoId()
    .withMessage('Assigned user must be a valid Mongo ID'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Due date must be a valid ISO8601 date'),
  validate,
];

// Status Update Validation
const updateStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(Object.values(TASK_STATUS))
    .withMessage(`Status must be one of: ${Object.values(TASK_STATUS).join(', ')}`),
  body('version')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Version must be a positive integer'),
  validate,
];

// Routes
router.route('/')
  .post(createTaskValidation, taskController.create)
  .get(taskController.getAll);

router.route('/:id')
  .get(taskController.getById)
  .put(createTaskValidation, taskController.update)
  .delete(taskController.delete);

router.patch('/:id/status', updateStatusValidation, taskController.updateStatus);
router.patch('/:id/assign', taskController.updateAssignee);
router.patch('/:id/priority', taskController.updatePriority);

module.exports = router;
