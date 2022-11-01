const jwt = require('jsonwebtoken');
const TOKEN_ENCRYPT_KEY = require('../utils/constants');
const { ErrorCodes } = require('../utils/errors/error-codes');

module.exports = (req, res, next) => {
//  if (!token) { res.status(401).send({ message: 'Необходима авторизация' }); }  //
  let payload;
  try {
    const token = req.cookies.jwt;
    payload = jwt.verify(token, TOKEN_ENCRYPT_KEY);
  } catch (err) {
    next(new ErrorCodes.UNAUTHORIZED_ERROR('Необходима авторизация'));
    return;
  }
  req.user = payload;
  next();
};
