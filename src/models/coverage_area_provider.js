"use strict";

module.exports = (sequelize, DataTypes) => {
  const CoverageAreaProvider = sequelize.define(
    "coverage_areas_providers",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      providers_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      coverage_area_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date()
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date()
      }
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'coverage_areas_providers',
    }
  );

  return CoverageAreaProvider;
};