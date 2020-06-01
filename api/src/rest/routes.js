const express = require('express');
const usersRoutes = require('./controllers/users');

const router = express.Router();

// /rest/users
router.use('/users', usersRoutes);

module.exports = router;
