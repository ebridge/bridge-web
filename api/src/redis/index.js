/* eslint-disable new-cap */
const Redis = require('ioredis');
const redisAdapter = require('socket.io-redis');
const logger = require('../lib/logger')(module);

const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
} = process.env;

let pubClient;
let subClient;
let redis;

// Inits redis clients and returns adapter for socket.io
function initializeRedis() {
  try {
    pubClient = new Redis.createClient(REDIS_PORT, REDIS_HOST, {
      detect_buffers: true,
      auth_pass: REDIS_PASSWORD,
    });
    subClient = new Redis.createClient(REDIS_PORT, REDIS_HOST, {
      detect_buffers: true,
      auth_pass: REDIS_PASSWORD,
    });
    redis = new Redis.createClient(REDIS_PORT, REDIS_HOST, {
      detect_buffers: true,
      auth_pass: REDIS_PASSWORD,
    });
    const ioAdapter = redisAdapter({ pubClient, subClient });
    return ioAdapter;
  } catch (error) {
    logger.error('Error starting Redis. Exiting...', { error });
    return process.exit(1);
  }
}

function getRedis() {
  if (!redis) {
    logger.warn('Redis was called before being initialized');
    throw Error('Redis is not initialized. Call initializeRedis');
  }
  return redis;
}

module.exports = {
  initializeRedis,
  getRedis,
};
