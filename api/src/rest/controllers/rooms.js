const express = require('express');
const knex = require('../../postgres/knex').getKnex();

const { TABLES } = require('../../lib/constants/tables');
const { JOIN_USERS_AND_ROOMS } = require('../../lib/constants/joinTables');
const {
  ServerError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require('../../lib/errors');
const logger = require('../../lib/logger')(module);

const router = express.Router();

module.exports = router;
