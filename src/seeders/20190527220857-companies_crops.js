'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roles_companies_crops', [
      {
        id: 1,
        company_id: 4,
        crop_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        company_id: 5,
        crop_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
    {
      id: 3,
      company_id: 6,
      crop_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('roles_companies_crops', null, {})
    ])
  }
}