const express = require('express');
const usersRoutes = require('./controllers/users');

const router = express.Router();

router.use('/users', usersRoutes);

module.exports = router;
