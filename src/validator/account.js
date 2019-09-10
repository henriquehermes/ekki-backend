const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  cpf: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = schema;
