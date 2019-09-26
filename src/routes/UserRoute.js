const express = require('express');

const router = express();

const UserController = require('../controllers/UserController');
const UserValidator = require('../validators/UserValidator');
const LoginValidator = require('../validators/LoginValidator');
const joi = require('../middlewares/joi');

router.post('/register', joi(UserValidator), UserController.Register);

router.post('/login', joi(LoginValidator), UserController.Login);

module.exports = router;
