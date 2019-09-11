'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('coverage_areas', [
      {
        value: 'junin',
        zone: 'Junin'
      },
      {
        value: 'rosario',
        zone: 'Rosario'
      },
      {
        value: 'cordoba',
        zone: 'Cordoba'
      },
      {
        value: 'chivilcoy',
        zone: 'Chivilcoy'
      },
      {
        value: 'chacabuco',
        zone: 'Chacabuco'
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("coverage_areas", null, {});
  }
};
