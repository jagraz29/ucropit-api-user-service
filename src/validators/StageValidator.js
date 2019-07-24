'use strict'

class StageValidator {
  static getValidStages () {
    return {
      fields: { label: 'Campo', status: true },
      'pre-sowing': { label: 'Pre-Siembra', status: true },
      sowing: { label: 'Siembra', status: true },
      protection: { label: 'Protección de Cultivos', status: true },
      'harvest-and-marketing': { label: 'Cosecha y Comercialización', status: false },
      'other-expenses': { label: 'Gastos administrativos', status: true },
      monitoring: { label: 'Monitoreo', status: true },
      deliveries: { label: 'Entregas', status: false }
    }
  }

  static isActive (stage) {
    const stages = StageValidator.getValidStages()
    if (!stages[stage]) {
      throw new Error(`Invalid Stage ${stage}`)
    }

    return stages[stage].status
  }
}

module.exports = StageValidator
