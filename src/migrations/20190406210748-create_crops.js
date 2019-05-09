'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('crops', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      budget: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      crop_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      surface: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      quintals: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      reference_price: Sequelize.DOUBLE,
      status: {
        type: Sequelize.ENUM,
        default: 'checking',
        values: ['checking', 'planing', 'accepted']
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('crops');
  }
};
