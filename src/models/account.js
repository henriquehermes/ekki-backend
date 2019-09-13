module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    limit: DataTypes.FLOAT,
    ammount: DataTypes.FLOAT,
    UserID: {
      type: DataTypes.INTEGER,
      references: 'Users', // <<< Note, its table's name, not object name
      referencesKey: 'id', // <<< Note, its a column name
    },
    identifier: {
      type: DataTypes.INTEGER,
    },
  });

  return Account;
};
