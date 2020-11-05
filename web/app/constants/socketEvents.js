// Global
export const WS_JOIN_GLOBAL = 'join_global';
export const WS_GLOBAL_MESSAGES = 'global_messages';
export const WS_GLOBAL_MESSAGE = 'global_message';

// Room
export const WS_JOIN_ROOM = 'join_room';
export const WS_ROOM_MESSAGES = 'room_messages';
export const WS_ROOM_MESSAGE = 'room_message';

// NOTE: Add all WS events here for them to be picked up by redux store
export const WS_ALL_EVENTS = {
  // Global
  WS_JOIN_GLOBAL,
  WS_GLOBAL_MESSAGES,
  WS_GLOBAL_MESSAGE,
  // Room
  WS_JOIN_ROOM,
  WS_ROOM_MESSAGES,
  WS_ROOM_MESSAGE,
};
