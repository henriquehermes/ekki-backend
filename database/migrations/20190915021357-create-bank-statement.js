module.exports = {
  up: (queryInterface, Sequelize) => {
    const BankStatements = queryInterface.createTable('BankStatements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      data: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
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
    });

    return BankStatements;
  },

  down: (queryInterface) => queryInterface.dropTable('BankStatements'),
};
