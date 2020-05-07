'use strict'

const CompanyService = require('../../services/dashboard/company/CompanyService')
const AggregationUsers = require('../../services/approvalRegisters/AggregationUsers')
const StatusService = require('../../services/dashboard/status/StatusService')

class DashboardController {
  
  static async statusCropByCompanyCrop(cropId, companyId) {
    try {
      return await StatusService.getStatusByCrop(cropId, companyId)
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

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
      console.log(error)
      throw new Error(error)
    }
  }
}

module.exports = DashboardController
