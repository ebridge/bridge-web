const Knex = require('knex');
const { config } = require('../../knexfile');
const logger = require('../lib/logger')(module);

let knex;

async function initializeKnex() {
  try {
    knex = Knex(config);

    try {
      if (typeof process.env.RUN_MIGRATIONS_ON_START !== 'undefined') {
        logger.info('Running migrations...');
        try {
          await knex.migrate.latest();
        } catch (error) {
          logger.error('Error running migrations. Exiting...', { error });
          process.exit(1);
        }
        logger.info('Migrations ran sucessfully!');
      }
      await knex('knex_migrations').select('*').first();
    } catch (error) {
      logger.error('Knex can not query migrations, have they been run? Exiting...', { error });
      process.exit(1);
    }
  } catch (error) {
    logger.error('Error starting Knex. Exiting...', { error });
    process.exit(1);
  }

  return knex;
}

function getKnex() {
  if (!knex) {
    logger.warn('Knex was called before being initialized');
    throw Error('Knex is not initialized. Call initializeKnex');
  }
  return knex;
}

module.exports = {
  initializeKnex,
  getKnex,
};
