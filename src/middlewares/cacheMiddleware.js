const redisClient = require('../config/redis');

exports.cacheMiddleware = (req, res, next) => {
  const cacheKey = req.originalUrl;
  
  redisClient.get(cacheKey, (err, data) => {
    if (err) {
      console.error('Redis error:', err);
      return next();
    }
    
    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
};