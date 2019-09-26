const { BankStatement } = require('../models');

async function getStatement(id, res) {
  const regNumbers = /^\d+$/;

  if (!regNumbers.test(id)) {
    return res.status(401).send({ message: 'ID should be numeric.' });
  }

  if (!id) {
    return res.status(401).send({ message: 'ID not provided.' });
  }

  const bStatement = await BankStatement.findOne({ where: { id } });

  if (!bStatement) {
    return res.status(404).send({ message: 'Bank Statement not found.' });
  }

  return bStatement;
}

async function createBankingState(
  userAccount,
  favoredAccount,
  ammount,
  newAmmount,
  newFavoredAmmount,
) {
  await BankStatement.create({
    // SEND
    ammount,
    balance: newAmmount,
    favoredIdentifier: favoredAccount.identifier,
    AccountID: userAccount.id,
    createAt: new Date(),
  });

  await BankStatement.create({
    // RECEIVE
    ammount,
    balance: newFavoredAmmount,
    favoredIdentifier: favoredAccount.identifier,
    AccountID: favoredAccount.id,
    createAt: new Date(),
  });
}

module.exports = { getStatement, createBankingState };
