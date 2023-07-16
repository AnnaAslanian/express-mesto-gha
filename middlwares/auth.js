const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const jwtToken = req.cookies.token;
  let payload;
  try {
    payload = jwt.verify(jwtToken, 'very-secret-key');
  } catch (err) {
    return UnauthorizedError(res);
  }
  req.user = payload;
  next();
};

module.exports = auth;
