'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'contract_companies',
      [
        {
          id: 1,
          locator_id: 1,
          productor_id: 2,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          locator_id: 1,
          productor_id: 3,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 3,
          locator_id: 1,
          productor_id: 4,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 4,
          locator_id: 1,
          productor_id: 5,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('contract_companies', null, {})
    ])
  }
}
