'use strict'

const Services = require('../models').services
const Inputs = require('../models').inputs
const InputType = require('../models').input_types
const ServiceType = require('../models').service_types
const Sequelize = require('sequelize')
const { paginate } = require('../helpers')

class ConceptsController {
  static async index() {
    try {
      const inputs = await Inputs.findAll({ include: [{ model: InputType }] })
      const services = await Services.findAll({
        include: [{ model: ServiceType }],
      })

      return Promise.resolve([
        ...services.map((el) => {
          const plain = el.get({ plain: true })
          plain.category = 'service'
          return plain
        }),
        ...inputs.map((el) => {
          const plain = el.get({ plain: true })
          plain.category = 'input'
          return plain
        }),
      ])
    } catch (e) {
      console.erro(e)
      throw new Error(e)
    }
  }

  static async show(id, type) {
    try {
      if (type === 'service') {
        const input = await Services.findOne({
          where: { id },
          include: [{ model: ServiceType }],
        })
        return input
      } else {
        const services = await Inputs.findOne({
          where: { id },
          include: [{ model: InputType }],
        })
        return services
      }
    } catch (e) {
      console.erro(e)
      throw new Error(e)
    }
  }

  static async store(data) {
    try {
      const input = await Inputs.create({ ...data, stage: 'all' })

      return input
    } catch (e) {
      console.erro(e)
      throw new Error(e)
    }
  }

  static async update(id, data) {
    try {
      const input = await Inputs.findOne({ where: { id: id } })
      return await input.update(data)
    } catch (e) {
      console.error(e)
      throw new Error(e)
    }
  }

  static async delete(id) {
    try {
      const input = await Inputs.findOne({ where: { id: id } })
      return await input.destroy()
    } catch (e) {
      console.error(e)
      throw new Error(e)
    }
  }

  static async inputTypes(query) {
    try {
      const results = await InputType.findAll()

      return results
    } catch (e) {
      console.erro(e)
      throw new Error(e)
    }
  }

  static async inputTypesWithAttribute() {
    try {
      const results = await InputType.findAll({
        attributes: ['id', 'name'],
      })

      return results
    } catch (e) {
      console.erro(e)
      throw new Error(e)
    }
  }

  static async input() {
    try {
      const results = await Inputs.findAll({
        order: [['name', 'ASC']],
        include: [{ model: InputType }],
      })

      return results
    } catch (e) {
      console.error(e)
      throw new Error(e)
    }
  }

  static async inputsPaginate(page, pageSize) {
    const { count, rows: inputs } = await Inputs.findAndCountAll(
      paginate(
        {
          include: [{ model: InputType }],
        },
        { page, pageSize }
      )
    )

    return {
      total: Math.ceil(count / pageSize),
      perPage: pageSize,
      currentPage: page,
      lastPage: Math.ceil(count / pageSize - 1 + 1),
      data: inputs,
    }
  }

  static async searchInpuType(query) {
    const Op = Sequelize.Op
    try {
      const results = await InputType.findAll({
        where: { name: { [Op.like]: `%${query}%` } },
      })

      return results
    } catch (e) {
      console.erro(e)
      throw new Error(e)
    }
  }
}

module.exports = ConceptsController
