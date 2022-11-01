//  Поля схемы карточки:  //
//  name — имя карточки, строка 2-30, обязательное  //
//  link — ссылка на картинку, строка, обязательное  //
//  owner — ссылка на модель автора карточки, тип ObjectId, обязательное  //
//  likes — список лайкнувших пост пользователей, массив ObjectId, по умолчанию = []  //
//  createdAt — дата создания, Date, по умолчанию = Date.now  //
//  versionKey - способ поддержки транзакционности / контроля версий  //

const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return validator.isURL(link) === true;
      },
      message: 'Указан некорректный URL иллюстрации места',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
