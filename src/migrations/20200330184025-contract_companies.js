'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'contract_companies',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        productor_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        locator_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: new Date()
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: new Date()
        }
      },
      {
        timestamps: true,
        underscored: true
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("contract_companies")
  }
}
