/* eslint-disable global-require */
const jwt = require('jsonwebtoken');
const { USERS } = require('../lib/constants/tables');
const { userView } = require('../rest/views/userViews');
const { JOIN_USERS_AND_ROOMS } = require('../lib/constants/joinTables');

let knex;
function isAuthenticated(socket, next) {
  knex = require('../postgres/knex').getKnex();
  if (socket.handshake.query && socket.handshake.query.token) {
    const { token } = socket.handshake.query;
    try {
      jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) => {
        if (error) {
          return next(new Error('Invalid token'));
        }
        // Compare token expiry (seconds) to current time (in ms) - bail out if token has expired
        if (decodedToken.exp <= Date.now() / 1000) {
          return next(new Error('Token expired.'));
        }
        const [dbUser] = await knex(USERS)
          .select('*')
          .where({ id: decodedToken.id });
        const user = userView(dbUser);
        // eslint-disable-next-line no-param-reassign
        socket.user = user;
        return next();
      });
    } catch (error) {
      return next(new Error(error.message));
    }
  }
  return next(new Error('Token not present.'));
}

async function getUserRoom(socket) {
  if (!knex) {
    knex = require('../postgres/knex').getKnex();
  }
  // User no longer authenticated
  if (!socket || !socket.user) {
    return {
      error: 'NOT_LOGGED_IN',
      message: 'You are no longer logged in.',
    };
  }

  const userRoom = await knex(JOIN_USERS_AND_ROOMS)
    .first('room_id as roomId', 'seat')
    .where({ user_id: socket.user.id });

  // User no longer in room
  if (!userRoom) {
    return {
      error: 'NOT_IN_ROOM',
      message: 'You are no longer in this room.',
    };
  }

  return userRoom;
}

module.exports = {
  isAuthenticated,
  getUserRoom,
};
