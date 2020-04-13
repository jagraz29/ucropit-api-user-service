'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'crop_monitoring_settings',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        cant_day_start_sowing: {
          allowNull: true,
          type: Sequelize.INTEGER,
        },
        cant_day_end_sowing: {
          allowNull: true,
          type: Sequelize.INTEGER,
        },
        cant_day_start_harvest: {
          allowNull: true,
          type: Sequelize.INTEGER,
        },
        cant_day_end_harvest: {
          allowNull: true,
          type: Sequelize.INTEGER,
        },
        expected_surface: {
          allowNull: true,
          type: Sequelize.DECIMAL,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: new Date(),
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: new Date(),
        },
      },
      {
        timestamps: true,
        underscored: true,
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("crop_monitoring_settings")
  },
}
