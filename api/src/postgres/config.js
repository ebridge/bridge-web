const postgresConfig = {
  user: process.env.PG_USER,
  // Use docker host when connecting to host through docker alias
  host: process.env.PG_DOCKER_HOST || process.env.PG_HOST,
  database: process.env.PG_DB_NAME,
  password: process.env.PG_PASSWORD,
  // Use docker port when connecting to host through docker alias
  port: process.env.PG_DOCKER_PORT || process.env.PG_PORT,
};

module.exports = postgresConfig;
