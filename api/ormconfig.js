const postgresConfig = require('./src/postgres/config');

module.exports = {
  type: 'postgres',
  ...postgresConfig,
  synchronize: false, // Generate and run migrations instead
  entities: [
    'src/postgres/entities/**/*.ts',
  ],
  migrationsTableName: 'migrations',
  migrations: [
    'src/postgres/migrations/**/*.ts',
  ],
  cli: {
    entitiesDir: 'src/postgres/entities',
    migrationsDir: 'src/postgres/migrations',
  },
};
