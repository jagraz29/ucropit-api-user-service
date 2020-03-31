'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'roles_companies_crops',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        crop_id: {
          type: Sequelize.INTEGER,
          allowNull: false
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
    return queryInterface.dropTable('roles_companies_crops')
  }
};
