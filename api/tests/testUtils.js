/* eslint-disable import/no-extraneous-dependencies */
const faker = require('faker');
const { getKnex } = require('../src/postgres/knex');
const { USERS } = require('../src/lib/constants/tables');
const logger = require('../src/lib/logger');

const generateTestUser = () => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  displayName: faker.internet.userName(),
});

const removeTestUser = email => {
  const knex = getKnex();
  if (!email) {
    return logger.error('No email passed to removeTestUser.');
  }
  return knex(USERS).where('email', email).del();
};

module.exports = {
  generateTestUser,
  removeTestUser,
};
