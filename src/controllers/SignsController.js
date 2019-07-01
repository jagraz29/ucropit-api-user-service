'use strict' 

const Sign = require('../models').signs

class SignsController {
  static async sign (id, type, auth) {
    try {
      return await Sign.create({
        type: type,
        type_id: id,
        user_id: auth.user.id
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = SignsController