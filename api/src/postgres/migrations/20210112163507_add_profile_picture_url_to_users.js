const { USERS } = require('../../lib/constants/tables');

exports.up = knex => knex.schema.table(USERS, table => {
  table.string('profile_picture_url')
    .defaultTo('https://ebridge-images.nyc3.digitaloceanspaces.com/local/images/profile/ebridge-placeholder-profile.png')
    .notNullable();
  table.enu('profile_picture_status', ['placeholder', 'pending', 'set'])
    .defaultTo('placeholder')
    .notNullable();
});

exports.down = knex => knex.schema.table(USERS, table => {
  table.dropColumn('profile_picture_url');
  table.dropColumn('profile_picture_status');
});
