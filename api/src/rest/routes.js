const express = require('express');
const usersRoutes = require('./controllers/users');
const roomsRoutes = require('./controllers/rooms');

const router = express.Router();

// /rest/*
router.use('/users', usersRoutes);
router.use('/rooms', roomsRoutes);

module.exports = router;
