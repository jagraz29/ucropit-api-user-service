'use strict'

const CompanyService = require('../../services/dashboard/company/CompanyService')
const AggregationUsers = require('../../services/approvalRegisters/AggregationUsers')

class DashboardController {
  static async statisticSings(croptypeId, companyId) {
    try {
      const productors = await CompanyService.getCompaniesProductors(
        croptypeId,
        companyId
      )

      const cropsWithUsers = await CompanyService.cropsWithUsersCompany(
        productors
      )

      const aggregationSign = await AggregationUsers.totalAggregationUsersApprovalByCrops(
        cropsWithUsers
      )

      return aggregationSign
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = DashboardController
