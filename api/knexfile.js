require('./loadEnv')();
const logger = require('./src/lib/logger')(module);

const config = {
  debug: false,
  client: 'pg',
  version: process.env.PG_VERSION,
  connection: {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB_NAME,
  },
  pool: {
    min: parseInt(process.env.PG_POOL_MIN, 10) || 2,
    max: parseInt(process.env.PG_POOL_MAX, 10) || 10,
  },
  log: {
    warn(message) {
      logger.warn('knexWarn', { customInput: { message } });
    },
    error(message) {
      logger.error('knexError', { customInput: { message } });
    },
    deprecate(message) {
      logger.knex('knexDeprecate', { customInput: { message } });
    },
    debug(message) {
      logger.knex('knexDebug', { customInput: { message } });
    },
  },
  migrations: {
    directory: './src/postgres/migrations',
  },
  // seeds: { directory: './data/seeds' },
};

module.exports = {
  config,
  dev: config,
  test: config,
  production: config,
};
