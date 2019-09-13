const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User, Account } = require('../models');
const authConfig = require('../../config/auth.json');

function generateToken(params = {}) {
  return jwt.sign({ id: params.id }, authConfig.secret, {
    expiresIn: 86400,
  });
}

async function Register(req, res) {
  const dataUser = req.body;

  try {
    const cpfExists = await User.findOne({ where: { cpf: dataUser.cpf } });
    if (cpfExists) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const phoneExists = await User.findOne({ where: { phone: dataUser.phone } });
    if (phoneExists) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    dataUser.password = await bcrypt.hash(dataUser.password, 10);

    const user = await User.create(dataUser);

    await Account.create({
      limit: 500, ammount: 1000, UserID: user.id, identifier: Math.floor((Math.random() * 10000) + 1),
    });

    user.password = undefined;

    return res.json({ user, token: generateToken({ id: user.id }) });
  } catch (error) {
    return res.status(400).send({ message: 'Registration failed.' });
  }
}
async function Login(req, res) {
  const { cpf, password } = req.body;

  const user = await User.findOne({ where: { cpf } });

  if (!user) {
    return res.status(400).json({ message: 'User not found.' });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({ message: 'Invalid credentials.' });
  }

  user.password = undefined;

  return res.json({ user, token: generateToken({ id: user.id }) });
}

module.exports = { Register, Login };
