const express = require('express');
const router = express.Router();
const { redirectToLongUrl } = require('../controllers/urlController');

router.get('/:alias', redirectToLongUrl);

module.exports = router;