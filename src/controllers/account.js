
const { Account } = require('../models');

async function getAccount(identifier, res) {
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


async function Index(req, res) {
  const { identifier } = req.params;

  const userAccount = await getAccount(identifier, res);

  return res.json(userAccount);
}

async function Transaction(req, res) {
  const { identifier } = req.params;
  const { favoredIdentifier, ammount, createdAt } = req.body;

  if (identifier === favoredIdentifier) {
    return res.status(404).send({ message: 'Not allowed.' });
  }

  const userAccount = await getAccount(identifier, res);
  const favoredAccount = await getAccount(favoredIdentifier, res);
  const favoredAmmount = favoredAccount.ammount + ammount;

  if (ammount > userAccount.ammount) {
    if (ammount > (userAccount.ammount + userAccount.limit)) {
      return res.status(404).send({ message: 'Insufficient limit.' });
    }
    if (userAccount.ammount === 0) {
      const newLimit = userAccount.limit - ammount;

      await updateAccount(identifier, 0, newLimit);
      await updateAccount(favoredIdentifier, favoredAmmount, null);
    } else {
      const newLimit = (userAccount.ammount - ammount) + userAccount.limit;

      await updateAccount(identifier, 0, newLimit);
      await updateAccount(favoredIdentifier, favoredAmmount, null);
    }

    return res.status(200).send({ message: 'The limit is used to complete the transaction.' });
  }

  const newAmmount = userAccount.ammount - ammount;
  await updateAccount(identifier, newAmmount, null);
  await updateAccount(favoredIdentifier, favoredAmmount, null);

  return res.status(200).send({ message: 'Success.' });
}

module.exports = { Index, Transaction };
