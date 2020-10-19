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
  before(async () => {
    await generateTestRooms(NUMBER_OF_ROOMS);
  });

  describe('GET', async () => {
    it('should return an array of all rooms', async () => {
      const result = await agent
        .get('/rest/rooms');
      expect(result.status).to.equal(200);
      expect(result.error).to.equal(false);
      expect(result.body).to.be.an('array');
      expect(result.body).to.have.lengthOf(NUMBER_OF_ROOMS);
    });
  });

  // remove test rooms
  after(async () => {
    await removeTestRooms(NUMBER_OF_ROOMS);
  });
});
