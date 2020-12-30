const express = require('express');
const usersRoutes = require('./controllers/users');
const roomsRoutes = require('./controllers/rooms');
const logger = require('../lib/logger')(module);

const router = express.Router();

// /rest/*
router.use('/users', usersRoutes);
router.use('/rooms', roomsRoutes);
router.get('/healthcheck', (res) => {
  const result = 'ok';
  return res.status(200).send(result);
});
router.get('/ping', (res) => {
  logger.debug('Ping endput hit!');
  return res.status(200).send('pong');
});

module.exports = router;
