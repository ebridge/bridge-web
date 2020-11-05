import io from 'socket.io-client';
import { WS_ALL_EVENTS } from '../../constants/socketEvents';
import { getCookie } from '../../lib/cookieUtils';
import { JWT_COOKIE } from '../../constants/userConstants';
import logger from '../../lib/logger';

const isDevEnv = process.env.NODE_ENV !== 'production';

let socket;

function setSocketListeners(store) {
  socket = io(process.env.API_HOST, {
    transports: ['websocket'],
    timeout: process.env.WEBSOCKET_TIMEOUT,
    autoConnect: false,
    query: { token: getCookie(JWT_COOKIE) },
  });

  Object.values(WS_ALL_EVENTS).forEach(eventType => {
    socket.on(eventType, payload => {
      // Log events in development
      if (isDevEnv) {
        logger.info(`Socket event ${eventType} received.`);
      }
      store.dispatch({
        type: eventType,
        payload,
      });
    });
  });

  let keepAliveInterval;
  socket.on('connect', () => {
    keepAliveInterval = setInterval(() => socket.emit('keep_alive', true), process.env.SOCKET_KEEP_ALIVE_INTERVAL);
  });

  socket.on('disconnect', () => {
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
    }
  });

  if (typeof window !== 'undefined') {
    window.socket = socket;
  }
  return socket;
}

export const getSocket = () => socket;

export default setSocketListeners;
