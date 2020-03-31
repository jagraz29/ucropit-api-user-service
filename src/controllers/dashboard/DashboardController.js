'use strict'

const User = require('../../models').users
const Company = require('../../models').companies
const CompanyUserProfile = require('../../models').companies_users_profiles

class DashboardController {
  static async index(userId) {
    return  await User.findOne({
      where: { id: userId },
      include: [
        {
          model: Company,
          through: {
            model: CompanyUserProfile
          }
        }
      ]
    })
  }
}

module.exports = DashboardController
