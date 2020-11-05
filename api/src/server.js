require('../loadEnv')();

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initSocket } = require('./socket');
const logger = require('./lib/logger')(module);
const errorHandler = require('./rest/middleware/errorHandler');

const { initializeKnex } = require('./postgres/knex');
const { scaleNumberOfRoomsUpTo } = require('./services/scaleRooms');
const { initializeRedis } = require('./redis');

logger.info('Initalizing server.', { NODE_ENV: process.env.NODE_ENV });

let listeningApp;
const app = express();
const getAsyncExports = () => ({ listeningApp });

// Use an async entry point
async function entryPoint() {
  // Initialize postgres query builder, Knex
  await initializeKnex();

  // Create initial rooms in DB if they don't already exist
  await scaleNumberOfRoomsUpTo(process.env.DEFAULT_NUMBER_OF_ROOMS);

  // Initialize Express server
  app.use(cors());
  app.use(bodyParser.json());
  // eslint-disable-next-line global-require
  app.use('/rest', require('./rest/routes'));
  app.use(errorHandler);

  // Start Server
  let port = process.env.API_PORT || 3001;
  if (process.NODE_ENV === 'test') {
    port = process.env.TEST_API_PORT;
  }
  const server = http.createServer(app);

  const ioAdapter = initializeRedis();
  initSocket(server, ioAdapter);

  listeningApp = server.listen(port, () => {
    app.emit('started');
    logger.info(`Server up and running on port ${port}`);
  });
}

// Start server
entryPoint();

module.exports = {
  app,
  getAsyncExports,
};
