'use strict'

const Approval = require('../../models').approval
const ApprovalRegister = require('../../models').approval_register
const ApprovalRegisterSign = require('../../models').approval_register_sign

class AggregationUsers {
  /**
   * Total user sign and records to be signed are calculated.
   * 
   * @param {*} crops 
   */
  static async totalAggregationUsersApprovalByCrops(crops) {
    const aggregations = await this.getCropAggregationWithApprovals(crops)
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
            } else {
              const resum = {
                user: aggregations[i].crop_aggregations[index].user,
                total_register:
                  aggregations[i].crop_aggregations[index].usersApprovals
                    .cantRegister,
                total_signs:
                  aggregations[i].crop_aggregations[index].usersApprovals
                    .cantSigns,
              }
              arrayUsers.push(resum)
            }
          }
        }
      }
    }

    return arrayUsers
  }
  /**
   * The total number of signs per crop is obtained from a user.
   * 
   * @param {*} crops
   *
   * @return Array
   */
  static async getCropAggregationWithApprovals(crops) {
    const signAggregation = crops.map(async (crop) => {
      const result = crop.users.map(async (user) => {
        const usersApprovals = await this.userWithApprovals(crop, user)
        return {
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
          },
          usersApprovals,
        }
      })

      return {
        crop: { id: crop.id, name: crop.crop_name },
        crop_aggregations: await Promise.all(result),
      }
    })

    return await Promise.all(signAggregation)
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
      const approvals = await Approval.findAll({
        where: { crop_id: crop.id },
        include: [
          {
            model: ApprovalRegister,
            as: 'Register',
            include: [
              {
                model: ApprovalRegisterSign,
                as: 'Signs',
                where: { user_id: user.id },
              },
            ],
          },
        ],
      })

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
