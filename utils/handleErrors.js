//  Константы для обработки ошибок  //
const { INCORRECT_DATA_ERROR, NO_DATA_ERROR, DEFAULT_ERROR } = require('./constants');

module.exports.handleErrors = (err, res) => {
  if (err.name === 'CastError') {
    return res
      .status(INCORRECT_DATA_ERROR)
      .send({ message: 'Объект не найден', err });
  }
  if (err.name === 'ValidationError') {
    return res
      .status(INCORRECT_DATA_ERROR)
      .send({ message: 'Переданы некорректные данные', err });
  }
  return res
    .status(DEFAULT_ERROR)
    .send({ message: 'На сервере произошла ошибка', err });
};

module.exports.handleIdErrors = (obj, res) => {
  if (!obj) {
    res.status(NO_DATA_ERROR).send({ message: 'Объект не найден' });
    return;
  }
  res.send(obj);
};
