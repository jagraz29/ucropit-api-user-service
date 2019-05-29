'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('crop_permissions', [
      {
        name: 'Puede editar',
        value: 'can_edit'
      },
      {
        name: 'Puede firmar',
        value: 'can_sign'
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('crop_permissions', null, {});
  }
};
