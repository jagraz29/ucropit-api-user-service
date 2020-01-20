"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "approval_register_files",
      "date_created_file",
      {
        allowNull: true,
        type: Sequelize.DATE
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      "approval_register_files",
      "date_created_file"
    );
  }
};
