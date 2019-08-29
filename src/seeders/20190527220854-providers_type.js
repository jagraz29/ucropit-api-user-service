'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('providers_type', [
      {
        key: 'insures',
        name: 'Seguros'
      },
      {
        key: 'inputs',
        name: 'Campos'
      },
      {
        key: 'services',
        name: 'Servicios'
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("providers_type", null, {});
  }
};
