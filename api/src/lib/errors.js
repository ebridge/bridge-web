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
  constructor(message, uiMessage) {
    super(message || 'Unauthorized', uiMessage || 'Unauthorized.', 401);
  }
}

class NotFoundError extends ServerError {
  constructor(message, uiMessage) {
    super(message || 'Not found.', uiMessage || 'Not found.', 404);
  }
}

class ConflictError extends ServerError {
  constructor(message, uiMessage) {
    super(message || 'Duplicate display name or email.', uiMessage || 'Duplicate display name or email.', 409);
  }
}


module.exports = {
  ServerError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
};
