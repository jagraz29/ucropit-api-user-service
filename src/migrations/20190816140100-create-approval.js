'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('approvals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      stage: {
        type: Sequelize.STRING
      },
      crop_id: {
        type: Sequelize.INTEGER
      },
      data: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.STRING
      },
      service_id: {
        type: Sequelize.INTEGER
      },
      input_id: {
        type: Sequelize.INTEGER
      },
      provider_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('approvals');
  }
};