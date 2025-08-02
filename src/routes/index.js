const express =require ('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const urlRoutes = require('./urlRoutes');
const analyticsRoutes = require('./analyticsRoutes');

router.use('/auth', authRoutes);
router.use('/url', urlRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;