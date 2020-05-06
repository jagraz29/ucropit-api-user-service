'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('providers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Sugerido', 'Completo', 'Validado'),
        allowNull:false,
        defaultValue: 'Sugerido'
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cellphone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      estate: {
        type: Sequelize.STRING,
        allowNull: true
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true
      },
      postal_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      taxid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cbu: {
        type: Sequelize.STRING,
        allowNull: false
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      discounts: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: true
      },
      workplace: {
        type: Sequelize.STRING,
        allowNull: true
      },
      web: {
        type: Sequelize.STRING,
        allowNull: true
      },
      latitude: {
        type: Sequelize.STRING,
        allowNull: true
      },
      longitude: {
        type: Sequelize.STRING,
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
    }, 
    {
      timestamps: true,
      underscored: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('providers');
  }
};
