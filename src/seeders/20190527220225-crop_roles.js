'use strict';

module.exports = {
  up: (queryInterface) => {

    return queryInterface.bulkInsert('crop_roles', [
      {
        name: 'Dueño del Campo',
        value: 'field_owner'
      },
      {
        name: 'Inquilino',
        value: 'tenant'
      },
      {
        name: 'Socio en aparcería',
        value: 'sharecropping'
      },
      {
        name: 'Colaborador',
        value: 'partner'
      },
      {
        name: 'Financiador',
        value: 'financier'
      },
      {
        name: 'Comprador',
        value: 'buyer'
      },
      {
        name: 'Certificador Independiente',
        value: 'freelance_certifier'
      }
    ], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('crop_roles', null, {});
  }
};
