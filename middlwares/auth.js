const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  const jwtToken = req.cookies.token;
  let payload;
  try {
    payload = jwt.verify(jwtToken, 'very-secret-key');
  } catch (err) {
    next(new UnauthorizedError('Вы не авторизированы'));
  }
  req.user = payload;
  next();
};

module.exports = auth;
