const { USERS, ROOMS } = require('../../lib/constants/tables');
const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async knex => {
  await knex.raw(onUpdateTrigger(USERS));
  return knex.raw(onUpdateTrigger(ROOMS));
};

exports.down = () => new Promise();
