'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('crop_monitoring_settings', [
      {
        id: 1,
        cant_day_start_sowing: 5,
        cant_day_end_sowing: 5,
        cant_day_start_harvest: 8,
        cant_day_end_harvest: 8,
        expected_surface: 0.6,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('crop_monitoring_settings', null, {})
    ])
  },
}
