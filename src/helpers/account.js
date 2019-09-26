const { Account } = require('../models');

async function getAccount(UserID, res) {
  const regNumbers = /^\d+$/;

  if (!regNumbers.test(UserID)) {
    return res.status(401).send({ message: 'ID Account should be numeric.' });
  }

  if (!UserID) {
    return res.status(401).send({ message: 'ID Account not provided.' });
  }

  const userAccount = await Account.findOne({ where: { UserID } });

  if (!userAccount) {
    return res.status(404).send({ message: 'Account not found.' });
  }

  return userAccount;
}

async function getIdentifier(identifier, res) {
  const regNumbers = /^\d+$/;

  if (!regNumbers.test(identifier)) {
    return res.status(401).send({ message: 'ID Account should be numeric.' });
  }

  if (!identifier) {
    return res.status(401).send({ message: 'ID Account not provided.' });
  }

  const userAccount = await Account.findOne({ where: { identifier } });

  if (!userAccount) {
    return res.status(404).send({ message: 'Account not found.' });
  }

  return userAccount;
}

async function updateAccount(identifier, newAmmount, newLimit) {
  const userAccount = await Account.findOne({ where: { identifier } }).then((ac) => {
    if (newLimit || newLimit === 0) {
      return ac.update({ ammount: newAmmount, limit: newLimit });
    }
    return ac.update({ ammount: newAmmount });
  });

  return userAccount;
}

module.exports = { getAccount, getIdentifier, updateAccount };
