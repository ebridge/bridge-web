const knex = require('../postgres/knex').getKnex();
const { USERS } = require('./constants/tables');

const setUserPassword = async (id, hashedPassword) => {
  await knex(USERS)
    .where({ id })
    .update({ password_hash: hashedPassword });
};

module.exports = setUserPassword;
