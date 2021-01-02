const express = require('express');
const usersRoutes = require('./controllers/users');
const roomsRoutes = require('./controllers/rooms');
const logger = require('../lib/logger')(module);

const router = express.Router();

// /rest/*
router.use('/users', usersRoutes);
router.use('/rooms', roomsRoutes);
router.get('/ping', (req, res) => {
  logger.debug('Ping hit!');
  res.status(200)
  return res.end('pong');
});

module.exports = router;
