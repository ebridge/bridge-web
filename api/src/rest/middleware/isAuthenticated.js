const jwt = require('jsonwebtoken');
const knex = require('../../postgres/knex').getKnex();
const { USERS } = require('../../lib/constants/tables');
const { userView } = require('../views/userViews');
const logger = require('../../lib/logger')(module);
const { UnauthorizedError } = require('../../lib/errors');

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const handleError = error => {
    logger.error(error);
    return next(new UnauthorizedError(error));
  };

  if (!authHeader) {
    return handleError('Must include Auth Header');
  }

  const token = authHeader.split(' ')[1];
  return jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) => {
    if (error) {
      return handleError('Invalid token');
    }
    // Compare token expiry (seconds) to current time (in ms) - bail out if token has expired
    if (decodedToken.exp <= Date.now() / 1000) {
      // TODO: handle expiration on front end - redirect to login page
      return res.end();
    }
    const [dbUser] = await knex(USERS)
      .select('*')
      .where({ id: decodedToken.id });
    if (!dbUser) {
      return handleError(`User with id ${decodedToken.id} does not exist.`);
    }
    const user = userView(dbUser);
    req.user = user;
    return next();
  });
};

module.exports = isAuthenticated;
