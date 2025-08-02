const express = require('express');
const router = express.Router();
const {createShortUrl} = require('../controllers/urlController');
const {protect} = require('../middlewares/authMiddleware');

router.post('/shorten', protect, createShortUrl);
router.post('/shorten', protect, createShortUrl);

module.exports = router;