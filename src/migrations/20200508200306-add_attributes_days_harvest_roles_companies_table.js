'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('roles_companies_crops', 'before_day_harvest', {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      queryInterface.addColumn('roles_companies_crops', 'after_day_harvest', {
        type: Sequelize.INTEGER,
        allowNull: true
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('roles_companies_crops', 'before_day_harvest'),
      queryInterface.removeColumn('roles_companies_crops', 'after_day_harvest'),
    ])
  }
};
