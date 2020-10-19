const { ROOMS } = require('../../lib/constants/tables');

exports.up = (knex) => knex.schema.createTable(ROOMS, (table) => {
  table.uuid('id').primary();
  table.integer('room_number').unique().notNullable();

  // Use logical deletion (persist room in db, but have them deleted in application)
  table.boolean('deleted').defaultTo(false).notNullable();
  table.timestamp('deleted_at').nullable();

  // Timestamps
  table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
});

exports.down = (knex) => knex.schema.dropTable(ROOMS);
