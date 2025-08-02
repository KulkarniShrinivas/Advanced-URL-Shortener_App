const express = require('express');
const router = express.Router();
const { createShortUrl, redirectToLongUrl } = require('../controllers/urlController');
const { createUrlLimiter } = require('../middlewares/rateLimiter'); // Correct path for the rate limiter
const { protect } = require('../middlewares/authMiddleware');


router.post('/shorten', protect, createUrlLimiter, createShortUrl);
router.get('/:alias', redirectToLongUrl);

module.exports = router;