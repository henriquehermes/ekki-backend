const express = require('express');

const router = express();

const { Account } = require('../models');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/:idAccount', async (req, res) => {
  const { idAccount } = req.params;
  const regNumbers = /^\d+$/;

  if (!regNumbers.test(idAccount)) {
    return res.status(401).send({ message: 'ID Account should be numeric.' });
  }

  if (!idAccount) {
    return res.status(401).send({ message: 'ID Account not provided.' });
  }

  const userAccount = await Account.findOne({ where: { id: idAccount } });

  if (!userAccount) {
    return res.status(404).send({ message: 'Account not found.' });
  }
  return res.json(userAccount);
});

module.exports = router;
