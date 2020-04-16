'use strict'

const CompanyService = require('../../services/dashboard/company/CompanyService')
const AggregationUsers = require('../../services/approvalRegisters/AggregationUsers')
const StatusService = require('../../services/dashboard/status/StatusService')

class DashboardController {
  static async statusCropsByCompany(companyId) {
    try {
      let status = {}
      const company = await CompanyService.getCompany(companyId)
      const percent = await StatusService.weightedAverageStatus(company)
      
      if(percent > 0 && percent <= 0.3333) {
        status = {
          percent,
          status: 'danger'
        }
      }

      if(percent > 0.3333 && percent <= 0.6666) {
        status = {
          percent,
          status: 'warning'
        }
      }

      if(percent > 0.6666 && percent <= 100) {
        status = {
          percent,
          status: 'finish'
        }
      }

      return status
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }
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
