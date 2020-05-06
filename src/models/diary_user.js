'use strict';

module.exports = (sequelize, DataTypes) => {
  const DiaryUser = sequelize.define(
    'diary_users',
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
      contact_user_id: {
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
      tableName: 'diary_users',
    }
  );

  return DiaryUser;
}