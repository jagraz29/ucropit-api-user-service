'use strict'

const Sign = require('../models').signs
const PDF = require('../services/PDF')
const Stamp = require('../services/Stamp')

class SignsController {
  static async sign(id, type, auth) {
    try {
      const data = {
        type: type,
        type_id: id,
        user_id: auth.user.id,
      }

      const { hash, path } = await PDF.generate({
        data: {
          ...data,
          user: auth.user,
          time: new Date()
        },
        template: 'templates/sign-receipt.pug',
        path: `${__basedir}/../public/crop-${data.type_id}`,
        filename: `budget-user-${auth.user.id}.pdf`
      })

      return await Sign.create({
        ...data,
        hash,
        ots: await Stamp.stampHash(hash),
        meta: JSON.stringify({ path })
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = SignsController