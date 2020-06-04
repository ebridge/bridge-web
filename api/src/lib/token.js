const jwt = require('jsonwebtoken');

function signJWToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
}

module.exports = signJWToken;
