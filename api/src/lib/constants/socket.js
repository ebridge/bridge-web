const rooms = {
  GLOBAL: 'global',
  GET_ROOM: (roomNumber) => `room_${roomNumber}`,
};

const events = {
  JOIN_GLOBAL: 'join_global',
  GLOBAL_MESSAGE: 'global_message',
  GLOBAL_MESSAGES: 'global_messages',
  JOIN_ROOM: 'join_room',
  ROOM_MESSAGE: 'room_message',
  ROOM_MESSAGES: 'room_messages',
};

module.exports = {
  rooms,
  events,
};
