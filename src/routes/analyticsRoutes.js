const { error } = require('selenium-webdriver');

const express = require('express');
const router = express.Router();
const {getUrlAnalytics, getTopicAnalytics, getOverallAnalytics} = require('../controllers/analyticsController');
const {protect} = require('../middlewares/authMiddleware');
const {cacheMiddleware} = require('../middlewares/cacheMiddleware');
const URL = require('../models//URL');
const Click = require('../models/Click');
const moment = require('moment');



router.get('/:alias', protect, cacheMiddleware, getUrlAnalytics);
exports.getUrlsAnalytics = async (requestAnimationFrame, res) => {
    const {alias} = req.params;
    const userId = req.user.id;

    try{
        const url = await URL.findOne({alias, user: userId});
        if(!url){
            return res.status(404).json({ error: 'URL not found or not owned by user'})

        }

        const totalClicks = await Click.countDocuments({url: url._id});
        const uniqueClicks = (await Click.distinct('ipAdress', {url: url._id})).length;

        const osType = await Click.aggregate([
            { $match: { url: url._id } },
      {
        $group: {
          _id: '$osType',
          uniqueClicks: { $addToSet: '$ipAddress' },
        },
      },
      {
        $project: {
          _id: 0,
          osName: '$_id',
          uniqueClicks: { $size: '$uniqueClicks' },
        },
      },
    ]);

    const deviceType = await Click.aggregate([
        { $match: { url: url._id } },
        { $group: { _id: '$deviceType', uniqueClicks: { $addToSet: '$ipAddress' } } },
        { $project: { _id: 0, deviceName: '$_id', uniqueClicks: { $size: '$uniqueClicks' } } },
    ]);

    const clicksByDate = await Click.aggregate([
            {
        $match: {
          url: url._id,
          timestamp: { $gte: moment().subtract(7, 'days').toDate() },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          totalClicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: '$_id', totalClicks: '$totalClicks' } },
    ]);

    const analytics = {
        totalClicks,
        uniqueClicks,
        clicksByDate,
        osType,
        deviceType,
    };

    res.status(200).json(analytics);
    } catch(err){
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
};


router.get('/topic/:topic', protect, cacheMiddleware, getTopicAnalytics);
exports.getTopicAnalytics = async (req, res) =>{
    const{topic} = req.params;
    const userId = req.user.id;

    try{
        const urls = await URL.find({ user: userId, topic });
        const urlIds = urls.map(url => url._id);

        const totalClicks = await Click.countDocuments({ url: { $in: urlIds } });
    const uniqueClicks = (await Click.distinct('ipAddress', { url: { $in: urlIds } })).length;

    const clicksByDate = await Click.aggregate([
        { $match: { url: { $in: urlIds }, timestamp: { $gte: moment().subtract(7, 'days').toDate() } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, totalClicks: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: '$_id', totalClicks: '$totalClicks' } },
    ]);

    const urlsWithClicks = await Promise.all(urls.map(async url =>{
        const totalClicks = await Click.countDocuments({url: url._id });
        const uniqueClicks = (await Click.distinct('ipAdress', {url: url._id})).length;
        return {shortUrl: url.shortUrl, totalClicks, uniqueClicks};
    }));

    res.status(200).json({totalClicks, uniqueClicks, clicksByDate, urls: urlsWithClicks});
    } catch(err){
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
};


router.get('/overall', protect, cacheMiddleware, getOverallAnalytics);
exports.getOverAllAnalytics = async (req, res) =>{
    const userId = req.user.id;

    try{
        const urls = await URL.find({ use: userId});
        const urlIds = urls.map(url => url._id);

        const totalUrls= urls.length;
        const totalClicks = await Click.countDocuments({ url: { $in: urlIds } });
        const uniqueClicks = (await Click.distinct('ipAddress', { url: { $in: urlIds } })).length;

        const clicksByDate = await Click.aggregate([
        { $match: { url: { $in: urlIds }, timestamp: { $gte: moment().subtract(7, 'days').toDate() } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, totalClicks: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: '$_id', totalClicks: '$totalClicks' } },
    ]);

    const osType = await Click.aggregate([
        { $match: { url: { $in: urlIds } } },
        { $group: { _id: '$osType', uniqueClicks: { $addToSet: '$ipAddress' } } },
        { $project: { _id: 0, osName: '$_id', uniqueClicks: { $size: '$uniqueClicks' } } },
    ]);

    const deviceType = await Click.aggregate([
        { $match: { url: { $in: urlIds } } },
        { $group: { _id: '$deviceType', uniqueClicks: { $addToSet: '$ipAddress' } } },
        { $project: { _id: 0, deviceName: '$_id', uniqueClicks: { $size: '$uniqueClicks' } } },
    ]);

    res.status(200).json({totalUrls, totalClicks, uniqueClicks, clicksByDate, osType, deviceType});
    } catch(err){
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
};

module.exports = router;