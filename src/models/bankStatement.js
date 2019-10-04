module.exports = (sequelize, DataTypes) => {
  const BankStatement = sequelize.define(
    'BankStatement',
    {
      data: DataTypes.ARRAY(DataTypes.JSONB),
      AccountID: {
        type: DataTypes.INTEGER,
        references: 'Accounts', // <<< Note, its table's name, not object name
        referencesKey: 'id', // <<< Note, its a column name
      },
    },
    {
      timestamps: false,
    },
  );

  return BankStatement;
};
