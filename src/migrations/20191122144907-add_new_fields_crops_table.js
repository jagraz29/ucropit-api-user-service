'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('crops', 'crop_name', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('crops', 'units', {
        type: Sequelize.ENUM,
        values: ['Toneladas', 'Kilogramos', 'Bolsas', 'Fardos'],
        allowNull: true
      }),
      queryInterface.addColumn('crops', 'agronomic_budget', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 1
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('crops', 'crop_name'),
      queryInterface.removeColumn('crops', 'units'),
      queryInterface.removeColumn('crops', 'agronomic_budget')
    ])
  }
}
