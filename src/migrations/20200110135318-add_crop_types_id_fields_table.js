'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('fields', 'crop_type_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('fields', 'crop_type_id');
  }
};
