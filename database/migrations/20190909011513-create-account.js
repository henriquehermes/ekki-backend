
module.exports = {
  up: (queryInterface, Sequelize) => {
    const AccountTable = queryInterface.createTable('Accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      limit: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      ammount: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      UserID: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Users',
          },
          key: 'id', // key in Target model that we're referencing
        },
      },
      identifier: {
        allowNull: false,
        unique: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
    });

    return AccountTable;
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
