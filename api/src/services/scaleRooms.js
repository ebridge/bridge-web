const { v4: uuidv4 } = require('uuid');
const logger = require('../lib/logger')(module);
const { getKnex } = require('../postgres/knex');
const { ROOMS } = require('../lib/constants/tables');

const { DEFAULT_NUMBER_OF_ROOMS } = process.env;

async function scaleNumberOfRoomsUpTo(numberOfRooms = DEFAULT_NUMBER_OF_ROOMS) {
  const knex = getKnex();

  // Get existing rooms if there are any
  const existingRooms = await knex(ROOMS).select('*');

  let roomsToBeAdded = 0;
  let startingRoom = 1;
  if (!existingRooms || !existingRooms.length) {
    roomsToBeAdded = numberOfRooms;
  } else {
    roomsToBeAdded = numberOfRooms - existingRooms.length;
    startingRoom = existingRooms[existingRooms.length - 1].room_number;
  }

  // Populate array of room objects for knex insert
  const roomsArr = [];
  for (let i = startingRoom; i <= roomsToBeAdded; i += 1) {
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
    throw new Error(`Unable to seed up to ${numberOfRooms} rooms`);
  }
}

async function scaleNumberOfRoomsDownTo(numberOfRooms = DEFAULT_NUMBER_OF_ROOMS) {
  const knex = getKnex();

  // Get existing rooms
  const existingRooms = await knex(ROOMS).select('*');

  if (!existingRooms || !existingRooms.length || existingRooms.length < numberOfRooms) {
    logger.warn(`
      Number of rooms to scale down to is smaller than current number of rooms. Scaling up to ${numberOfRooms} instead.
    `);
    return scaleNumberOfRoomsUpTo(numberOfRooms);
  } if (existingRooms.length === numberOfRooms) {
    logger.warn(`Number of existing rooms is already ${numberOfRooms}`);
    return existingRooms;
  }

  // Populate array of room objects for knex delete
  const roomsToBeDeleted = [];
  for (let i = existingRooms.length; i > numberOfRooms; i -= 1) {
    roomsToBeDeleted.push(i);
  }
  try {
    return await knex(ROOMS)
      .whereIn('room_number', roomsToBeDeleted)
      .del();
  } catch (error) {
    logger.error(error);
    throw new Error(`Unable to seed up to ${numberOfRooms} rooms`);
  }
}

module.exports = {
  scaleNumberOfRoomsUpTo,
  scaleNumberOfRoomsDownTo,
};
