'use strict';

module.exports = (sequelize, DataTypes) => {
  const ProviderType = sequelize.define(
    'providers_type',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      label: {
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
      tableName: 'providers_type'
    }
  );

  ProviderType.associate = function (models) {
    ProviderType.belongsToMany(models.providers, {
      through: 'providers_providers_type',
      foreignKey: 'providers_type_id',
      otherKey: 'providers_id'
    })
  }

  return ProviderType;
};