'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.addColumn('lots', 'area', {
          type: Sequelize.DOUBLE,
          allowNull: true
        })
      ]
    )
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('lots', 'area')
    ])
  }
};
