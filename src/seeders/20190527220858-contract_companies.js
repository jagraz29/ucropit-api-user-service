'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'contract_companies',
      [
        {
          id: 1,
          locator_id: 1,
          productor_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
          before_day_sowing: 5,
          after_day_sowing: 5,
          expected_surface_percent: 0.6,
        },
        {
          id: 2,
          locator_id: 1,
          productor_id: 3,
          created_at: new Date(),
          updated_at: new Date(),
          before_day_sowing: 5,
          after_day_sowing: 5,
          expected_surface_percent: 0.6,
        },
        {
          id: 3,
          locator_id: 1,
          productor_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
          before_day_sowing: 5,
          after_day_sowing: 5,
          expected_surface_percent: 0.6,
        },
        {
          id: 4,
          locator_id: 1,
          productor_id: 5,
          created_at: new Date(),
          updated_at: new Date(),
          before_day_sowing: 5,
          after_day_sowing: 5,
          expected_surface_percent: 0.6,
        },
      ],
      {}
    )
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.bulkDelete('contract_companies', null, {}),
    ])
  },
}
