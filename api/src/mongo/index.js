const mongoose = require('mongoose');
const config = require('./config');
const logger = require('../lib/logger')(module);

let mongo;

// TODO: Opts in env
const options = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  connectTimeoutMS: 10000,
};

const connectionString = `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}?authSource=admin`;

async function initializeMongoose() {
  try {
    mongo = await mongoose.connect(connectionString, options);
    logger.info(`MongoDB is connected to host: ${config.host}:${config.port} to database ${config.database}`);
  } catch (err) {
    logger.error('Unable to connect to Mongo.', err);
  }
}

function getMongoose() {
  if (!mongo) {
    logger.warn('getMongo was called before being initialized');
    throw Error('Mongo is not initialized. Call initializeMongo');
  }
  return mongo;
}

module.exports = {
  initializeMongoose,
  getMongoose,
};
