//  Поля схемы пользователя  //
//  bcrypt - для хеширования и сверки пароля  //

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../utils/errors/unauthorized-error');

//  const { REGEX_URL } = require('../utils/constants');  //

//  14.1 Добавляем в схему пользователя уник. email и пароль  //
//  14.1 validator - модуль валидации для email и avatar url  //
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Должно быть минимум 2 символа'],
    maxlength: [30, 'Должно быть минимум 30 символов'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Должно быть минимум 2 символа'],
    maxlength: [30, 'Должно быть минимум 30 символов'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: (v) => {
      if (validator.isURL(v)) {
        return true;
      }
      return false;
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (v) => {
      if (validator.isEmail(v)) {
        return true;
      }
      return false;
    },
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
      if (!user) { return Promise.reject(new UnauthorizedError('Неправильная почта или пароль')); }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { return Promise.reject(new UnauthorizedError('Неправильная почта или пароль')); }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
