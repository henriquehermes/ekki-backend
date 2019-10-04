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

async function createBankingState(userAccount, favoredAccount, ammount) {
  await BankStatement.findOne({ where: { AccountID: userAccount } })
    .then(async (bStatement) => {
      if (bStatement.data) {
        const newData = [
          ...bStatement.data,
          {
            ammount,
            favoredIdentifier: favoredAccount.identifier,
            date: new Date(),
          },
        ];

        bStatement.update({
          AccountID: userAccount,
          data: newData,
        });

        await BankStatement.findOne({
          where: { AccountID: favoredAccount.id },
        })
          .then((fStatement) => {
            if (fStatement.data) {
              const newDataFavored = [
                ...fStatement.data,
                {
                  ammount,
                  favoredIdentifier: favoredAccount.identifier,
                  date: new Date(),
                },
              ];

              fStatement.update({
                AccountID: favoredAccount.id,
                data: newDataFavored,
              });
            }
          })
          .catch(() => {
            BankStatement.create({
              AccountID: favoredAccount.id,
              data: [
                {
                  ammount,
                  favoredIdentifier: favoredAccount.identifier,
                  date: new Date(),
                },
              ],
            });
          });
      }
    })
    .catch(async () => {
      BankStatement.create({
        AccountID: userAccount,
        data: [
          {
            ammount,
            favoredIdentifier: favoredAccount.identifier,
            date: new Date(),
          },
        ],
      });

      await BankStatement.findOne({
        where: { AccountID: favoredAccount.id },
      })
        .then((fStatement) => {
          if (fStatement.data) {
            const newDataFavored = [
              ...fStatement.data,
              {
                ammount,
                favoredIdentifier: favoredAccount.identifier,
                date: new Date(),
              },
            ];

            fStatement.update({
              AccountID: favoredAccount.id,
              data: newDataFavored,
            });
          }
        })
        .catch(() => {
          BankStatement.create({
            AccountID: favoredAccount.id,
            data: [
              {
                ammount,
                favoredIdentifier: favoredAccount.identifier,
                date: new Date(),
              },
            ],
          });
        });
    });
}

module.exports = { getStatement, createBankingState };
