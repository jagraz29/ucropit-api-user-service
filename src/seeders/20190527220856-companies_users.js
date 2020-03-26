'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert(
        'companies',
        [
          {
            id: 1,
            name: 'Bayacasal',
            phone: '234234234',
            email: 'bayacasal@email.com',
            address: 'Una direccion de prueba 1',
            cuit: '20343629835',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 2,
            name: 'Indigo',
            phone: '23424234',
            email: 'indigo@email.com',
            address: 'Una direccion de prueba 2',
            cuit: '20343659835',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 3,
            name: 'Casenave',
            phone: '2223231',
            email: 'casenave@email.com',
            address: 'Una direccion de prueba 3',
            cuit: '20343679835',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 4,
            name: 'SEDA SRL',
            phone: '2223231',
            email: 'seda@email.com',
            address: 'Una direccion de prueba 4',
            cuit: '20343629835',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 5,
            name: 'Desde el sur SRL',
            phone: '2223231',
            email: 'desdelsur@email.com',
            address: 'Una direccion de prueba 5',
            cuit: '20343429835',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 6,
            name: 'Federico Machado',
            phone: '2223231',
            email: 'federicomachado@email.com',
            address: 'Una direccion de prueba',
            cuit: '20343629835',
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        {}
      ),
      queryInterface.bulkInsert(
        'companies_users_profiles',
        [
          {
            id: 1,
            user_id: 2,
            company_id: 1,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 2,
            user_id: 2,
            company_id: 2,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 3,
            user_id: 2,
            company_id: 3,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 4,
            user_id: 3,
            company_id: 3,
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        {}
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('companies_users_profiles', null, {}),
      queryInterface.bulkDelete('companies', null, {})
    ])
  }
}
