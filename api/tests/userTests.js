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
let token;

describe('/rest/users', () => {
  // Register
  describe('POST /register', () => {
    it('should register a new user', async done => {
      const result = await agent
        .post('/rest/users/register')
        .send(fakeUser);
      expect(result).status(200);
      expect(result.error).to.be(null);
      done();
    });
  });

  // Login
  describe('POST /login', () => {
    it('should login the newly registered user', async done => {
      const result = await agent
        .post('/rest/users/login')
        .send({
          email: fakeUser.email,
          password: fakeUser.password,
        })
        expect(result).status(200);
        token = result.token;
        done();
    })
  })

  // Authenitcate
  describe('GET /authenticate', () => {
    it('should authenticate the logged in user', async done => {
      const result = await agent
        .get('/rest/users/authenticate')
        .set({ Authorization: `Bearer ${token}`})
      expect(result).status(200);
      expect(result).should.be.an('object');
      expect(result).should.have.property('displayName');
      expect(result.displayName).to.equal(fakeUser.displayName);
      done()
    })
  })
});
