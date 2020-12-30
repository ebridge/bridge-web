const socketInit = require('socket.io');
const { rooms, events } = require('../lib/constants/socket');
const { isAuthenticated, getUserRoom } = require('./middleware');
const {
  addGlobalMessage,
  getGlobalMessages,
  addRoomMessage,
  getRoomMessages,
} = require('../redis/messages');
const logger = require('../lib/logger')(module);

let io;
function initSocket(server, ioAdapter) {
  io = socketInit(server, {
    adapter: ioAdapter,
    path: '/ws/'
  });
  // Use auth middleware
  io.use(isAuthenticated);
  io.on('connection', onConnect);
  io.on('disconnect', onDisconnect);
}

function getIo() {
  if (!io) {
    logger.warn('io not initialized. Call initSocket first.');
    throw new Error('io not initialized. Call initSocket first.');
  }
  return io;
}

// Set up onConnect logic for a fresh socket connection
function onConnect(socket) {
  // On join_global event, join global room and send existing global info (e.g. messages)
  socket.on(events.JOIN_GLOBAL, async () => {
    const globalMessages = await getGlobalMessages();
    socket.join(rooms.GLOBAL); // Join global dashboard room
    socket.emit(events.GLOBAL_MESSAGES, globalMessages);
  });
  socket.on(events.GLOBAL_MESSAGE, async message => {
    await addGlobalMessage(message);
    io.to(rooms.GLOBAL).emit(events.GLOBAL_MESSAGE, message);
  });

  /*
  On join_room event, join specific room and send existing room info
  This event should be called from client after rest endpoint /rooms/join is hit
  Room will be determined via passed jwt
  */
  socket.on(events.JOIN_ROOM, async () => {
    const userRoom = await getUserRoom(socket);
    const roomMessages = await getRoomMessages(userRoom.roomId);
    socket.leave(rooms.GLOBAL);
    socket.join(rooms.GET_ROOM(userRoom.roomId));
    socket.emit(events.ROOM_MESSAGES, roomMessages);
  });
  socket.on(events.ROOM_MESSAGE, async message => {
    const userRoom = await getUserRoom(socket);
    await addRoomMessage(userRoom.roomId, message);
    io.to(rooms.GET_ROOM(userRoom.roomId)).emit(events.ROOM_MESSAGE, message);
  });
}

// Set up onDisconnect logic when client disconnects
function onDisconnect(socket) {
  return socket;
  // TODO: Create job at date to kick user out of room if they don't rejoin
}

module.exports = {
  initSocket,
  getIo,
};
