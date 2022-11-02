//  3 роута: GET /users, GET /users/:userId, POST /users  //
//  14.2: добавляем email и password с хешированием  //
//  В теле POST-запроса JSON-объект с полями: name, about и avatar  //
//  Импортируем bcrypt для хеширования пароля и jsonwetoken  //
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { TOKEN_ENCRYPT_KEY } = require('../utils/constants');

const User = require('../models/user');
// const { ErrorCodes } = require('../utils/errors/error-codes');  //
const IncorrectDataError = require('../utils/errors/incorrect-data-error');
const ConflictError = require('../utils/errors/conflict-error');
// const UnauthorizedError = require('../utils/errors/unauthorized-error'); //
const NoDataError = require('../utils/errors/no-data-error');

// const { handleErrors, handleIdErrors, } = require('../utils/handleErrors');  //

//  Получаем всех пользователей пробуем async await  //
module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send({ users });
  } catch (err) {
    next(err);
  }
};

//  Контроллер получения конкретного юзера  - ищем по userId  //
//  Если нет юзера с таким id, обрабатываем ошибку handleIdErrors   //
//  Остальные ошибки обрабатываем по умолчанию handleErrors  //
module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      next(new NoDataError(`Пользователь с id ${req.params.userId} не найден`));
      return;
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

//  Получение текущего юзера  - по user._id  //
module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(new NoDataError(`Пользователь с id ${req.params.userId} не найден`));
      return;
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

//  Контроллер создания пользователя - передаем name, about, avatar и _id  //
//  Попробуем сделать через async => await  //
//  Пароль хешируем в bcrypt и добавляем соль  //
//  В случае ошибки запускаем дефолтный обработчик  //
/* module.exports.createUser = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(17);
    const hashed = await bcrypt.hash(req.body.password, salt);
    const user = await User.create({ ...req.body, password: hashed });
    const {
      name, about, avatar, _id,
    } = user;
    res.send({
      name, about, avatar, _id,
    });
  } catch (err) {
    if (err.code === 11000 || err.message.includes('11000')) {
      next(new ErrorCodes.CONFLICT_ERROR(`${req.body.email} - такой пользователь уже есть в базе`));
      return;
    }
    next(err);
  }
};
*/

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 17)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new IncorrectDataError('Переданы некорректные данные'));
      }
      if (err.code === 11000) {
        return next(new ConflictError(`${req.body.email} - такой пользователь уже зарегистрирован`));
      }
      return next(err);
    });
};

//  Контроллер обновления профиля юзера  - ищем по userId  //
/* module.exports.updateProfile = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    res.send({ ...req.body });
  } catch (err) {
    next(err);
  }
};
*/

module.exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail(new NoDataError(`Пользователь с id: ${req.params.userId} не найден`))
    .then((updatedUser) => {
      res.send(updatedUser);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new IncorrectDataError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(new NoDataError(`Пользователь с id: ${req.params.userId} не найден`))
    .then((updatedUser) => {
      res.send(updatedUser);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new IncorrectDataError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        TOKEN_ENCRYPT_KEY,
        { expiresIn: '7d' },
      );
      res
        .cookie('authorization', token, {
          httpOnly: true,
          maxAge: 3600000 * 24 * 7,
          sameSite: true,
        })
        .send({ message: 'Авторизация прошла успешно!' });
    })
    .catch(next);
};

//  Вариант контроллера с aync await пока не работает  //
/* module.exports.updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(ErrorCodes.OK).send({ ...req.body });
  } catch (err) {
    next(err);
  }
};
*/
