"use_strict";

module.exports = (sequelize, DataTypes) => {
  const ProductionUserPermission = sequelize.define(
    "productions_users_permissions",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      production_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      data: {
        type: DataTypes.TEXT,
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
    }
  );

  return ProductionUserPermission;
};
