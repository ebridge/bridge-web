/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const request = require('supertest');
const expressApp = require('../src/server').app;
const {
  generateTestRooms,
  removeTestRooms,
} = require('./testUtils');

const agent = request.agent(expressApp);
const NUMBER_OF_ROOMS = 5;

describe('/rest/rooms', () => {
  // create test rooms
  generateTestRooms(NUMBER_OF_ROOMS);

  // remove test rooms
  removeTestRooms(NUMBER_OF_ROOMS);
});
