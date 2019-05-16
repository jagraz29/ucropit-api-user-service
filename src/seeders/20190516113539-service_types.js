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
        }
      ]);
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('service_types', null);
  }
};
