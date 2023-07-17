const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictingRecuestError = require('../errors/ConflictingRecuestError');

const CREATED = 201;

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(String(password), 10)
    .then((hashedPassword) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hashedPassword,
      })
        .then((user) => {
          res.status(CREATED).send(user);
        })
        .catch((error) => {
          if (error.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
          } else if (error.code === 11000) {
            next(new ConflictingRecuestError('Пользователь с таким email уже существует'));
          } else {
            next(error);
          }
        });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .orFail(() => next(new UnauthorizedError('Введены неправильные данные для входа')))
    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const token = jwt.sign({
              _id: user._id,
              expiresIn: '7d',
            }, 'very-secret-key');
            res.cookie('token', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
              sameSite: true,
            });
            res.send({ data: user.toJSON() });
          } else {
            throw new UnauthorizedError('Введены неправильные данные для входа');
          }
        });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(error);
      }
    });
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Пользователь с указанным _id не найден'));
      } else {
        next(error);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
      } else {
        next(error);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  getUserInfo,
  updateUser,
  updateAvatar,
  login,
};
