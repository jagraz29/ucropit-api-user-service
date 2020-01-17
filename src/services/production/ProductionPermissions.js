'use strict'

const Transformer = require('./Transformer')
const ProdUsersPermissions = require('../../models')
  .productions_users_permissions
const Users = require('../../models').users

class ProductionPermissions {
  /**
   * Get users than can sign
   *
   * @param {*} production
   * @param {*} stage
   */
  static async whoCanSign (production, stage) {
    try {
      const data = await ProdUsersPermissions.findAll({
        where: { production_id: production },
        include: [{ model: Users }]
      })

      console.log(data)

      const transformed = Transformer.getPermissionsParsed(data)
      
      const result = transformed.filter(el => {
        const stageFound = el.stages.find(el => {
          return el.key === stage
        })

        if (stageFound === undefined) throw new Error('Invalid stage given')

        return stageFound.permissions.can_sign
      })

      return result.map(el => el.user)
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = ProductionPermissions
