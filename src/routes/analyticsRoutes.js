const express = require('express');
const router = express.Router();
const { getUrlAnalytics, getTopicAnalytics, getOverallAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');
const { cacheMiddleware } = require('../middlewares/cacheMiddleware');

router.get('/:alias', protect, cacheMiddleware, getUrlAnalytics);

router.get('/topic/:topic', protect, cacheMiddleware, getTopicAnalytics);

router.get('/overall', protect, cacheMiddleware, getOverallAnalytics);

module.exports = router;