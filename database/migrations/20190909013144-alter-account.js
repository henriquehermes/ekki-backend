
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Accounts', // name of Source model
    'UserID', // name of the key we're adding
    {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'Users',
        },
        key: 'id', // key in Target model that we're referencing
      },
    },
  ),

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
