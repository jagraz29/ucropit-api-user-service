'use strict'

module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    'companies',
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
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      cellphone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        message: 'El email de la empresa ya existe'
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true
      },
      estate: {
        type: DataTypes.STRING,
        allowNull: true
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cuit: {
        type: DataTypes.STRING,
        allowNull: false
      },
      cbu: {
        type: DataTypes.STRING,
        allowNull: true
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
        get: function() {
          return `${process.env.BASE_URL}/companies/${this.getDataValue(
            'photo'
          )}`
        }
      },
      web: {
        type: DataTypes.STRING,
        allowNull: true
      },
      workplace: {
        type: DataTypes.STRING,
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
      underscored: true
    }
  )

  Company.associate = function(models) {
    Company.belongsToMany(models.users, {
      through: 'companies_users_profiles',
      foreignKey: 'company_id',
      otherKey: 'user_id'
    })
  }

  return Company
}
