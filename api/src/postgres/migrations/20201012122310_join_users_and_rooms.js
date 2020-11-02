const { JOIN_USERS_AND_ROOMS } = require('../../lib/constants/joinTables');
const { USERS, ROOMS } = require('../../lib/constants/tables');


exports.up = (knex) => knex.schema.createTable(JOIN_USERS_AND_ROOMS, (table) => {
  table.uuid('id').primary();
  table.enu('seat', ['N', 'E', 'S', 'W']).notNull();

  // Join users table
  const USER_ID = 'user_id';
  table.uuid(USER_ID).notNull();
  table.foreign(USER_ID).references(`${USERS}.id`);

  // Rooms table
  const ROOM_ID = 'room_id';
  table.uuid(ROOM_ID).notNull();
  table.foreign(ROOM_ID).references(`${ROOMS}.id`);

  table.unique([USER_ID, ROOM_ID]);
  table.unique(['seat', ROOM_ID]);
});

exports.down = (knex) => knex.schema.dropTable(JOIN_USERS_AND_ROOMS);
