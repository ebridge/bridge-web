const { expect } = require('chai');
const request = require('supertest');
const faker = require('faker');
const expressApp = require('../src/server').app;

const agent = request.agent(expressApp);
const fakeUser = {
  email: faker.name.findName(),
  password: faker.internet.password(),
  displayName: faker.internet.userName(),
}

describe('/rest/users', () => {
  // Register
  describe('POST /register', () => {
    it('should register a new user', async () => {
      const result = await agent
        .post('/rest/users/register')
        .send(fakeUser);
    });
  });

  // Login
  describe('POST /login', () => {
    it('should login the newly registered user', async () => {
      const result = await agent
        .post('/rest/users/login')
        .send({
          email: fakeUser.email,
          password: fakeUser.password,
        })
    })
  })
});
