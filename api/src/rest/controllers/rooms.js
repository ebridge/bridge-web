const express = require('express');
const knex = require('../../postgres/knex').getKnex();

const { TABLES } = require('../../lib/constants/tables');
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
//


// PUT join user and room
//

/*
  This route should only be used in a development/testing environment
  because rooms should be seeded in production. Thus proper checks
  can be forgone such as duplicate room_number.

  TODO: Add higher auth validation
*/
router.post('/rooms', async (req, res, next) => {
  const { numberOfRooms } = req.body;
  if (!numberOfRooms) {
    return next(new NotFoundError(
      'No numberOfRooms property in request body.',
      'Must send how many rooms to create.'
    ));
  }
  // create array of room objects for knex insert
  let roomsArr;
  for (let i = 0; i < numberOfRooms; i += 1) {
    const roomToBeAdded = {
      room_number: i,
    };
    roomsArr.push(roomToBeAdded);
  }
  return console.log(roomsArr);
});

module.exports = router;
