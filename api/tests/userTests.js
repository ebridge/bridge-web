const { expect } = require('chai');
const request = require('supertest');
const expressApp = require('../src/server').app;

const agent = request.agent(expressApp);

describe('/rest/users', () => {
  describe('POST /register', () => {
    it('should register a new user', async () => {
      const result = await agent
        .post('/rest/users/register')
        .send({
          email: 'fake@fakedomain.com',
          password: '1234',
          displayName: 'FakeUser',
        });
    });
  });
});
