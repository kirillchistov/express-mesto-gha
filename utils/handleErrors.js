//  Константы для обработки ошибок  //
//  Перед отправкой проверяем ошибки  //

//  Ответ с ошибкой должен быть единообразен  //
const handleErrors = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
};
module.exports = handleErrors;
