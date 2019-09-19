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
        },
        {
          "name": "Seguro",
          "stage": "protection",
          "type_id": 6,
          "calc_unit":  'ha'
        },
        {
          name: 'Servicio de cosecha',
          "stage": "harvest-and-marketing",
          "type_id": 7,
          "calc_unit":  'percent'
        },
        {
          name: 'Flete',
          "stage": "harvest-and-marketing",
          "type_id": 8,
          "calc_unit":  'ton'
        },
        {
          name: 'Servicio de secada',
          "stage": "harvest-and-marketing",
          "type_id": 9,
          "calc_unit":  'ton'
        },
        {
          name: 'Gastos de venta de grano',
          "stage": "harvest-and-marketing",
          "type_id": 10,
          "calc_unit":  'percent'
        },
        {
          name: 'Monitoreo',
          "stage": "monitoring",
          "type_id": 11,
          "calc_unit": "ha"
        }
      ]);
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('services', null, {});
  }
};
