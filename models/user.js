//  Поля схемы пользователя  //
//  name — имя, строка 2-30, не-обязательное, default  //
//  about — информация о, строка 2-30, не-обязательное, default  //
//  avatar — ссылка на аватар, строка, не-обязательное, default, валидация URL  //
//  versionKey - поддержка транзакционности / контроль версий  //
//  validator - модуль валидации, здесь пока только /lib/isEmail  //
//  bcrypt - для хеширования и сверки пароля  //
//  REGEX_URL - рег.выражение для валидации ссылки на аватар  //

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
//  const { REGEX_URL } = require('../utils/constants');  //

//  14.1 Добавляем в схему пользователя уник. email и пароль  //
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
    validate: {
      validator(url) {
        return validator.isURL(url) === true;
      },
      message: 'Указан некорректный URL аватарки',
    },
  },
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Адрес электронной почты введен не корректно',
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
      if (!user) { return Promise.reject(new Error('Неправильная почта или пароль')); }
      //  throw new UnauthorizedError('Неправильная почта, пароль или токен');  //
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { return Promise.reject(new Error('Неправильная почта или пароль')); }
          //  throw new UnauthorizedError('Неправильная почта, пароль или токен');  //
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
