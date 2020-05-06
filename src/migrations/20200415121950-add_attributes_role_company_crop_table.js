'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('roles_companies_crops', 'before_day_sowing', {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      queryInterface.addColumn('roles_companies_crops', 'after_day_sowing', {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      queryInterface.addColumn('roles_companies_crops', 'expected_surface_percent', {
        type: Sequelize.DOUBLE,
        allowNull: true
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('roles_companies_crops', 'before_day_sowing'),
      queryInterface.removeColumn('roles_companies_crops', 'after_day_sowing'),
      queryInterface.removeColumn('roles_companies_crops', 'expected_surface_percent')
    ])
  }
};
