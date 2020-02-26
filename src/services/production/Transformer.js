'use strict'

class Transformer {
  /**
   * Get production stages in json format
   * @param {*} data
   */
  static getPermissionsParsed (data) {
    return data.map(el => {
      const production = el.get({ plain: true })
      return {
        id: el.id,
        user: el.user,
        stages: JSON.parse(production.data).stages
      }
    })
  }
}

module.exports = Transformer
