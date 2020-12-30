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
let redisClient;

// Inits redis clients and returns adapter for socket.io
async function initializeRedis() {
  try {
    const pubReady = new Promise((resolve, reject) => {
      const client = new Redis.createClient(REDIS_PORT, REDIS_HOST, {
        detect_buffers: true,
        password: REDIS_PASSWORD,
      });
      client.on('ready', ()=>{
        resolve(client)
      });
    });
    const subReady = new Promise((resolve, reject) => {
      const client = new Redis.createClient(REDIS_PORT, REDIS_HOST, {
        detect_buffers: true,
        password: REDIS_PASSWORD,
      });
      client.on('ready', ()=>{
        resolve(client)
      });
    });
    const redisReady = new Promise((resolve, reject) => {
      const client = new Redis.createClient(REDIS_PORT, REDIS_HOST, {
        detect_buffers: true,
        password: REDIS_PASSWORD,
      });
      client.on('ready', ()=>{
        resolve(client)
      });
    });

    [pubClient, subClient, redisClient] = await Promise.all([pubReady, subReady, redisReady]);

    const ioAdapter = redisAdapter({ pubClient, subClient });
    return ioAdapter;
  } catch (error) {
    logger.error('Error starting Redis. Exiting...', { error });
    return process.exit(1);
  }
}

function getRedis() {
  if (!redisClient) {
    logger.warn('Redis was called before being initialized');
    throw Error('Redis is not initialized. Call initializeRedis');
  }
  return redisClient;
}

module.exports = {
  initializeRedis,
  getRedis,
};
