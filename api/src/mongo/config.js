const mongoConfig = {
  username: process.env.MONGO_USER,
  // Use docker host when connecting to host through docker alias
  host: process.env.MONGO_HOST || process.env.MONGO_DOCKER_HOST,
  database: process.env.MONGO_DB_NAME,
  password: process.env.MONGO_PASSWORD,
  // Use docker port when connecting to host through docker alias
  port: process.env.MONGO_DOCKER_PORT || process.env.MONGO_PORT,
};

module.exports = mongoConfig;
