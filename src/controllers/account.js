const { BankStatement } = require('../models');
const { getAccount, getIdentifier, updateAccount } = require('../helpers/account');
const { createBankingState } = require('../helpers/bankStatement');
const { updateTransaction, validateTransaction } = require('../helpers/transactions');

async function Index(req, res) {
  const { UserID } = req.params;

  const userAccount = await getAccount(UserID, res);

  return res.json(userAccount);
}

async function Transaction(req, res) {
  const { identifier } = req.params;
  const { favoredIdentifier, ammount } = req.body;

  if (identifier === favoredIdentifier) {
    return res.status(404).send({ message: 'Not allowed.' });
  }

  const userAccount = await getIdentifier(identifier, res);
  const favoredAccount = await getIdentifier(favoredIdentifier, res);

  await validateTransaction(userAccount.id, ammount, favoredIdentifier, res);

  const newFavoredAmmount = favoredAccount.ammount + ammount;

  if (ammount > userAccount.ammount) {
    if (ammount > userAccount.ammount + userAccount.limit) {
      return res.status(404).send({ message: 'Insufficient limit.' });
    }

    let newLimit;
    if (userAccount.ammount === 0) {
      newLimit = userAccount.limit - ammount;
    } else {
      newLimit = userAccount.ammount - ammount + userAccount.limit;
    }

    await updateAccount(identifier, 0, newLimit);
    await updateAccount(favoredIdentifier, newFavoredAmmount, null);

    await createBankingState(userAccount, favoredAccount, ammount, 0, newFavoredAmmount);
    await updateTransaction(userAccount.id, ammount, favoredIdentifier, res);

    return res.status(200).send({ message: 'The limit is used to complete the transaction.' });
  }

  const newAmmount = userAccount.ammount - ammount;
  await updateAccount(identifier, newAmmount, null);
  await updateAccount(favoredIdentifier, newFavoredAmmount, null);

  await createBankingState(userAccount, favoredAccount, ammount, newAmmount, newFavoredAmmount);
  await updateTransaction(userAccount.id, ammount, favoredIdentifier, res);

  return res.status(200).send({ message: 'Success.' });
}

async function BankStatements(req, res) {
  const { identifier } = req.params;

  const { id } = await getIdentifier(identifier, res);
  const history = await BankStatement.findAll({ where: { AccountID: id } });

  return res.json(history);
}

module.exports = {
  Index,
  Transaction,
  BankStatements,
};
