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
  removeUsersFromRooms,
  getToken,
} = require('./testUtils');

const NUMBER_OF_ROOMS = 5;
let token;
let testUser;
let testUser2;
let testRooms;

describe('/rest/rooms', async () => {
  // create test rooms
  before(async () => {
    testRooms = await createTestRooms(NUMBER_OF_ROOMS);
    testUser = await createTestUser();
    testUser2 = await createTestUser();
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

    it('should return a 400 status and error when passed an invalid uuid', async () => {
      const result = await agent
        .get(`/rest/rooms/${12345}`)
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(400);
      expect(result.body).to.be.an('object');
      expect(result.body.error).to.equal('An invalid uuid was passed to get room by ID route.');
    });
  });

  // PUT join room
  describe('PUT /join', () => {
    it('should add a user to the room and return an object of both ID\'s', async () => {
      const result = await agent
        .put('/rest/rooms/join')
        .send({
          roomId: testRooms[0].id,
          userId: testUser.id,
          seat: 'N',
        })
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(200);
      expect(result.error).to.equal(false);
      expect(result.body).to.be.an('object');
      expect(result.body.roomId).to.match(uuidv4RegExp);
      expect(result.body.userId).to.match(uuidv4RegExp);
    });

    it('should return a 409 status when trying to join the same seat as a previous user', async () => {
      const result = await agent
        .put('/rest/rooms/join')
        .send({
          roomId: testRooms[0].id,
          userId: testUser2.id,
          seat: 'N',
        })
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(409);
      expect(result.body).to.be.an('object');
      expect(result.body.error).to.equal('User attempted to join seat that was already filled.');
    });

    it('should add a user to the room at a different seat position and return an object of both ID\'s', async () => {
      const result = await agent
        .put('/rest/rooms/join')
        .send({
          roomId: testRooms[0].id,
          userId: testUser2.id,
          seat: 'S',
        })
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(200);
      expect(result.error).to.equal(false);
      expect(result.body).to.be.an('object');
      expect(result.body.roomId).to.match(uuidv4RegExp);
      expect(result.body.userId).to.match(uuidv4RegExp);
    });


    it('should return a 400 status and error when passed an invalid roomId', async () => {
      const result = await agent
        .put('/rest/rooms/join')
        .send({
          roomId: 12345,
          userId: testUser.id,
          seat: 'N',
        })
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(400);
      expect(result.body).to.be.an('object');
      expect(result.body.error).to.equal('An invalid uuid roomId was passed to join room route.');
    });

    it('should return a 400 status and error when passed an invalid userId', async () => {
      const result = await agent
        .put('/rest/rooms/join')
        .send({
          roomId: testRooms[0].id,
          userId: 12345,
          seat: 'N',
        })
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(400);
      expect(result.body).to.be.an('object');
      expect(result.body.error).to.equal('An invalid uuid userId was passed to join room route.');
    });

    it('should return a 404 status and error when passed a valid uuid that does not exist', async () => {
      const randomId = uuidv4();
      const result = await agent
        .put('/rest/rooms/join')
        .send({
          roomId: randomId,
          userId: testUser.id,
          seat: 'N',
        })
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(404);
      expect(result.body).to.be.an('object');
      expect(result.body.error).to.equal('A valid uuid roomId was passed in join room route but returned no match.');
    });
  });

  describe('GET /joined/:roomId', () => {
    it('should return an array of users in a room with one player seated N and one seated S', async () => {
      const result = await agent
        .get(`/rest/rooms/joined/${testRooms[0].id}`)
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(200);
      expect(result.error).to.equal(false);
      expect(result.body).to.be.an('array');
      expect(result.body).to.have.length(2);
      expect(result.body[0].seat).to.equal('N');
      expect(result.body[1].seat).to.equal('S');
    });
  });

  // PUT leave room
  describe('PUT /leave', () => {
    it('should return an object with the room and user ID removed from the join table', async () => {
      const result = await agent
        .put('/rest/rooms/leave')
        .send({
          roomId: testRooms[0].id,
          userId: testUser.id,
        })
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(200);
      expect(result.body).to.be.an('object');
      expect(result.error).to.equal(false);
      expect(result.body.room_id).to.match(uuidv4RegExp);
      expect(result.body.user_id).to.match(uuidv4RegExp);
    });

    it('should return a 400 status and error when passed an invalid roomId', async () => {
      const result = await agent
        .put('/rest/rooms/leave')
        .send({
          roomId: 12345,
          userId: testUser.id,
        })
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(400);
      expect(result.body).to.be.an('object');
      expect(result.body.error).to.equal('An invalid uuid roomId was passed to leave room route.');
    });

    it('should return a 400 status and error when passed an invalid userId', async () => {
      const result = await agent
        .put('/rest/rooms/leave')
        .send({
          roomId: testRooms[0].id,
          userId: 12345,
        })
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(400);
      expect(result.body).to.be.an('object');
      expect(result.body.error).to.equal('An invalid uuid userId was passed to leave room route.');
    });

    it('should return a 404 status and error when passed a valid uuid that does not exist', async () => {
      const randomId = uuidv4();
      const result = await agent
        .put('/rest/rooms/leave')
        .send({
          roomId: randomId,
          userId: testUser.id,
        })
        .set({ Authorization: `Bearer: ${token}` });
      expect(result.status).to.equal(404);
      expect(result.body).to.be.an('object');
      expect(result.body.error).to.equal('A valid uuid roomId was passed in leave room route but returned no match.');
    });
  });

  // remove test rooms, users and joins
  after(async () => {
    await removeUsersFromRooms();
    await removeTestRooms(NUMBER_OF_ROOMS);
    await removeTestUser(testUser.email);
    await removeTestUser(testUser2.email);
  });
});
