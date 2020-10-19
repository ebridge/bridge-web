const express = require('express');
const { v4: uuidv4 } = require('uuid');
const knex = require('../../postgres/knex').getKnex();

const { ROOMS } = require('../../lib/constants/tables');
const { JOIN_USERS_AND_ROOMS } = require('../../lib/constants/joinTables');
const {
  ServerError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require('../../lib/errors');
const logger = require('../../lib/logger')(module);

const router = express.Router();

// GET rooms
// TODO: Add filtering to be able to select a subset of rooms?
router.get('', async (req, res, next) => {
  let rooms;
  try {
    [rooms] = await knex(ROOMS)
      .select('*');
    if (rooms) {
      return res.status(200).json(rooms);
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
//


module.exports = router;
