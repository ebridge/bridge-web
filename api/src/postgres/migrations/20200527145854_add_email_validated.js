
const { USERS } = require('../../lib/constants/tables');

exports.up = (knex) => knex.schema.table(USERS, (table) => {
  table.boolean('email_validated');
});

exports.down = (knex) => knex.schema.table(USERS, (table) => {
  table.dropColumn('email_validated');
});
