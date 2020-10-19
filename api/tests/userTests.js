/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const {
  agent,
  generateTestUser,
  removeTestUser,
  uuidv4RegExp,
} = require('./testUtils');

let token;
let testUser;

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
    });
  });

  // Login
  describe('POST /login', () => {
    it('should login the newly registered user by returning a token', async () => {
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
    it('should return an unauthorized error when passed an incorrect password', async () => {
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
    it('should return an error when passed incomplete data', async () => {
      const result = await agent
        .post('/rest/users/login')
        .send({
          email: testUser.email,
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

  after(async () => {
    await removeTestUser(testUser.email);
  });
});
