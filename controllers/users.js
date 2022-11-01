//  3 роута: GET /users, GET /users/:userId, POST /users  //
//  14.2: добавляем email и password с хешированием  //
//  В теле POST-запроса JSON-объект с полями: name, about и avatar  //
//  Импортируем bcrypt для хеширования пароля и jsonwetoken  //
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TOKEN_ENCRYPT_KEY = require('../utils/constants');

const User = require('../models/user');
const { ErrorCodes } = require('../utils/errors/error-codes');
//  const { IncorrectDataError } = require('../utils/errors/incorrect-data-error');  //
//  const { ConflictError } = require('../utils/errors/conflict-error');  //
//  const { UnauthorizedError } = require('../utils/errors/unauthorized-error');  //
//  const { NoDataError } = require('../utils/errors/no-data-error');  //

// const { handleErrors, handleIdErrors, } = require('../utils/handleErrors');  //

//  Контроллер логина  //
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new ErrorCodes.UNAUTHORIZED_ERROR('Неправильная почта или токен'));
      return;
    }
    const matchpass = bcrypt.compare(password, user.password);
    if (!matchpass) {
      next(new ErrorCodes.UNAUTHORIZED_ERROR('Неправильный пароль или токен'));
      return;
    }
    const token = jwt.sign({ _id: user._id }, TOKEN_ENCRYPT_KEY, { expiresIn: '7d' });
    res.status(ErrorCodes.OK).cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
    }).send({ message: 'Токен надежно защищен и хранится в cookie' }).end();
  } catch (err) {
    next(err);
  }
};

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
      next(new ErrorCodes.NO_DATA_ERROR(`Пользователь с id ${req.params.userId} не найден`));
      return;
    }
    res.status(ErrorCodes.OK).send(user);
  } catch (err) {
    next(err);
  }
};

//  Получение текущего юзера  - по user._id  //
module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(new ErrorCodes.NO_DATA_ERROR(`Пользователь с id ${req.params.userId} не найден`));
      return;
    }
    res.status(ErrorCodes.OK).send(user);
  } catch (err) {
    next(err);
  }
};

//  Контроллер создания пользователя - передаем name, about, avatar и _id  //
//  Попробуем сделать через async => await  //
//  Пароль хешируем в bcrypt и добавляем соль  //
//  В случае ошибки запускаем дефолтный обработчик  //
module.exports.createUser = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(17);
    const hashed = await bcrypt.hash(req.body.password, salt);
    const user = await User.create({ ...req.body, password: hashed });
    const {
      name, about, avatar, _id,
    } = user;
    res.status(ErrorCodes.OK).send({
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

//  Контроллер обновления профиля юзера  - ищем по userId  //
module.exports.updateProfile = async (req, res, next) => {
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

//  Контроллер обновления аватара юзера  - ищем по userId  //
module.exports.updateAvatar = async (req, res, next) => {
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
