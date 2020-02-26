'use strict'

const Common = require('./Common')

const TOTAL_STAGES = 8

class Signers {
  /**
   * Get all signers to event.
   *
   * @param {*} stage
   * @param {*} cropId
   * @param {*} typeId
   * @param {*} type
   */
  static async getSigners(stage, cropId, typeId, type) {
    const permissions = await Common.getProductionPermisionsByCropId(cropId)
    let aux = []
    let canSignUsers = permissions
      .map((el) => {
        return {
          id: el.user_id,
          events: el.permissions.events.find((el) => stage === el.label),
          stages: el.permissions.stages.find((el) => stage === el.key),
          withoutEvents:
            el.permissions.events.filter((el) => el.events !== false).length ===
            0,
          allStages:
            el.permissions.stages.filter(
              (el) => el.permissions.can_sign === true
            ).length === TOTAL_STAGES
        }
      })
      .filter((el) => el.events !== undefined)
      
    aux = canSignUsers.filter((el) => {
      return el.allStages
    })

    if (stage !== 'fields') {
      canSignUsers = canSignUsers
        .filter((el) => el.events.events !== false)
        .filter((el) => {
          if (Array.isArray(el.events.events)) {
            return el.events.events.find((el) => {
              return (
                el.field_id == typeId &&
                el.type === type &&
                el.permissions.can_sign === true
              )
            })
          } else {
            return el
          }
        })
    } else {
      canSignUsers = canSignUsers.filter((el) => {
        return el.stages.permissions.can_sign === true
      })
    }

    return [...canSignUsers, ...aux]
  }
}

module.exports = Signers
