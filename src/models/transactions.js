module.exports = (sequelize, DataTypes) => {
  const Transactions = sequelize.define('Transactions', {
    ammount: DataTypes.FLOAT,
    favoredIdentifier: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    AccountID: {
      type: DataTypes.INTEGER,
      references: 'Accounts', // <<< Note, its table's name, not object name
      referencesKey: 'id', // <<< Note, its a column name
    },
  });

  return Transactions;
};
