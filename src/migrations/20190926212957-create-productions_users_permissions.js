'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'productions_users_permissions',
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
        production_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        data: {
          type: Sequelize.TEXT,
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
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('productions_users_permissions');
  }
};
