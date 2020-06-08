const jwt = require('jsonwebtoken');
const knex = require('../../postgres/knex').getKnex();
const { USERS } = require('../../lib/constants/tables');
const { USER_SELECTS } = require('../../lib/constants/selects');
const logger = require('../../lib/logger')(module);
const { UnauthorizedError } = require('../../lib/errors');

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const handleError = error => {
    logger.error(error);
    next(new UnauthorizedError(error));
    return next();
  };

  if (!authHeader) {
    return res.end();
  }

  const token = authHeader.split(' ')[1];
  return jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) => {
    if (error) {
      return handleError('Invalid token');
    }
    // Compare token expiry (seconds) to current time (in ms) - bail out if token has expired
    if (decodedToken.exp <= Date.now() / 1000) {
      return res.end();
    }
    const [user] = await knex(USERS)
      .select(USER_SELECTS)
      .where({ id: decodedToken.id });
    req.user = user;
    return next();
  });
};

module.exports = isAuthenticated;
