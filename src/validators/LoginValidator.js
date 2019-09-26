const Joi = require('@hapi/joi');

const LoginValidator = Joi.object().keys({
  cpf: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = LoginValidator;
