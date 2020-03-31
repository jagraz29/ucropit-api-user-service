'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'companies_users_profiles',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        default_login: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          default: 0
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: new Date()
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: new Date()
        }
      },
      {
        timestamps: true,
        underscored: true
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('companies_users_profiles')
  }
}
