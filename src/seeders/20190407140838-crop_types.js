'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('crop_types', [
      {
        name: 'Algodón',
        max_tons: 30,
        min_tons: 10,
        image: 'cotton.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Girasol',
        max_tons: 40,
        min_tons: 10,
        image: 'sunflower.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Soja',
        max_tons: 50,
        min_tons: 10,
        image: 'soy.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Maíz Pisingallo',
        max_tons: 60,
        min_tons: 10,
        image: 'corn.png',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('crop_types', null, {});
  }
};
