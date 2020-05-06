'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('coverage_areas', [
      {
        value: 'junin',
        name: 'Junin'
      },
      {
        value: 'rosario',
        name: 'Rosario'
      },
      {
        value: 'cordoba',
        name: 'Cordoba'
      },
      {
        value: 'chivilcoy',
        name: 'Chivilcoy'
      },
      {
        value: 'chacabuco',
        name: 'Chacabuco'
      }
    ], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('coverage_areas', null, {});
  }
};
