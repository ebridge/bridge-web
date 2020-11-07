const jwt = require('jsonwebtoken');

function signJWToken(id, remember) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: remember ? process.env.REMEMBER_JWT_EXPIRE_TIME : process.env.JWT_EXPIRE_TIME,
  });
}

function signEmailJWToken(id) {
  return jwt.sign({ id }, process.env.JWT_EMAIL_SECRET, {
    expiresIn: process.env.JWT_EMAIL_EXPIRE_TIME,
  });
}

module.exports = {
  signJWToken,
  signEmailJWToken,
};
