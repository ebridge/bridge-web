// eslint-disable-next-line import/no-extraneous-dependencies
const { expect } = require('chai');
const {
  agent,
  createTestRooms,
  removeTestRooms,
  createTestUser,
  removeTestUser,
  getToken,
  removeUsersFromRooms,
} = require('./testUtils');

const NUMBER_OF_ROOMS = 5;
let token;
let testUser;
let testRooms;

describe('/rest/rooms', async () => {
  // create test rooms
  before(async () => {
    testRooms = await createTestRooms(NUMBER_OF_ROOMS);
    testUser = await createTestUser();
    token = await getToken(testUser);
  });

  describe('PUT /:roomId/join/:userId', () => {
    it('should add a user to the room and return an object of both ID\'s', async () => {
      const result = await agent
        .put(`/rest/rooms/${testRooms[0].id}/join/${testUser.id}`);
      expect(result.status).to.equal(200);
      expect(result.error).to.equal(false);
      expect(result.body).to.be.an('object');
    });
  });

  describe('GET', () => {
    it('should return an array of all rooms', async () => {
      const result = await agent
        .get('/rest/rooms')
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(200);
      expect(result.error).to.equal(false);
      expect(result.body).to.be.an('array');
      expect(result.body).to.have.lengthOf(NUMBER_OF_ROOMS);
    });

    it('should return an unauthorized error when passed a null Auth header', async () => {
      const result = await agent
        .get('/rest/rooms');
      expect(result.status).to.equal(401);
      expect(result.body.uiError).to.equal('Unauthorized.');
    });
  });

  // describe('GET /:roomId')

  // remove test rooms
  after(async () => {
    await removeUsersFromRooms();
    await removeTestRooms(NUMBER_OF_ROOMS);
    await removeTestUser(testUser.email);
  });
});
