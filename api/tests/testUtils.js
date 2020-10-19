const faker = require('faker');
const { v4: uuidv4 } = require('uuid');
const { getKnex } = require('../src/postgres/knex');
const logger = require('../src/lib/logger');
const {
  USERS,
  ROOMS,
} = require('../src/lib/constants/tables');


const knex = getKnex();
const uuidv4RegExp = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

const generateTestUser = () => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  displayName: faker.internet.userName(),
});

const removeTestUser = email => {
  if (!email) {
    return logger.error('No email passed to removeTestUser.');
  }
  try {
    return knex(USERS).where('email', email).del();
  } catch (error) {
    return logger.error(error);
  }
};

const generateTestRooms = numberOfRooms => {
  if (!numberOfRooms) {
    return logger.error('No numberOfRooms passed to generateTestRooms');
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
    return knex(ROOMS).insert(roomsArr);
  } catch (error) {
    return logger.error(error);
  }
};

const removeTestRooms = async (numberOfRooms) => {
  try {
    return await knex(ROOMS)
      .whereBetween('room_number', [1, numberOfRooms])
      .del();
  } catch (error) {
    return logger.error(error);
  }
};

module.exports = {
  uuidv4RegExp,
  generateTestUser,
  removeTestUser,
  generateTestRooms,
  removeTestRooms,
};
