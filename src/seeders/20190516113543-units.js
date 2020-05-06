'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('units', [
      {
        value: 'bolsa',
        label_long: 'Bolsa',
        label_short: 'Bol.'
      },
      {
        value: 'kilo',
        label_long: 'Kilo',
        label_short: 'Kg.'
      },
      {
        value: 'litro',
        label_long: 'Litro',
        label_short: 'Lts.'
      },
      {
        value: 'packs',
        label_long: 'Pack',
        label_short: 'Pack'
      }
    ]);
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('units', null, {})
  }
};
