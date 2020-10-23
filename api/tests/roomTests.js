// eslint-disable-next-line import/no-extraneous-dependencies
const { expect } = require('chai');
const { v4: uuidv4 } = require('uuid');
const {
  agent,
  uuidv4RegExp,
  createTestRooms,
  removeTestRooms,
  createTestUser,
  removeTestUser,
  getToken,
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

  // GET all rooms
  describe('GET', () => {
    it('should return an array of all rooms when authorized', async () => {
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

  // GET room by id
  describe('GET /:roomId', () => {
    it('should return a single room object when passed a valid roomId and authorized', async () => {
      const result = await agent
        .get(`/rest/rooms/${testRooms[0].id}`)
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(200);
      expect(result.error).to.equal(false);
      expect(result.body).to.be.an('object');
    });

    it('should return an unauthorized error when passed a null Auth header', async () => {
      const result = await agent
        .get(`/rest/rooms/${testRooms[0].id}`);
      expect(result.status).to.equal(401);
      expect(result.body.uiError).to.equal('Unauthorized.');
    });

    it('should return the correct status and error when passed an invalid uuid', async () => {
      const result = await agent
        .get(`/rest/rooms/${12345}`)
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(400);
      expect(result.body).to.be.an('object');
      expect(result.body.error).to.equal('An invalid uuid was passed to get room by ID route.');
    });
  });

  // PUT join room
  describe('PUT /:roomId/join/:userId', () => {
    it('should add a user to the room and return an object of both ID\'s', async () => {
      const result = await agent
        .put(`/rest/rooms/${testRooms[0].id}/join/${testUser.id}`)
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(200);
      expect(result.error).to.equal(false);
      expect(result.body).to.be.an('object');
      expect(result.body.roomId).to.match(uuidv4RegExp);
      expect(result.body.userId).to.match(uuidv4RegExp);
    });

    it('should return the correct status and error when passed an invalid roomId', async () => {
      const result = await agent
        .put(`/rest/rooms/${12345}/join/${testUser.id}`)
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(400);
      expect(result.body).to.be.an('object');
      expect(result.body.error).to.equal('An invalid uuid roomId was passed to join room route.');
    });

    it('should return the correct status and error when passed an invalid userId', async () => {
      const result = await agent
        .put(`/rest/rooms/${testRooms[0].id}/join/${12345}`)
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(400);
      expect(result.body).to.be.an('object');
      expect(result.body.error).to.equal('An invalid uuid userId was passed to join room route.');
    });

    it('should return the correct status and error when passed a valid uuid that does not exist', async () => {
      const randomId = uuidv4();
      const result = await agent
        .put(`/rest/rooms/${randomId}/join/${testUser.id}`)
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(404);
      expect(result.body).to.be.an('object');
      expect(result.body.error).to.equal('A valid uuid roomId was passed in join room route but returned no match.');
    });
  });

  // PUT leave room
  describe('PUT /:roomId/leave/:userId', () => {
    it('should return an object with the room and user ID removed from the join table', async () => {
      const result = await agent
        .put(`/rest/rooms/${testRooms[0].id}/leave/${testUser.id}`)
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(200);
      expect(result.body).to.be.an('object');
      expect(result.error).to.equal(false);
      expect(result.body.room_id).to.match(uuidv4RegExp);
      expect(result.body.user_id).to.match(uuidv4RegExp);
    });

    it('should return the correct status and error when passed an invalid roomId', async () => {
      const result = await agent
        .put(`/rest/rooms/${12345}/leave/${testUser.id}`)
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(400);
      expect(result.body).to.be.an('object');
      expect(result.body.error).to.equal('An invalid uuid roomId was passed to leave room route.');
    });

    it('should return the correct status and error when passed an invalid userId', async () => {
      const result = await agent
        .put(`/rest/rooms/${testRooms[0].id}/leave/${12345}`)
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(400);
      expect(result.body).to.be.an('object');
      expect(result.body.error).to.equal('An invalid uuid userId was passed to leave room route.');
    });

    it('should return the correct status and error when passed a valid uuid that does not exist', async () => {
      const randomId = uuidv4();
      const result = await agent
        .put(`/rest/rooms/${randomId}/join/${testUser.id}`)
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(404);
      expect(result.body).to.be.an('object');
      expect(result.body.error).to.equal('A valid uuid roomId was passed in join room route but returned no match.');
    });
  });

  // remove test rooms
  after(async () => {
    await removeTestRooms(NUMBER_OF_ROOMS);
    await removeTestUser(testUser.email);
  });
});
