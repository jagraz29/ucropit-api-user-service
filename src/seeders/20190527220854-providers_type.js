'use strict';

module.exports = {
  up: (queryInterface) => {
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

  down: (queryInterface) => {
    return queryInterface.bulkDelete('providers_type', null, {});
  }
};
