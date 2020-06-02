const logger = require('../../lib/logger')(module);

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);
  return next(res.status(error.httpStatus).json({
    error: error.message,
    uiError: error.uiMessage,
  }));
};

module.exports = errorHandler;
