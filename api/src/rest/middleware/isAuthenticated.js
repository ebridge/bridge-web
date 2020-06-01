const jwt = require('jsonwebtoken');
const knex = require('../../postgres/knex').getKnex();
const { USERS } = require('../../lib/constants/tables');
const logger = require('../../lib/logger');

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const handleError = error => {
    logger.error(error);
    res.status(403).send({ error });
    return next();
  };

  if (!authHeader) {
    return handleError('No authorization header on request');
  }

  const token = authHeader.split(' ')[1];
  return jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) => {
    if (error) {
      return handleError('Invalid token');
    }
    // Compare token expiry (seconds) to current time (in ms) - bail out if token has expired
    if (decodedToken.exp <= Date.now() / 1000) {
      return handleError('Expired token');
    }
    const [user] = await knex.from(USERS).select('*').where({ id: decodedToken.id });
    req.user = user;
    return next();
  });
};

module.exports = isAuthenticated;
