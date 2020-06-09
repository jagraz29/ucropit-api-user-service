'use strict'

const moment = require('moment')

const CommonService = require('./Common')
const StatusService = require('../dashboard/status/StatusService')

class AggregationUsers {
  /**
   * Total user sign and records to be signed are calculated.
   *
   * @param {*} crops
   */
  static async totalAggregationUsersApprovalByCrops(crops) {
    try {
      const aggregations = await this.getCropAggregationWithApprovals(crops)

      let arrayUsers = []

      for (let crop of aggregations) {
        for (let aggregation of crop.crop_aggregations) {
          if (
            arrayUsers.filter((item) => item.user.id === aggregation.user.id)
              .length > 0
          ) {
            const objIndex = arrayUsers.findIndex(
              (obj) => obj.user.id === aggregation.user.id
            )
            arrayUsers[objIndex].total_register +=
              aggregation.usersApprovals.cantRegister
            arrayUsers[objIndex].total_signs +=
              aggregation.usersApprovals.cantSigns
            arrayUsers[objIndex].total_prom_diff_time +=
              aggregation.diffTimes.time_diff
          } else {
            const resum = {
              user: aggregation.user,
              total_register: aggregation.usersApprovals.cantRegister,
              total_signs: aggregation.usersApprovals.cantSigns,
              total_prom_diff_time: aggregation.diffTimes.time_diff,
            }
            arrayUsers.push(resum)
          }
        }
      }

      return arrayUsers.map((item) => {
        return {
          // TODO: AGREGAR EL ESTADO EN BASE AL PERCENT
          user: item.user,
          total_register: item.total_register,
          total_signs: item.total_signs,
          total_prom_diff_time:
            item.total_prom_diff_time > 0
              ? item.total_prom_diff_time / item.total_signs
              : 0,
        }
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * Calculate prom diff between date to create register and date sign user.
   *
   * @param {*} crop
   * @param {*} user
   */
  static async getPromTotalTimeDiffSingByUser(crop, user) {
    try {
      const approvals = await CommonService.getApprovalWithSingFiterUser(
        crop,
        user
      )
      const result = approvals.map((item) => {
        let timeDiff = 0
        if (item.Register.length > 0) {
          timeDiff = this.calculateDiffTime(
            item.Register[0],
            item.Register[0].Signs
          )
        }

        return {
          timeDiff: timeDiff,
          cantSign:
            item.Register.length > 0 ? item.Register[0].Signs.length : 0,
        }
      })

      const filterTimeDiff = result.find((item) => item.timeDiff > 0)
        ? result.find((item) => item.timeDiff > 0)
        : null

      return {
        time_diff: filterTimeDiff
          ? filterTimeDiff.timeDiff / filterTimeDiff.cantSign
          : 0,
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * Sum diff to date register with all signs to register.
   *
   * @param {*} register
   * @param {*} signs
   */
  static calculateDiffTime(register, signs) {
    const timeRegister = moment(register.createdAt)
    const result = signs.reduce(
      (a, b) =>
        a +
        (Math.abs(timeRegister.diff(moment(b['createdAt']), 'minutes')) || 0),
      0
    )

    return result
  }

  /**
   * The total number of signs per crop is obtained from a user.
   *
   * @param {*} crops
   *
   * @return Array
   */
  static async getCropAggregationWithApprovals(crops) {
    try {
      const signAggregation = crops.map(async (crop) => {
        const result = crop.users.map(async (user) => {
          const usersApprovals = await this.userWithApprovals(crop, user)
          const diffTimes = await this.getPromTotalTimeDiffSingByUser(
            crop,
            user
          )

          return {
            user: {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
            },
            usersApprovals,
            diffTimes,
          }
        })

        return {
          crop: { id: crop.id, name: crop.crop_name },
          crop_aggregations: await Promise.all(result),
        }
      })

      return await Promise.all(signAggregation)
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * Search all the approvals of a user by the parameter cropId.
   * For each approval counts the amount of User ApprovalRegister and Signs.
   *
   * @param Crop crops
   * @param User user
   *
   * @return Array
   */
  static async userWithApprovals(crop, user) {
    try {
      const approvals = await CommonService.getApprovalWithSingFiterUser(
        crop,
        user
      )

      const result = await this.countApprovalsRegisters(approvals, user)

      return result
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * Count the amount of ApprovalRegister and ApprovalRegisterSings.
   *
   * @param {*} approvals
   */
  static async countApprovalsRegisters(approvals, user) {
    const result = approvals.map(async (approval) => {
      //Verifica que el usuario en ese approval tenga permisos de firmas
      const resultPermission = await StatusService.checkUserHavePermission(
        approval.stage,
        approval.crop_id,
        user
      )

      return {
        registers: resultPermission ? approval.Register.length : 0,
        signs:
          approval.Register.length > 0
            ? resultPermission
              ? this.sumSigns(approval.Register)
              : 0
            : 0,
      }
    })

    const resultAsync = await Promise.all(result)

    return {
      cantRegister: resultAsync.reduce((a, b) => a + (b['registers'] || 0), 0),
      cantSigns: resultAsync.reduce((a, b) => a + (b['signs'] || 0), 0),
    }
  }


  static sumSigns(registers) {
    const registersSing = registers
      .map((register) => {
        return register.Signs.length
      })
      .filter((item) => item)
      .reduce((a, b) => a + b, 0)

    return registersSing
  }
}

module.exports = AggregationUsers
