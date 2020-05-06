'use strict'

const bcrypt = require('bcrypt')

async function encryptPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

module.exports = {
  up: (queryInterface) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async () => {
      return queryInterface.bulkInsert(
        'users',
        [
          {
            first_name: 'John',
            last_name: 'Doe',
            email: 'admin@ucropit.com',
            password: await encryptPassword('secret'),
          },
        ],
        {}
      )
    })
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('users', null, {})
  },
}
