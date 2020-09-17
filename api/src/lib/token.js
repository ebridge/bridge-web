const jwt = require('jsonwebtoken');

function signJWToken(id, remember) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: remember ? process.env.REMEMBER_JWT_EXPIRE_TIME : process.env.JWT_EXPIRE_TIME,
  });
}

module.exports = signJWToken;
