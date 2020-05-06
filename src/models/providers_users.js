'use strict';

module.exports = (sequelize, DataTypes) => {
  const ProvidersUser = sequelize.define(
    'providers_users',
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
      user_id: {
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
      tableName: 'providers_users',
    }
  );

  return ProvidersUser;
};