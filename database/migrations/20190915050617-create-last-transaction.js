module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Transactions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    lastTransaction: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    ammount: {
      allowNull: false,
      type: Sequelize.FLOAT,
    },
    favoredIdentifier: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    AccountID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'Accounts',
        },
        key: 'id', // key in Target model that we're referencing
      },
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('Transactions'),
};
