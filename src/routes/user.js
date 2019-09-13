const express = require('express');

const router = express();

const UserController = require('../controllers/user');
const UserValidator = require('../validator/user');
const LoginValidator = require('../validator/login');
const joi = require('../middlewares/joi');

router.post('/register', joi(UserValidator), UserController.Register);

router.post('/login', joi(LoginValidator), UserController.Login);

module.exports = router;
