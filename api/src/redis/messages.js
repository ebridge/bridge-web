const { getRedis } = require('.');
const { keys } = require('../lib/constants/redis');

let redis;

// TODO: Move global messages to MongoDB that expire after week
async function getGlobalMessages() {
  if (!redis) {
    redis = getRedis();
  }
  const messages = await redis.get(keys.GLOBAL_MESSAGES);
  if (messages) {
    return JSON.parse(messages);
  }
  return [];
}

// TODO: Move global messages to MongoDB that expire after week
async function addGlobalMessage(message) {
  if (!redis) {
    redis = getRedis();
  }
  const messages = await getGlobalMessages();
  messages.push(message);
  return redis.set(keys.GLOBAL_MESSAGES, JSON.stringify(messages));
}

// TODO: Move room messages to MongoDB that expire after week
async function getRoomMessages(roomId) {
  if (!redis) {
    redis = getRedis();
  }
  const messages = await redis.get(keys.ROOM_MESSAGES(roomId));
  if (messages) {
    return JSON.parse(messages);
  }
  return [];
}

// TODO: Move room messages to MongoDB that expire after week
async function addRoomMessage(roomId, message) {
  if (!redis) {
    redis = getRedis();
  }
  const messages = await getRoomMessages(roomId);
  messages.push(message);
  return redis.set(keys.ROOM_MESSAGES(roomId), JSON.stringify(messages));
}

// TODO: Move global messages to MongoDB that expire after week
module.exports = {
  // Global
  getGlobalMessages,
  addGlobalMessage,
  // Room
  getRoomMessages,
  addRoomMessage,
};
