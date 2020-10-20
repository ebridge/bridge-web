/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const { v4: uuidv4 } = require('uuid');
const {
  agent,
  generateTestUser,
  removeTestUser,
  uuidv4RegExp,
} = require('./testUtils');

let testUser;
let token;
let id;

describe('/rest/users', () => {
  // create test user
  before(() => {
    testUser = generateTestUser();
  });

  // Register
  describe('POST /register', () => {
    it('should register a new user and return a valid uuidv4 and matching display name', async () => {
      const result = await agent
        .post('/rest/users/register')
        .send(testUser);
      expect(result.status).to.equal(200);
      expect(result.error).to.equal(false);
      expect(result.body.id).to.match(uuidv4RegExp);
      expect(result.body.displayName).to.equal(testUser.displayName);
      id = result.body.id;
    });

    it('should return the correct status and error when passed a duplicate user email', async () => {
      const result = await agent
        .post('/rest/users/register')
        .send(testUser);
      expect(result.status).to.equal(409);
      expect(result.body.error).to.equal('Duplicate email found.');
    });

    it('should return the correct status and error when passed a duplicate user displayName', async () => {
      const newTestUser = generateTestUser();
      newTestUser.displayName = testUser.displayName;
      const result = await agent
        .post('/rest/users/register')
        .send(newTestUser);
      expect(result.status).to.equal(409);
      expect(result.body.error).to.equal('Duplicate display name found.');
    });
  });

  // Login
  describe('POST /login', () => {
    it('should login the newly registered user and return a userView', async () => {
      const result = await agent
        .post('/rest/users/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });
      expect(result.status).to.equal(200);
      expect(result.error).to.equal(false);
      expect(result.body.token).to.be.a('string');
      token = result.body.token;
    });
    it('should return the correct status and error when passed an incorrect password', async () => {
      const result = await agent
        .post('/rest/users/login')
        .send({
          email: testUser.email,
          password: `${testUser.password}x`,
        });
      expect(result.status).to.equal(401);
      expect(result.body).to.be.an('object');
      expect(result.body.uiError).to.equal('Invalid email or password.');
    });
    it('should return the correct status and error when passed incomplete login data', async () => {
      const result = await agent
        .post('/rest/users/login')
        .send({
          email: null,
          password: null,
        });
      expect(result.status).to.equal(401);
      expect(result.body).to.be.an('object');
      expect(result.body.uiError).to.equal('Email and password are required to login.');
    });
  });

  // Authenticate
  describe('GET /authenticate', () => {
    it('should confirm the user is authenticated by returning displayName', async () => {
      const result = await agent
        .get('/rest/users/authenticate')
        .set({ Authorization: `Bearer ${token}` });
      expect(result.status).to.equal(200);
      expect(result.error).to.equal(false);
      expect(result.body).to.have.property('displayName');
      expect(result.body.displayName).to.equal(testUser.displayName);
    });
    // Authenticate while unauthenticated
    it('should return an unauthorized error when passed a null Auth header', async () => {
      const result = await agent
        .get('/rest/users/authenticate');
      expect(result.status).to.equal(401);
      expect(result.body.uiError).to.equal('Unauthorized.');
    });
  });

  // GET user by ID or displayName
  describe('GET /:idOrDisplayName', () => {
    it('should return a userView when passed a valid userId', async () => {
      const result = await agent
        .get(`/rest/users/${id}`)
        .set({ Authorization: `Bearer ${token}` });
      expect(result.status).to.equal(200);
      expect(result.error).to.equal(false);
      expect(result.body).to.be.an('object');
      expect(result.body).to.have.property('displayName');
      expect(result.body.displayName).to.equal(testUser.displayName);
    });

    it('should return an unauthorized error when passed a null Auth header', async () => {
      const result = await agent
        .get(`/rest/users/${id}`);
      expect(result.status).to.equal(401);
      expect(result.body.uiError).to.equal('Unauthorized.');
    });

    it('should return the correct error when passed an invalid idOrDisplayName', async () => {
      const randomId = uuidv4();
      const result = await agent
        .get(`/rest/users/${randomId}`)
        .set({ Authorization: `Bearer ${token}` });
      expect(result.status).to.equal(404);
      expect(result.body.error).to.equal('No user found with that id or displayName.');
    });
  });

  // PUT User by ID or displayName
  describe('PUT /:idOrDisplayName', () => {
    it('should return a userView with the updated user bio', async () => {
      const bio = 'New test bio.';

      const result = await agent
        .put(`/rest/users/${id}`)
        .set({ Authorization: `Bearer ${token}` })
        .send({
          id,
          profile: { bio },
        });
      expect(result.status).to.equal(200);
      expect(result.error).to.equal(false);
      expect(result.body).to.be.an('object');
      expect(result.body).to.have.property('bio');
      expect(result.body.bio).to.equal(bio);
    });

    it('should return an unauthorized error when passed a null Auth header', async () => {
      const result = await agent
        .get(`/rest/users/${id}`);
      expect(result.status).to.equal(401);
      expect(result.body.uiError).to.equal('Unauthorized.');
    });

    it('should return the correct error when passed an invalid idOrDisplayName', async () => {
      const randomId = uuidv4();
      const result = await agent
        .get(`/rest/users/${randomId}`)
        .set({ Authorization: `Bearer ${token}` });
      expect(result.status).to.equal(404);
      expect(result.body.error).to.equal('No user found with that id or displayName.');
    });
  });

  after(async () => {
    await removeTestUser(testUser.email);
  });
});
