'use strict'

class StageValidator {
  static getValidStages () {
    return {
      fields: { label: 'Campo', status: true, order: 0 },
      'pre-sowing': { label: 'Pre-Siembra', status: true, order: 1 },
      sowing: { label: 'Siembra', status: true, order: 2 },
      protection: { label: 'Protección de Cultivos', status: true, order: 3 },
      'other-expenses': { label: 'Otros gastos e ingresos', status: true, order: 4 },
      monitoring: { label: 'Monitoreo', status: true, order: 5 },
      'harvest-and-marketing': { label: 'Cosecha y Comercialización', status: true, order: 6 },
      deliveries: { label: 'Entregas', status: false, order: 7 }
    }
  }

  static isActive (stage) {
    const stages = StageValidator.getValidStages()
    if (!stages[stage]) {
      throw new Error(`Invalid Stage ${stage}`)
    }

    return stages[stage].status
  }

  static getOrder (stage) {
    const stages = StageValidator.getValidStages()
    if (!stages[stage]) {
      throw new Error(`Invalid Stage ${stage}`)
    }

    return stages[stage].order
  }
}

module.exports = StageValidator
