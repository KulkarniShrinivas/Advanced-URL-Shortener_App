const Redis = require('ioredis');

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

redisClient.on('connect', () => console.log('Redis connected'));
redisClient.on('error',(err) => console.log('Redis error:', err));


module.exports = redisClient;