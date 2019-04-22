'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('crop_types', [
      {
        name: 'Girasol',
        max_tons: 1,
        min_tons: 3
      },
      {
        name: 'Soja',
        max_tons: 1,
        min_tons: 3
      },
      {
        name: 'Maíz Pisingallo',
        max_tons: 1,
        min_tons: 3
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {});
  }
};
