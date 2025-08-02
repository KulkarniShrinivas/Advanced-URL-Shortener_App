const URL = require('../models/URL');
const Click = require('../models/Click');
const moment = require('moment');

exports.getUrlAnalytics = async (alias, userId) => {
    const url = await URL.findOne({ alias, user: userId });
    if (!url) {
        throw new Error('URL not found or not owned by user');
    }

    const totalClicks = await Click.countDocuments({ url: url._id });
    const uniqueClicks = (await Click.distinct('ipAddress', { url: url._id })).length;

    const osType = await Click.aggregate([
        { $match: { url: url._id } },
        { $group: { _id: '$osType', uniqueClicks: { $addToSet: '$ipAddress' } } },
        { $project: { _id: 0, osName: '$_id', uniqueClicks: { $size: '$uniqueClicks' } } },
    ]);

    const deviceType = await Click.aggregate([
        { $match: { url: url._id } },
        { $group: { _id: '$deviceType', uniqueClicks: { $addToSet: '$ipAddress' } } },
        { $project: { _id: 0, deviceName: '$_id', uniqueClicks: { $size: '$uniqueClicks' } } },
    ]);

    const clicksByDate = await Click.aggregate([
        { $match: { url: url._id, timestamp: { $gte: moment().subtract(7, 'days').toDate() } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, totalClicks: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: '$_id', totalClicks: '$totalClicks' } },
    ]);

    return { totalClicks, uniqueClicks, clicksByDate, osType, deviceType };
};

exports.getTopicAnalytics = async (topic, userId) => {
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

    const urlsWithClicks = await Promise.all(urls.map(async url => {
        const totalClicks = await Click.countDocuments({ url: url._id });
        const uniqueClicks = (await Click.distinct('ipAddress', { url: url._id })).length;
        return { shortUrl: url.shortUrl, totalClicks, uniqueClicks };
    }));

    return { totalClicks, uniqueClicks, clicksByDate, urls: urlsWithClicks };
};

exports.getOverallAnalytics = async (userId) => {
    const urls = await URL.find({ user: userId });
    const urlIds = urls.map(url => url._id);

    const totalUrls = urls.length;
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

    return { totalUrls, totalClicks, uniqueClicks, clicksByDate, osType, deviceType };
};