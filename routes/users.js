const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^:?https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/),
  }),
}), updateAvatar);

module.exports = router;
