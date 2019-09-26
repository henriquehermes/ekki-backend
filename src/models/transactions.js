module.exports = (sequelize, DataTypes) => {
  const Transactions = sequelize.define('Transactions', {
    lastTransaction: DataTypes.DATE,
    ammount: DataTypes.FLOAT,
    favoredIdentifier: DataTypes.INTEGER,
    AccountID: {
      type: DataTypes.INTEGER,
      references: 'Accounts', // <<< Note, its table's name, not object name
      referencesKey: 'id', // <<< Note, its a column name
    },
  }, {
    timestamps: false,
  });

  return Transactions;
};
