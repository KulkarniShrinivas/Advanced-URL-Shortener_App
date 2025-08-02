const URL = require('../models/URL');
const Click = require('../models/Click');
const moment = require('moment');
const { error } = require('selenium-webdriver');

exports.getUrlAnalytics = async(req, res) =>{
    const {alias} = req.params;
    const userId = req.user.id;

    try{
        const url = await URL.findOne({
            alias, user: userId
        });

        if(!url){
            return res.status(404).json({error: 'URL not found or not owned by user'});
        }

        const totalClicks = await Click.countDocuments({ url: url._id});
         const uniqueClicks = (await Click.distinct('ipAddress', { url: url._id })).length;

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

    const clickByDate = await Click.aggregate([
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
        clickByDate,
        osType,
        deviceType
    };

    res.status(200).json(analytics);
    } catch(err){
        console.error(err);
        res.status(500).json({error: 'Server error'});
    } 
};



exports.getTopicAnalytics = async(req, res) =>{
    const {topic} = req.params;
    const userId = req.user.id;

    try{
        const urls = await URL.find({user: userId, topic});
        const urlIds = urls.map(url => url._id);

        const totalClicks = await Click.countDocuments({ url: { $in: urlIds } });
        const uniqueClicks = (await Click.distinct('ipAddress', { url: { $in: urlIds } })).length;

        const urlsWithClicks = await Promise.all(urls.map(async url => {
        const totalClicks = await Click.countDocuments({ url: url._id });
        const uniqueClicks = (await Click.distinct('ipAddress', { url: url._id })).length;
        return { shortUrl: url.shortUrl, totalClicks, uniqueClicks };
    }));

    res.status(200).json({totalClicks, uniqueClicks, clickByDate, urls: urlsWithClicks });

    } catch(err){
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
};

