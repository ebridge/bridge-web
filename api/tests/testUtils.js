/* eslint-disable import/no-extraneous-dependencies */
const faker = require('faker');
const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const { getKnex } = require('../src/postgres/knex');
const expressApp = require('../src/server').app;
const logger = require('./testLogger');
const {
  USERS,
  ROOMS,
} = require('../src/lib/constants/tables');
const { JOIN_USERS_AND_ROOMS } = require('../src/lib/constants/joinTables');

const agent = request.agent(expressApp);
const knex = getKnex();
const uuidv4RegExp = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

const generateTestUser = () => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  displayName: faker.internet.userName(),
});

const createTestUser = async () => {
  const testUser = generateTestUser();
  try {
    const result = await agent
      .post('/rest/users/register')
      .send(testUser);
    if (!result.status === 200) {
      throw Error('Register route failed in createTestUser.');
    }
    return {
      ...result.body,
      password: testUser.password,
    };
  } catch (error) {
    return logger.error(error);
  }
};

const getToken = async user => {
  try {
    const result = await agent
      .post('/rest/users/login')
      .send(user);
    if (!result.status === 200) {
      throw Error('Login route failed in getToken.');
    }
    return result.body.token;
  } catch (error) {
    return logger.error('Failed to getToken in testUtils.js', error);
  }
};

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

const createTestRooms = async (numberOfRooms) => {
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
    await knex(ROOMS).insert(roomsArr);
    return roomsArr;
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

const removeUsersFromRooms = async () => {
  try {
    return await knex(JOIN_USERS_AND_ROOMS)
      .select('*')
      .del();
  } catch (error) {
    return logger.error(error);
  }
};

module.exports = {
  agent,
  uuidv4RegExp,
  generateTestUser,
  createTestUser,
  getToken,
  removeTestUser,
  createTestRooms,
  removeTestRooms,
  removeUsersFromRooms,
};
