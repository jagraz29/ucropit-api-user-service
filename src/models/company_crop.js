'use strict';

module.exports = (sequelize, DataTypes) => {
  const CompanyCrop = sequelize.define(
    'companies_crops',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      crop_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      before_day_sowing: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      after_day_sowing: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      before_day_harvest: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      after_day_harvest: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      expected_surface_percent: {
        type: DataTypes.DOUBLE,
        allowNull: true
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
      tableName: 'roles_companies_crops',
    }
  );

  return CompanyCrop;
};