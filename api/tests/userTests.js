/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const request = require('supertest');
const expressApp = require('../src/server').app;
const { generateFakeUser } = require('./testUtils');

const agent = request.agent(expressApp);
const fakeUser = generateFakeUser();
let token;

describe('/rest/users', () => {
  // Register
  describe('POST /register', () => {
    it('should register a new user and return a token', async () => {
      const result = await agent
        .post('/rest/users/register')
        .send(fakeUser);
      expect(result.status).to.equal(200);
      expect(result.error).to.equal(false);
      expect(result.body.token).to.be.a('string');
      expect(result.body.displayName).to.equal(fakeUser.displayName);
      token = result.body.token;
    });
  });

  // Login
  describe('POST /login', () => {
    it('should login the newly registered user by returning a token', async () => {
      const result = await agent
        .post('/rest/users/login')
        .send({
          email: fakeUser.email,
          password: fakeUser.password,
        });
      expect(result.status).to.equal(200);
      expect(result.error).to.equal(false);
      expect(result.body.token).to.be.a('string');
      expect(result.body.token).to.equal(token);
    });
    it('should return an unauthorized error when passed an incorrect password', async () => {
      const result = await agent
        .post('/rest/users/login')
        .send({
          email: fakeUser.email,
          password: `${fakeUser.password}x`,
        });
      expect(result.status).to.equal(401);
      expect(result.body).to.be.an('object');
      expect(result.body.uiError).to.equal('Invalid email or password.');
    });
    it('should return an error when passed incomplete data', async () => {
      const result = await agent
        .post('/rest/users/login')
        .send({
          email: fakeUser.email,
          password: null,
        });
      expect(result.status).to.equal(401);
      expect(result.body).to.be.an('object');
      expect(result.body.uiError).to.equal('Email and password are required to login.');
    });
  });

  // Authenitcate
  describe('GET /authenticate', () => {
    it('should confirm the user is authenticated by returning displayName', async () => {
      const result = await agent
        .get('/rest/users/authenticate')
        .set({
          Authorization: `Bearer ${token}`,
        });
      expect(result.status).to.equal(200);
      expect(result.error).to.equal(false);
      expect(result.body).to.have.property('displayName');
      expect(result.body.displayName).to.equal(fakeUser.displayName);
    });
    // Authenticate while unauthenticated
    it('should return an unauthorized error when passing null Auth header', async () => {
      const result = await agent
        .get('/rest/users/authenticate')
        .set({
          Authorization: null,
        });
      expect(result.status).to.equal(401);
      expect(result.body.uiError).to.equal('Unauthorized.');
    });
  });
});
