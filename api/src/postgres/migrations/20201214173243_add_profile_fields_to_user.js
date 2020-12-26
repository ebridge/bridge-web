const { USERS } = require('../../lib/constants/tables');

exports.up = knex => knex.schema.table(USERS, table => {
  table.string('name').nullable();
  table.string('conventions').nullable();
  table.string('location').nullable();
  table.boolean('birth_date_is_private').defaultTo(false).notNullable();
});

exports.down = knex => knex.schema.table(USERS, table => {
  table.dropColumn('name');
  table.dropColumn('conventions');
  table.dropColumn('location');
  table.dropColumn('birth_date_is_private');
});
