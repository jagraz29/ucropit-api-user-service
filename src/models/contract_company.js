'use strict'

module.exports = (sequelize, DataTypes) => {
  const ContractCompany = sequelize.define(
    'contract_companies',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      productor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      locator_id: {
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
      tableName: 'contract_companies'
    }
  )

  return ContractCompany
}
