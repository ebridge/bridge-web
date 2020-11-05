const keys = {
  GLOBAL_MESSAGES: 'global_messages',
  ROOM_MESSAGES: (roomId) => `room_${roomId}_messages`,
  ROOM_STATE: (roomId) => `room_${roomId}_state`,
};

module.exports = {
  keys,
};
