const express = require('express');
const { v4: uuidv4 } = require('uuid');
const knex = require('../../postgres/knex').getKnex();

const { ROOMS, USERS } = require('../../lib/constants/tables');
const { JOIN_USERS_AND_ROOMS } = require('../../lib/constants/joinTables');
const {
  ServerError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require('../../lib/errors');
const logger = require('../../lib/logger')(module);

const router = express.Router();

// GET all rooms
router.get('', async (req, res, next) => {
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
            roomNumber: room.room_number
          }
        }
        roomDictionary[room.id].users.push(room.display_name);
      }
      let result = []
      for (const entry of Object.entries(roomDictionary)) {
        result.push({
          roomId: entry[0],
          roomNumber: entry[1].roomNumber,
          users: entry[1].users,
        })
      }

      // Sort result by room number
      result = result.sort((a, b) => (
        a.roomNumber - b.roomNumber
      ))
      return res.status(200).json(result);
    }
  } catch (error) {
    logger.error(error);
  }
  if (!rooms) {
    return next(new NotFoundError(
      'No rooms found in database.',
      'Unable to locate any rooms.'
    ));
  }
  return next(new ServerError());
});

//TODO: Get 1 room

/* POST Rooms
  This route should only be used in a development/testing environment
  because rooms should be seeded in production. Thus proper checks
  can be forgone such as duplicate room_number.

  TODO: Add higher auth validation
*/
router.post('', async (req, res, next) => {
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
router.put('/:roomId/join/:userId', async (req, res, next) => {
  const { roomId, userId } = req.params;
  if (!roomId || !userId) {
    return next(new NotFoundError(
      'roomId and userId were not passed to /:roomId/join/:userId route.',
      'IDs were not passed when attempting to join room.'
    ))
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

  let queryResults
  try {
    queryResults = await Promise.all(queryPromises)
  } catch (error) {
    logger.error(error)
    return next(new NotFoundError(
      'Error while grabbing room and user from ID in join route. Likely a bad uuid passed.'
    ))
  }
  const [roomResult] = queryResults[0]
  const [userResult] = queryResults[1]

  const [duplicateUserIdInRoom] = await knex(JOIN_USERS_AND_ROOMS)
    .select('user_id')
    .where({ user_id: userResult.id });
  if (duplicateUserIdInRoom) {
    return next(new ConflictError(
      'UserId already exists in join_users_and_rooms table.',
      'You\'re already in a room.'
    ))
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
    logger.error(error)
    return next(new ServerError());
  }
})


module.exports = router;
