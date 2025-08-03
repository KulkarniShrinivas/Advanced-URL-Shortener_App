const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

router.get('/dashboard', protect, (req, res) => {

    res.send(`Welcome to your dashboard, ${req.user.displayName}! You are logged in.`);
});

module.exports = router;