'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('providers_type', [
      {
        value: 'insures',
        label: 'Seguros'
      },
      {
        value: 'inputs',
        label: 'Insumos'
      },
      {
        value: 'services',
        label: 'Servicios'
      },
      {
        value: 'monitoring',
        label: 'Monitoreo'
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('providers_type', null, {});
  }
};
