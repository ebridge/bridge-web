/* eslint-disable import/no-extraneous-dependencies */
const faker = require('faker');

const generateFakeUser = () => ({
  email: faker.name.findName(),
  password: faker.internet.password(),
  displayName: faker.internet.userName(),
});


module.exports = {
  generateFakeUser,
};
