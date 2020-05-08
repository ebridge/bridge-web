const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }

  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    req.userId = decoded.id;
    return next();
  });
};

module.exports = isAuthenticated;
