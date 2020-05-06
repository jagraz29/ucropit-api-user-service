'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fiscal_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      first_login: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('users');
  }
};
