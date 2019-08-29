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
        label: 'Campos'
      },
      {
        value: 'services',
        label: 'Servicios'
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("providers_type", null, {});
  }
};
