const { BankStatement } = require('../models');
const {
  getAccount,
  getIdentifier,
  updateAccount,
} = require('../helpers/AccountHelper');
const { createBankingState } = require('../helpers/BankStatementHelper');
const {
  updateTransaction,
  validateTransaction,
} = require('../helpers/TransactionsHelper');

async function Index(req, res) {
  const { UserID } = req.params;

  const userAccount = await getAccount(UserID, res);

  return res.json(userAccount);
}

async function Transaction(req, res) {
  const { identifier } = req.params;
  const { favoredIdentifier, ammount } = req.body;
  const targetSocket = req.connectedUsers[favoredIdentifier];

  if (identifier === favoredIdentifier) {
    return res.status(404).send({ code: 100, message: 'Not allowed.' });
  }

  const userAccount = await getIdentifier(identifier, res);
  const favoredAccount = await getIdentifier(favoredIdentifier, res);

  const validate = await validateTransaction(
    userAccount.id,
    ammount,
    favoredIdentifier,
    res,
  );
  if (!validate) {
    return res.status(401).send({ code: 101, message: 'Not authorized.' });
  }

  const newFavoredAmmount = favoredAccount.ammount + ammount;

  if (ammount > userAccount.ammount) {
    if (ammount > userAccount.ammount + userAccount.limit) {
      return res
        .status(404)
        .send({ code: 102, message: 'Insufficient limit.' });
    }

    let newLimit;
    if (userAccount.ammount === 0) {
      newLimit = userAccount.limit - ammount;
    } else {
      newLimit = userAccount.ammount - ammount + userAccount.limit;
    }

    await updateAccount(identifier, 0, newLimit);
    await updateAccount(favoredIdentifier, newFavoredAmmount, null);

    if (targetSocket) {
      req.io.to(targetSocket).emit('transaction', {
        UserID: userAccount.id,
        ammount,
      });
    }

    await createBankingState(userAccount.id, favoredAccount, ammount);
    await updateTransaction(userAccount.id, ammount, favoredIdentifier, res);

    return res.status(200).send({
      code: 103,
      message: 'The limit is used to complete the transaction.',
    });
  }

  const newAmmount = userAccount.ammount - ammount;
  await updateAccount(identifier, newAmmount, null);
  await updateAccount(favoredIdentifier, newFavoredAmmount, null);

  if (targetSocket) {
    req.io.to(targetSocket).emit('transaction', {
      UserID: userAccount.id,
      ammount,
    });
  }

  await createBankingState(userAccount.id, favoredAccount, ammount);
  await updateTransaction(userAccount.id, ammount, favoredIdentifier, res);

  return res.status(200).send({ success: true });
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
