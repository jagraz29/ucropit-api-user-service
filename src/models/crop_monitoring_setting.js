'use strict'

module.exports = (sequelize, DataTypes) => {
  const MonitoringSettings = sequelize.define(
    'crop_monitoring_settings',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      cant_day_start_sowing: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      cant_day_end_sowing: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      cant_day_start_harvest: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      cant_day_end_harvest: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      expected_surface: {
        allowNull: true,
        type: DataTypes.DECIMAL,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'crop_monitoring_settings',
    }
  )

  return MonitoringSettings
}
