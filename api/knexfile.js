require('./loadEnv')();

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
  migrations: {
    directory: './src/postgres/migrations',
  },
  // seeds: { directory: './data/seeds' },
};

if (process.env.NODE_ENV !== 'migrate' && process.env.NODE_ENV !== 'migrate_docker') {
  // eslint-disable-next-line global-require
  const logger = require('./src/lib/logger')(module);
  config.log = {
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
  };
}

if (process.env.NODE_ENV === 'migrate_docker') {
  config.connection = {
    host: 'localhost',
    port: 5477,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB_NAME,
  };
}

if (process.env.NODE_ENV === 'test') {
  config.connection = {
    host: process.env.TEST_PG_HOST,
    port: process.env.TEST_PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.TEST_PG_DB_NAME,
  };
}

module.exports = {
  config,
  migrate: config,
  migrate_docker: config,
  dev: config,
  test: config,
  production: config,
};
