"use strict";

module.exports = (sequelize, DataTypes) => {
  const ProvidersProvidersType = sequelize.define(
    "providers_providers_type",
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
      providers_type_id: {
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
      tableName: 'providers_providers_type',
    }
  );

  return ProvidersProvidersType;
};