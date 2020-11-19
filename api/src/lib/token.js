const jwt = require('jsonwebtoken');

function signJWToken(id, remember) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: remember ? process.env.REMEMBER_JWT_EXPIRE_TIME : process.env.JWT_EXPIRE_TIME,
  });
}

function signVerifyEmailJWToken(id) {
  return jwt.sign({ id }, process.env.JWT_VERIFY_EMAIL_SECRET, {
    expiresIn: process.env.JWT_VERIFY_EMAIL_EXPIRE_TIME,
  });
}

function signResetPasswordJWToken(id) {
  return jwt.sign({ id }, process.env.JWT_RESET_PASSWORD_SECRET, {
    expiresIn: process.env.JWT_RESET_PASSWORD_EXPIRE_TIME,
  });
}

module.exports = {
  signJWToken,
  signVerifyEmailJWToken,
  signResetPasswordJWToken,
};
