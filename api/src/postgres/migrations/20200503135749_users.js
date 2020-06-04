const { USERS } = require('../../lib/constants/tables');

exports.up = (knex) => knex.schema.createTable(USERS, (table) => {
  table.uuid('id').primary();

  table.string('email').unique().notNullable();
  table.boolean('email_confirmed').defaultTo(false).notNullable();
  table.string('display_name').unique().notNullable();
  table.string('password_hash').notNullable();

  // User info
  table.string('first_name').nullable();
  table.string('last_name').nullable();
  table.date('birth_date').nullable();
  table.text('bio').nullable();

  // User ban info
  table.boolean('is_banned').defaultTo(false).notNullable();
  // TODO: has-many relation with ban types
  // (e.g. global-muted, room-muted, private-muted, global-banned, room-banned, private-banned)
  table.timestamp('banned_at').nullable();
  table.timestamp('banned_until').nullable();

  // Use logical deletion (persist user in db, but have them deleted in application)
  table.boolean('deleted').defaultTo(false).notNullable();
  table.timestamp('deleted_at').nullable();

  // Timestamps
  table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
});

exports.down = (knex) => knex.schema.dropTable('users');
