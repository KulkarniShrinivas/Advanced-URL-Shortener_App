const rateLimiter = require('express-rate-limit');

const createUrlLimiter = rateLimiter({
    windowMS: 60*60*1000,
    max: 10,
    message: 'Too many requests, please try again later',
    keyGenerator: (req) => req.user.id,
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {createUrlLimiter};