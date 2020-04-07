'use strict'

const moment = require('moment')
const CommonService = require('./Common')

class AggregationUsers {
  /**
   * Total user sign and records to be signed are calculated.
   *
   * @param {*} crops
   */
  static async totalAggregationUsersApprovalByCrops(crops) {
    try {
      const aggregations = await this.getCropAggregationWithApprovals(crops)
    console.log(aggregations)
    let auxCropId = null
    let auxIdUser = null
    let arrayUsers = []

    for (const i in aggregations) {
      if (auxCropId !== aggregations[i].crop.id) {
        auxCropId = aggregations[i].crop.id

        for (const index in aggregations[i].crop_aggregations) {
          if (auxIdUser !== aggregations[i].crop_aggregations[index].user.id) {
            auxIdUser = aggregations[i].crop_aggregations[index].user.id
            if (
              arrayUsers.filter(
                (item) =>
                  item.user.id ===
                  aggregations[i].crop_aggregations[index].user.id
              ).length > 0
            ) {
              const objIndex = arrayUsers.findIndex(
                (obj) =>
                  obj.user.id ===
                  aggregations[i].crop_aggregations[index].user.id
              )
              arrayUsers[objIndex].total_register +=
                aggregations[i].crop_aggregations[
                  index
                ].usersApprovals.cantRegister
              arrayUsers[objIndex].total_signs +=
                aggregations[i].crop_aggregations[
                  index
                ].usersApprovals.cantSigns
              arrayUsers[objIndex].total_prom_diff_time +=
                aggregations[i].crop_aggregations[index].diffTimes.time_diff
            } else {
              const resum = {
                user: aggregations[i].crop_aggregations[index].user,
                total_register:
                  aggregations[i].crop_aggregations[index].usersApprovals
                    .cantRegister,
                total_signs:
                  aggregations[i].crop_aggregations[index].usersApprovals
                    .cantSigns,
                total_prom_diff_time:
                  aggregations[i].crop_aggregations[index].diffTimes.time_diff,
              }
              arrayUsers.push(resum)
            }
          }
        }
      }
    }

    return arrayUsers.map((item) => {
      return {
        user: item.user,
        total_register: item.total_register,
        total_signs: item.total_signs,
        total_prom_diff_time:
          item.total_prom_diff_time > 0
            ? item.total_prom_diff_time / item.total_signs
            : 0,
      }
    })
    }catch(error) {
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
          cantSign: item.Register.length > 0 ? item.Register[0].Signs.length : 0,
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
    }catch(error) {
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
          const diffTimes = await this.getPromTotalTimeDiffSingByUser(crop, user)
  
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
    }catch(error) {
      throw new Error(error)
    }
    
  }

  /**
   * Search all the approvals of a user by the parameter cropId.
   * For each approval counts the amount of User ApprovalRegister and Sings.
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

      return await this.countApprovalsRegisters(approvals)
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * Count the amount of ApprovalRegister and ApprovalRegisterSings.
   *
   * @param {*} approvals
   */
  static async countApprovalsRegisters(approvals) {
    const result = approvals.map((approval) => {
      return {
        registers: approval.Register,
        signs:
          approval.Register.length > 0 ? approval.Register[0].Signs.length : 0,
      }
    })

    return {
      cantRegister: result.length,
      cantSigns: result.reduce((a, b) => a + (b['signs'] || 0), 0),
    }
  }
}

module.exports = AggregationUsers
