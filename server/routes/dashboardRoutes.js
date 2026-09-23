const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/stats', dashboardController.getStats);
router.get('/activities', dashboardController.getActivities);

module.exports = router;
