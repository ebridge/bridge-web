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
  describe('POST /register', () => {
    it('should register a new user', async () => {
      const result = await agent
        .post('/rest/users/register')
        .send(fakeUser);
    });
  });
});
