'use strict'

const Services = require("../models").services;
const Inputs = require("../models").inputs;
const InputType = require("../models").input_types;
const ServiceType = require("../models").service_types;

class ConceptsController {
  static async index() {
    try {
      const inputs = await Inputs.findAll({include: [{model: InputType}]})
      const services = await Services.findAll({include: [{model: ServiceType}]})

      return Promise.resolve([
        ...services.map(el => {
          const plain = el.get({plain: true})
          plain.category = 'service'
          return plain
        }),
        ...inputs.map(el => {
          const plain = el.get({plain: true})
          plain.category = 'input'
          return plain
        })
      ])
    } catch (e) {
      throw new Error(e)
    }
  }

  static async show(id, type) {
    console.log(id, type === 'service')
    try {
      if (type === 'service') {
        const input = await Services.findOne({where: {id}, include: [{model: ServiceType}]})
        return input
      } else {
        const services = await Inputs.findOne({where: {id}, include: [{model: InputType}]})
        return services
      }
    } catch (e) {
      throw new Error(e)
    }
  }
}

module.exports = ConceptsController