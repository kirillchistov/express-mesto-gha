//  Поля схемы пользователя  //
//  name — имя пользователя, строка 2-30 символов, обязательное  //
//  about — информация о пользователе, строка 2-30 символов, обязательное  //
//  avatar — ссылка на аватарку, строка, обязательное поле  //


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
