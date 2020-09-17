exports.up = knex => {
  knex.raw(`
    CREATE OR REPLACE FUNCTION on_update_timestamp()
    RETURNS trigger AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
  $$ language 'plpgsql';
  `);
};

exports.down = knex => {
  knex.raw('DROP FUNCTION on_update_timestamp');
};
