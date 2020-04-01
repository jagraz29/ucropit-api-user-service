'use strict'

const User = require('../models').users
const Crop = require('../models').crops
const AggregationUser = require('../services/approvalRegisters/AggregationUsers')

class UserController {
  static async sings(croptype) {
    try {
      const users = await User.findAll({})

      let usersWhithApprovals = users.map(async (user) => {
        const crops = await Crop.findAll({
          where: { crop_type_id: croptype },
          include: [{ model: User, where: { id: user.id } }]
        })

        const approvals = await AggregationUser.userWithApprovals(crops, user)
        return { approvals }
      })

      return AggregationUser.getUsersWithApprovalsAggregation(
        usersWhithApprovals
      )
    } catch (error) {
      throw new Error(err)
    }
  }
}

module.exports = UserController
