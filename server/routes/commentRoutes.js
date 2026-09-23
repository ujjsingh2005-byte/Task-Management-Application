const express = require('express');
const { body } = require('express-validator');
const commentController = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router({ mergeParams: true });

router.use(protect);

const commentValidation = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Comment text cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
  validate,
];

// /api/tasks/:id/comments
router.route('/')
  .post(commentValidation, commentController.addComment)
  .get(commentController.getTaskComments);

module.exports = router;
