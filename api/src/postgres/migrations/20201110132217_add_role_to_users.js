const { USERS } = require('../../lib/constants/tables');

exports.up = knex => knex.schema.table(USERS, table => {
  table.enu('role', ['free', 'subscriber', 'moderator', 'admin']).defaultTo('free');
});

exports.down = knex => knex.schema.table(USERS, table => {
  table.dropColumn('role');
});
