"use strict";

module.exports = (sequelize, DataTypes) => {
  const CoverageArea = sequelize.define(
    "coverage_areas",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      value: {
        type: DataTypes.STRING,
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
      tableName: "coverage_areas"
    }
  );

  CoverageArea.associate = function (models) {
    CoverageArea.belongsToMany(models.providers, {
        through: 'coverage_areas_providers',
        foreignKey: 'coverage_area_id',
        otherKey: 'providers_id'
    })
  }

  return CoverageArea;
};