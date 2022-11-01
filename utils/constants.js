//  Константы с кодами ошибок (используются в handleErrors)  //
//  400 — некорректные данные при создании card, user, avatar, profile  //
//  401 - ошибка авторизации  //
//  404 — карточка или пользователь не найден  //
//  409 — пользователь с таким email уже зарегистрирован  //
//  500 — ошибка по-умолчанию  //
//  ключик отсюда убираем  //

const INCORRECT_DATA_ERROR = 400;
const UNAUTHORIZED_ERROR = 401;
const NO_DATA_ERROR = 404;
const CONFLICT_ERROR = 409;
const DEFAULT_ERROR = 500;

const TOKEN_ENCRYPT_KEY = '💀';

module.exports.URL_REGEXP = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
module.exports.USER_ID_PATTERN = /[a-f0-9]/;
module.exports.CARD_ID_PATTERN = /[a-f0-9]{24,24}/;
module.exports.PASSWORD_PATTERN = /^[a-zA-Z0-9_]{3,30}$/;
module.exports = TOKEN_ENCRYPT_KEY;

module.exports = {
  INCORRECT_DATA_ERROR,
  UNAUTHORIZED_ERROR,
  NO_DATA_ERROR,
  CONFLICT_ERROR,
  DEFAULT_ERROR,
};
