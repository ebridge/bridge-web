require('../loadEnv')();

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketInit = require('socket.io');
const logger = require('./lib/logger')(module);
const errorHandler = require('./rest/middleware/errorHandler');

const { initializeKnex } = require('./postgres/knex');

logger.info('Initalizing server.', { NODE_ENV: process.env.NODE_ENV });

let listeningApp;
const app = express();
const getAsyncExports = () => ({ listeningApp });

// Use an async entry point
async function entryPoint() {
  // Initialize postgres query builder, Knex
  await initializeKnex();

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

  // Init Socket
  // TEMP messages
  const messages = [
    {
      user: 'Test',
      message: 'Test Message',
      timestamp: Date.now(),
    },
    {
      user: 'Ethan',
      message: 'Hello',
      timestamp: Date.now(),
    },
    {
      user: 'Evan',
      message: 'Oh hello',
      timestamp: Date.now(),
    },
    {
      user: 'Ethan',
      message: 'how are you?',
      timestamp: Date.now(),
    },
    {
      user: 'Evan',
      message: 'great',
      timestamp: Date.now(),
    },
    {
      user: 'Evan',
      message: 'send help',
      timestamp: Date.now(),
    },
  ];
  const io = socketInit(server);
  io.on('connection', socket => {
    socket.on('global_message', payload => {
      messages.push(payload);
      io.emit('global_message', payload);
    });
    io.emit('global_messages', messages);
  });

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
