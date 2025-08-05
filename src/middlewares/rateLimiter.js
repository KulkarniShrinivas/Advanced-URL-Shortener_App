const rateLimit = require('express-rate-limit');

const createUrlLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: 'You have exceeded the URL creation limit. Please try again later.',
  keyGenerator: (req) => req.user.id,
});

module.exports = { createUrlLimiter };