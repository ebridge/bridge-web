const mongoose = require('mongoose');
const config = require('./mongo_config');
const logger = require('../lib/logger');

let mongo;

// TODO: Opts
const options = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  connectTimeoutMS: 10000,
};

const connectionString = `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}?authSource=admin`;

async function initMongo() {
  try {
    mongo = await mongoose.connect(connectionString, options);
    logger.log(
      `MongoDB is connected to host: ${config.host}:${config.port} to database ${config.database}`
    );
  } catch (err) {
    logger.error('Unable to connect to Mongo.', err);
  }
}

module.exports = {
  initMongo,
  mongo,
};
