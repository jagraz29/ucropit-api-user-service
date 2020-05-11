'use strict'

const moment = require('moment')
const CompanyService = require('../company/CompanyService')
const CropService = require('../crops/CropService');
const CommonService = require('../../approvalRegisters/Common')

class StatusService {
  static async getStatusByCrop(cropId, companyId) {
    let statusCrop = {}
    try {
      const company = await CompanyService.getCompanyWithCrops(
        companyId,
        cropId,
        ['after_day_sowing', 'before_day_sowing', 'before_day_sowing']
      )

      const cropProductor = company.toJSON().productors_to[0]
      // Obtenemos una posición del punto donde nos encontramos con respecto a la fecha actual y la fecha de siembra
      // del cultivo
      const statusDay = this.decideDaySowing(cropProductor);

      const approval = await CommonService.getApprovalWithRegisters({
        crop_id: cropId,
        stage: 'sowing',
      })

      const cropsAndUsers = await CompanyService.getCompanyWithCropAndUsersBy(
        companyId,
        cropId
      )

      // Decidimos en que estado se encuentra nuestro cultivo parados en un rango de fechas
      // Luego calculamos el procentaje de avance de la siembra del cultivo.

      if (statusDay.xy) {
        statusCrop = this.statusBeforeDayConfigSowing(
          approval[0],
          cropsAndUsers
        )
      }

      if (statusDay.y) {
        statusCrop = this.statusbetweenDaySowing(approval[0], cropsAndUsers)
      }

      if (statusDay.z) {
        statusCrop = this.statusbetweenDaySowing(approval[0], cropsAndUsers)
      }

      if (statusDay.zx) {
        statusCrop = this.statusAfterDaySowing(approval[0], cropsAndUsers)
      }

      return statusCrop
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  //estoy en XY
  static statusBeforeDayConfigSowing(approval, crop) {
    if (!approval || approval.Register.length === 0) {
      return {
        percent: 0,
        status: 'created',
      }
    }

    const progressCrop = this.calculateProgress(approval, crop)

    if (
      progressCrop >=
      crop.productors_to[0].roles_companies_crops.expected_surface_percent
    ) {
      return {
        percent: progressCrop,
        status: 'done',
      }
    }

    return {
      percent: progressCrop,
      status: 'on_progress',
    }
  }

  //estoy en Y o en Z
  static statusbetweenDaySowing(approval, crop) {
    if (!approval || approval.Register.length === 0) {
      return {
        percent: 0,
        status: 'warning',
      }
    }
    const progressCrop = this.calculateProgress(approval, crop)

    if (
      progressCrop >=
      crop.productors_to[0].roles_companies_crops.expected_surface_percent
    ) {
      return {
        percent: progressCrop,
        status: 'done',
      }
    }

    return {
      percent: progressCrop,
      status: 'on_progress',
    }
  }

  static statusAfterDaySowing(approval, crop) {
    if (!approval || approval.Register.length === 0) {
      return {
        percent: 0,
        status: 'error',
      }
    }

    const progressCrop = this.calculateProgress(approval, crop)

    if (
      progressCrop >=
      crop.productors_to[0].roles_companies_crops.expected_surface_percent
    ) {
      return {
        percent: progressCrop,
        status: 'done',
      }
    }

    return {
      percent: progressCrop,
      status: 'error',
    }
  }

  static decideDaySowing(crop) {
    const decide = {
      xy: false,
      y: false,
      z: false,
      zx: false,
    }
    const now = moment()
    const startMinusDateSowing = moment(crop.start_at).subtract(
      crop.roles_companies_crops.before_day_sowing,
      'days'
    )
    const startDateSowign = moment(crop.start_at)
    const startAddDateSowing = moment(crop.start_at).add(
      crop.roles_companies_crops.after_day_sowing,
      'days'
    )

    if (now <= startMinusDateSowing) {
      decide.xy = true
    }

    if (now > startMinusDateSowing && now <= startDateSowign) {
      decide.y = true
    }

    if (now >= startDateSowign && now < startAddDateSowing) {
      decide.z = true
    }

    if (now >= startAddDateSowing) {
      decide.zx = true
    }

    return decide
  }

  static calculateProgress(approval, crop) {
    const progress = approval.Register.map((item) => {
      const complete = this.registerComplete(
        item.Signs,
        crop.productors_to[0].users
      )

      if (complete) {
        return {
          percent:
            Math.round(
              (parseInt(JSON.parse(item.data).units) /
                crop.productors_to[0].surface) *
                100
            ) / 100,
        }
      }
    })
      .filter((item) => item)
      .reduce((a, b) => a + (b['percent'] || 0), 0)

    return progress
  }

  static registerComplete(signs, users) {
    let complete = true
    for (const user of users) {
      if (signs.filter((item) => item.user_id === user.id).length === 0) {
        complete = false
        return complete
      }
    }
    return complete
  }

  static async statusPerCrops(company) {
    try {
      let listCropsPromise = await company.toJSON().productors_to.map(async (crop) => {
        const result = await this.getStatusByCrop(crop.id, company.id)
        const stageCrop = await CropService.getStageSowing(crop.id, company.id, result.percent)

        return {
          ...crop,
          stage_now: stageCrop,
          status: result
        }
      })

      const listCrops = await Promise.all(listCropsPromise)

      return {
        ...company.toJSON(),
        productors_to: listCrops
      }
    }catch(error) {
      console.log(error)
      throw new Error(error)
    }
  }

  static async weightedAverageStatus(company) {
    try {
      let progress = await company.toJSON().productors_to.map(async (crop) => {
        const result = await this.getStatusByCrop(crop.id, company.id)

        return {
          ...result,
          crop_id: crop.id,
          surface: crop.surface,
        }
      })

      progress = await Promise.all(progress)

      if(!progress) return 0

      const sumweighted = progress.filter(item => item).reduce(
        (a, b) => a + (b['percent'] * b['surface'] || 0),
        0
      )
      const sumsurface = progress.reduce((a, b) => a + (b['surface'] || 0), 0)

      return sumweighted / sumsurface
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }
}

module.exports = StatusService
