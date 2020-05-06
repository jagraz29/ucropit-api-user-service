'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('producers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      business_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cuit: {
        type: Sequelize.STRING,
        allowNull: false
      }, 
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      depto: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
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
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('producers');
  }
};
