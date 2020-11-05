const { getRedis } = require('.');
const { keys } = require('../lib/constants/redis');

let redis;

const defaultGameState = {};

async function getRoomState(roomId) {
  if (!redis) {
    redis = getRedis();
  }
  const gameState = redis.get(keys.ROOM_STATE(roomId));
  if (gameState) {
    return JSON.parse(gameState);
  }
  return defaultGameState;
}

async function setRoomState(roomId, gameState) {
  if (!redis) {
    redis = getRedis();
  }
  return redis.set(keys.ROOM_STATE(roomId), gameState);
}

module.exports = {
  getRoomState,
  setRoomState,
};
