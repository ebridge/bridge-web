/* eslint-disable import/no-extraneous-dependencies */
const faker = require('faker');
const { v4: uuidv4 } = require('uuid');
const { getKnex } = require('../src/postgres/knex');
const logger = require('../src/lib/logger');
const {
  USERS,
  ROOMS,
} = require('../src/lib/constants/tables');

const knex = getKnex();

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

const removeTestRooms = numberOfRooms => {
  try {
    return knex(ROOMS).whereBetween('room_number', [1, numberOfRooms]).del();
  } catch (error) {
    return logger.error(error);
  }
};

module.exports = {
  generateTestUser,
  removeTestUser,
  generateTestRooms,
  removeTestRooms,
};
