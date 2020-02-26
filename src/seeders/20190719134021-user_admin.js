'use strict'

const bcrypt = require('bcrypt')

async function encryptPassword (password) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return new Promise(async (resolve, reject) => {
      return queryInterface.bulkInsert(
        'users',
        [
          {
            first_name: 'John',
            last_name: 'Doe',
            email: 'admin@ucropit.com',
            password: await encryptPassword('secret')
          }
        ],
        {}
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {})
  }
}
