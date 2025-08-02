const analyticsService = require('../analytics/analyticsService');

exports.getUrlAnalytics = async (req, res) => {
    const { alias } = req.params;
    const userId = req.user.id;
    try {
        const analyticsData = await analyticsService.getUrlAnalytics(alias, userId);
        res.status(200).json(analyticsData);
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getTopicAnalytics = async (req, res) => {
    const { topic } = req.params;
    const userId = req.user.id;
    try {
        const analyticsData = await analyticsService.getTopicAnalytics(topic, userId);
        res.status(200).json(analyticsData);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getOverallAnalytics = async (req, res) => {
    const userId = req.user.id;
    try {
        const analyticsData = await analyticsService.getOverallAnalytics(userId);
        res.status(200).json(analyticsData);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};