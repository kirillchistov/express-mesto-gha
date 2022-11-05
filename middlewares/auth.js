const jwt = require('jsonwebtoken');
const { TOKEN_ENCRYPT_KEY } = require('../utils/constants');
const UnauthorizedError = require('../utils/errors/unauthorized-error');

const auth = (req, res, next) => {
  const { authorization } = req.cookies;

  if (!authorization) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer', '');
  let payload;

  try {
    payload = jwt.verify(token, TOKEN_ENCRYPT_KEY);
    if (!payload) {
      return next(new UnauthorizedError('Необходимы права доступа'));
    }
  } catch (err) {
    throw next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;

  next();
};

module.exports = auth;
