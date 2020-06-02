/* eslint-disable max-classes-per-file */
class ServerError extends Error {
  constructor(message, uiMessage, httpStatus) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message || 'Something went wrong. Please try again.';
    this.uiMessage = uiMessage || message || 'Something went wrong. Please try again.';
    this.httpStatus = httpStatus || 500;
  }
}

class UnauthorizedError extends ServerError {
  constructor(message) {
    super(message || 'Unauthorized.', 401);
  }
}

class NotFoundError extends ServerError {
  constructor(message) {
    super(message || 'Not found.', 404);
  }
}

class ConflictError extends ServerError {
  constructor(message) {
    super(message || 'Duplicate username or email.', 409);
  }
}


module.exports = {
  ServerError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
};
