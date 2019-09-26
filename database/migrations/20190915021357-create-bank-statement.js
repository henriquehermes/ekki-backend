module.exports = {
  up: (queryInterface, Sequelize) => {
    const BankStatements = queryInterface.createTable('BankStatements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
        references: {
          model: {
            tableName: 'Accounts',
          },
          key: 'id', // key in Target model that we're referencing
        },
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    return BankStatements;
  },

  down: (queryInterface) => queryInterface.dropTable('BankStatements'),
};
