'use strict'

const Provider = require('../models').providers
const { paginate } = require('../helpers')

class ProviderController {
  static async index (page, pageSize) {
    try {
      const providers = await Provider.findAll(
        paginate(
          {
            where: {}
          },
          { page, pageSize }
        )
      )

      return providers
    } catch (err) {
      throw new Error(err)
    }
  }

  static async show (id) {
    try {
      const provider = await Provider.findOne({ where: { id: id } })

      if (!provider) {
        return null
      }

      return provider
    } catch (err) {
      throw new Error(err)
    }
  }

  static async create (data) {
    try {
      const provider = await Provider.create({
        ...data,
        photo: `${process.env.BASE_URL}/uploads/default.png`
      })

      return provider
    } catch (err) {
      throw new Error(err)
    }
  }

  static async update (data, id) {
    try {
      const provider = await Provider.findOne({ where: { id: id } })
      return await provider.update(data)
    } catch (err) {
      throw new Error(err)
    }
  }

  static async delete (id) {
    try {
      const provider = await Provider.findOne({ where: { id: id } })
      return await provider.destroy()
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = ProviderController
