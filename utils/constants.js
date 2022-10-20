//  Константы с кодами ошибок (используются в handleErrors)  //
//  400 — некорректные данные при создании card, user, avatar, profile  //
//  404 — карточка или пользователь не найден  //
//  500 — ошибка по-умолчанию  //

const INCORRECT_DATA_ERROR = 400;
const NO_DATA_ERROR = 404;
const DEFAULT_ERROR = 500;

module.exports = {
  INCORRECT_DATA_ERROR,
  NO_DATA_ERROR,
  DEFAULT_ERROR,
};
