const moment = require('moment');
const { Transactions } = require('../models');

async function updateTransaction(AccountID, ammount, favoredIdentifier, res) {
  const regNumbers = /^\d+$/;

  if (!regNumbers.test(AccountID)) {
    return res.status(401).send({ message: 'AccountID should be numeric.' });
  }

  if (!AccountID) {
    return res.status(401).send({ message: 'AccountID not provided.' });
  }

  const bStatement = await Transactions.findOne({ where: { AccountID } })
    .then((transaction) => transaction.update({
      ammount,
      favoredIdentifier,
      AccountID,
      updateAt: new Date(),
    }))
    .catch(() => Transactions.create({
      ammount,
      favoredIdentifier,
      AccountID,
      createdAt: new Date(),
    }));

  return bStatement;
}

async function validateTransaction(AccountID, newAmmount, newFavoredIdentifier, res) {
  const cache = await Transactions.findOne({
    where: { AccountID },
  });

  if (!cache) return true;

  const now = moment(new Date(), 'DD/MM/YYYY HH:mm:ss');
  const duration = moment.duration(now.diff(moment(cache.updatedAt, 'DD/MM/YYYY HH:mm:ss')));
  const minutes = duration.asMinutes();

  if (
    newAmmount === cache.ammount
    && newFavoredIdentifier === cache.favoredIdentifier
    && minutes < 2
  ) {
    return res.status(401).send({ message: 'Not authorized.' });
  }

  return true;
}

module.exports = { updateTransaction, validateTransaction };
