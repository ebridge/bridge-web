const { Pool } = require('pg');
const config = require('./postgres_config');
const logger = require('../lib/logger');

let postgres;

async function initPostgres() {
  try {
    // Postgres client
    const pgClient = new Pool({ ...config });
    pgClient.on('error', () => console.log('Lost Postgres connection'));
    pgClient
      .query(
        `
      CREATE TABLE IF NOT EXISTS items (
        id uuid,
        item_name TEXT NOT NUll,
        complete BOOLEAN DEFAULT false,
        PRIMARY KEY (id)
      )
    `
      )
      .catch((err: Error) => console.log(err));
    logger.log(
      `MongoDB is connected to host: ${config.host}:${config.port} to database ${config.database}`
    );
  } catch (err) {
    logger.error('Unable to connect to Mongo.', err);
  }
}

module.exports = {
  initPostgres,
  postgres,
};
