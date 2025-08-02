const express = require('express');
const router = express.Router();
const { createShortUrl } = require('../controllers/urlController');
const { createUrlLimiter } = require('../middlewares/rateLimiter');
const { protect } = require('../middlewares/authMiddleware');

router.post('/shorten', protect, createUrlLimiter, createShortUrl);

module.exports = router;