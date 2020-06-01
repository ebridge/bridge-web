require('../loadEnv')();

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('./lib/logger')(module);

const { initializeKnex } = require('./postgres/knex');

logger.info('Initalizing server.', { NODE_ENV: process.env.NODE_ENV });

// Use an async entry point
async function entryPoint() {
  // Initialize postgres query builder, Knex
  await initializeKnex();

  // Initialize Express server
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(cookieParser());

  // eslint-disable-next-line global-require
  app.use('/rest', require('./rest/routes'));


  // Start Server
  const port = process.env.API_PORT || 3001;
  const server = http.createServer(app);
  server.listen(port, () => logger.info(`Server up and running on port ${port}`));
}

// Start server
entryPoint();
