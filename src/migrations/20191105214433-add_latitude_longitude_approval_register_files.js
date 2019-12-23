'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("approval_register_files", "latitude", {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("approval_register_files", "longitude", {
        type: Sequelize.STRING,
        allowNull: true
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("approval_register_files", "latitude"),
      queryInterface.removeColumn("approval_register_files", "longitude")
    ]);
  }
};
