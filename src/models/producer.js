'use strict'

module.exports = (sequelize, DataTypes) => {
  const Producer = sequelize.define(
    'producers',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      business_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      cuit: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      depto: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      underscored: true
    }
  )

  Producer.associate = function (models) {
    Producer.belongsTo(models.users, {
      foreignKey: 'user_id'
    })
  }

  return Producer
}
