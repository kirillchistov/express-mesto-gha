//  Поля схемы пользователя  //
//  bcrypt - для хеширования и сверки пароля  //
//  UNAUTHORIZED_ERROR - класс ошибок авторизации  //

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { ErrorCodes } = require('../utils/errors/error-codes');
//  const { REGEX_URL } = require('../utils/constants');  //

//  14.1 Добавляем в схему пользователя уник. email и пароль  //
//  14.1 validator - модуль валидации для email и avatar url  //
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: validator.isURL,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
}, { versionKey: false });

//  Делаем поиск по email как в тренажере  //
//  Надо добавить обработку ошибок отдельным классом  //
userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) { return Promise.reject(new ErrorCodes.UNAUTHORIZED_ERROR('Неправильная почта или пароль')); }
      //  throw new UnauthorizedError('Неправильная почта, пароль или токен');  //
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { return Promise.reject(new ErrorCodes.UNAUTHORIZED_ERROR('Неправильная почта или пароль')); }
          //  throw new UnauthorizedError('Неправильная почта, пароль или токен');  //
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
