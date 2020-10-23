const express = require('express');
const { v4: uuidv4 } = require('uuid');
const knex = require('../../postgres/knex').getKnex();

const { ROOMS, USERS } = require('../../lib/constants/tables');
const { JOIN_USERS_AND_ROOMS } = require('../../lib/constants/joinTables');
const isAuthenticated = require('../middleware/isAuthenticated');
const { uuidv4RegExp } = require('../../../tests/testUtils');
const {
  ServerError,
  ValidationError,
  NotFoundError,
  ConflictError,
} = require('../../lib/errors');
const logger = require('../../lib/logger')(module);

const router = express.Router();

// GET all rooms
router.get('', isAuthenticated, async (req, res, next) => {
  let rooms;
  try {
    rooms = await knex(ROOMS)
      .leftJoin(JOIN_USERS_AND_ROOMS, `${JOIN_USERS_AND_ROOMS}.room_id`, `${ROOMS}.id`)
      .leftJoin(USERS, `${JOIN_USERS_AND_ROOMS}.user_id`, `${USERS}.id`)
      .select([`${ROOMS}.id`, `${ROOMS}.room_number`, `${USERS}.display_name`]);
    if (rooms) {
      // Group users by room with roomId and roomNumber
      const roomDictionary = {};
      for (const room of rooms) {
        if (!roomDictionary[room.id]) {
          roomDictionary[room.id] = {
            users: [],
            roomNumber: room.room_number,
          };
        }
        roomDictionary[room.id].users.push(room.display_name);
      }
      let result = [];
      for (const entry of Object.entries(roomDictionary)) {
        result.push({
          roomId: entry[0],
          roomNumber: entry[1].roomNumber,
          users: entry[1].users,
        });
      }
      // Sort result by room number
      result = result.sort((a, b) => (
        a.roomNumber - b.roomNumber
      ));
      return res.status(200).json(result);
    }
    return next(new NotFoundError(
      'No rooms found on get rooms route. Did you seed the Database?',
      'Unable to locate any rooms.'
    ));
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
});

// GET room by id
router.get('/:roomId', isAuthenticated, async (req, res, next) => {
  const { roomId } = req.params;

  if (!uuidv4RegExp.test(roomId)) {
    return next(new ValidationError(
      'An invalid uuid was passed to get room by ID route.',
      'Something went wrong when trying to load room.'
    ));
  }

  try {
    const [room] = await knex(ROOMS)
      .select('*')
      .where({ id: roomId });
    if (!room) {
      return next(new NotFoundError(
        'No room found with passed roomId.',
        'Could not find the room.'
      ));
    }
    return res.status(200).json(room);
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
});

/* POST Rooms
  This route should only be used in a development/testing environment
  because rooms should be seeded in production. Thus proper checks
  can be forgone such as duplicate room_number.

  TODO: Add higher auth validation
*/
router.post('', isAuthenticated, async (req, res, next) => {
  const { numberOfRooms } = req.body;
  if (!numberOfRooms) {
    return next(new NotFoundError(
      'No numberOfRooms property in request body.',
      'Must send how many rooms to create.'
    ));
  }
  // create array of room objects for knex insert
  const roomsArr = [];
  for (let i = 1; i <= numberOfRooms; i += 1) {
    const roomToBeAdded = {
      id: uuidv4(),
      room_number: i,
    };
    roomsArr.push(roomToBeAdded);
  }
  try {
    await knex(ROOMS).insert(roomsArr);
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
  return res.status(200).json(roomsArr);
});

// PUT join user and room
router.put('/:roomId/join/:userId', isAuthenticated, async (req, res, next) => {
  const { roomId, userId } = req.params;

  if (!uuidv4RegExp.test(roomId)) {
    return next(new ValidationError(
      'An invalid uuid roomId was passed to join room route.',
      'Something went wrong when trying to join room.'
    ));
  }

  if (!uuidv4RegExp.test(userId)) {
    return next(new ValidationError(
      'An invalid uuid userId was passed to join room route.',
      'Something went wrong when trying to join room.'
    ));
  }

  const queryPromises = [];
  queryPromises.push(
    knex(ROOMS)
      .select('id')
      .where({ id: roomId })
      .returning('id')
  );
  queryPromises.push(
    knex(USERS)
      .select('id')
      .where({ id: userId })
      .returning('id')
  );

  let queryResults;
  try {
    queryResults = await Promise.all(queryPromises);
  } catch (error) {
    logger.error(error);
    return next(new ServerError(
      'Database lookup of ID\'s in join room route failed.'
    ));
  }
  const [roomResult] = queryResults[0];
  const [userResult] = queryResults[1];
  if (!roomResult) {
    return next(new NotFoundError(
      'A valid uuid roomId was passed in join room route but returned no match.',
      'Could not find that room.'
    ));
  }
  if (!userResult) {
    return next(new NotFoundError(
      'A valid uuid userId was passed in join room route but returned no match.',
      'Could not find that user. Do you exist?'
    ));
  }
  const [duplicateUserIdInRoom] = await knex(JOIN_USERS_AND_ROOMS)
    .select('user_id')
    .where({ user_id: userResult.id });
  if (duplicateUserIdInRoom) {
    return next(new ConflictError(
      'UserId already exists in join_users_and_rooms table.',
      'You\'re already in a room.'
    ));
  }
  try {
    await knex(JOIN_USERS_AND_ROOMS)
      .insert({
        id: uuidv4(),
        user_id: userResult.id,
        room_id: roomResult.id,
      });
    return res.status(200).json({
      roomId: roomResult.id,
      userId: userResult.id,
    });
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
});

// PUT leave room (unjoin user and room)
router.put('/:roomId/leave/:userId', isAuthenticated, async (req, res, next) => {
  const { roomId, userId } = req.params;

  if (!uuidv4RegExp.test(roomId)) {
    return next(new ValidationError(
      'An invalid uuid roomId was passed to leave room route.',
      'Something went wrong when trying to leave room.'
    ));
  }

  if (!uuidv4RegExp.test(userId)) {
    return next(new ValidationError(
      'An invalid uuid userId was passed to leave room route.',
      'Something went wrong when trying to leave room.'
    ));
  }

  try {
    const [result] = await knex(JOIN_USERS_AND_ROOMS)
      .where({
        room_id: roomId,
        user_id: userId,
      })
      .returning(['room_id', 'user_id'])
      .select('*')
      .del();

    if (!result.room_id) {
      return next(new NotFoundError(
        'A valid uuid roomId was passed in leave room route but returned no match.',
        'Somethine went wrong when trying to leave room.'
      ));
    }
    if (!result.user_id) {
      return next(new NotFoundError(
        'A valid uuid userId was passed in leave room route but returned no match.',
        'Somethine went wrong when trying to leave room.'
      ));
    }

    return res.status(200).json({ ...result });
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
});


module.exports = router;
