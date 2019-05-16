'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('services', [
        {
          "name": "Aplicación de Insecticidas, Herbicidas...",
          "stage": "all",
          "type_id": 1,
        },
        {
          "name": "Aplicación via avión",
          "stage": "all",
          "type_id": 2,
        },
        {
          "name": "Montes y lotes en general",
          "stage": "all",
          "type_id": 3,
        },
        {
          "name": "Servicios de labranza de suelos",
          "stage": "all",
          "type_id": 4,
        },
        {
          "name": "Servicios de labranza de suelos",
          "stage": "all",
          "type_id": 5,
        }
      ]);
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('services', null, {});
  }
};
