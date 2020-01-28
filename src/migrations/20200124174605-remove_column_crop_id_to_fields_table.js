"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("fields", "crop_type_id"),
      queryInterface.addColumn("lots", "crop_type_id", {
        type: Sequelize.INTEGER,
        allowNull: true
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("lots", "crop_type_id"),
      queryInterface.addColumn("fields", "crop_type_id", {
        type: Sequelize.INTEGER,
        allowNull: true
      })
    ]);
  }
};
