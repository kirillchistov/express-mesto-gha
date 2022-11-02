//  Константы для обработки ошибок  //
//  Перед отправкой проверяем ошибки  //
const {
  INCORRECT_DATA_ERROR, NO_DATA_ERROR, DEFAULT_ERROR,
} = require('./constants');

//  Ответ с ошибкой должен быть единообразен  //
module.exports.handleErrors = (err, res) => {
  if (err.name === 'CastError') {
    return res
      .status(INCORRECT_DATA_ERROR)
      .send({ message: 'Передан некорректный id' });
  }
  if (err.name === 'ValidationError') {
    return res
      .status(INCORRECT_DATA_ERROR)
      .send({ message: 'Переданы некорректные данные' });
  }
  return res
    .status(DEFAULT_ERROR)
    .send({ message: 'На сервере произошла ошибка' });
};

//  Обработка ошибки  //
module.exports.handleIdErrors = (obj, res) => {
  if (!obj) {
    res.status(NO_DATA_ERROR).send({ message: 'Объект не найден' });
    return;
  }
  res.send(obj);
};
