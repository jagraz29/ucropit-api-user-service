'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('service_types', [
      {
        name: 'Aplicación Terreste',
        image: 'Tractor.svg'
      },
      {
        name: 'Aplicación Aérea',
        image: 'Tractor.svg'
      },
      {
        name: 'Desmalezado',
        image: 'Tractor.svg'
      },
      {
        name: 'Disco y Rastra',
        image: 'Tractor.svg'
      },
      {
        name: 'Disco',
        image: 'Tractor.svg'
      },
      {
        name: 'Seguro',
        image: 'Tractor.svg'
      },
      {
        name: 'Cosecha',
        image: 'Tractor.svg'
      },
      {
        name: 'Flete',
        image: 'Tractor.svg'
      },
      {
        name: 'Secada',
        image: 'Tractor.svg'
      },
      {
        name: 'Comisión por Venta',
        image: 'Tractor.svg'
      },
      {
        name: 'Monitoreo',
        image: 'Tractor.svg'
      },
      {
        name: 'Gastos e Ingresos',
        image: 'Tractor.svg'
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('service_types', null);
  }
};
