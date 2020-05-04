const Knex = require('knex');
const { config } = require('../../knexfile');
const logger = require('../lib/logger')(module);

let knex;

async function initializeKnex() {
  try {
    knex = Knex(config);

    try {
      await knex('knex_migrations').select('*').first();
    } catch (error) {
      logger.error('Knex can not query migrations, have they been run?', { error });
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
