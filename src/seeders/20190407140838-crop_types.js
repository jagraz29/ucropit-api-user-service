'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('crop_types', [
      {
        name: 'Algodón',
        max_tons: 1,
        min_tons: 3,
        image: 'cotton.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Girasol',
        max_tons: 1,
        min_tons: 3,
        image: 'sunflower.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Soja',
        max_tons: 1,
        min_tons: 3,
        image: 'soy.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Maíz Pisingallo',
        max_tons: 1,
        min_tons: 3,
        image: 'corn.png',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {});
  }
};
