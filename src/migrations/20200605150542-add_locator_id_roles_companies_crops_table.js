'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('roles_companies_crops', 'locator_id', {
        type: Sequelize.INTEGER,
        allowNull: true
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('roles_companies_crops', 'locator_id')
    ])
  }
};
