const Joi = require('@hapi/joi');

const UserValidator = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .max(30)
    .required(),
  password: Joi.string().required(),
  cpf: Joi.string().required(),
  phone: Joi.string().required(),
});

module.exports = UserValidator;
