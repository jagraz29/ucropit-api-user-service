'use strict'

const moment = require('moment')
const CompanyService = require('../company/CompanyService')
const CropService = require('../crops/CropService')
const CommonService = require('../../approvalRegisters/Common')

class StatusService {
  static async getStatusByCrop(cropId, companyId, stage = 'sowing') {
    let statusCrop = {}
    let daysCrops = {}
    try {
      const company = await CompanyService.getCompanyWithCrops(
        companyId,
        cropId,
        [
          'after_day_sowing',
          'before_day_sowing',
          'before_day_sowing',
          'before_day_harvest',
          'after_day_harvest',
        ]
      )

      const cropProductor = company.toJSON().productors_to[0]

      if (stage === 'harvest') {
        daysCrops = {
          date: cropProductor.end_at,
          dayIni: cropProductor.before_day_harvest,
          dayEnd: cropProductor.after_day_harvest,
        }
      } else {
        daysCrops = {
          date: cropProductor.start_at,
          dayIni: cropProductor.before_day_sowing,
          dayEnd: cropProductor.after_day_sowing,
        }
      }
      // Obtenemos una posición del punto donde nos encontramos con respecto a la fecha actual y la fecha de siembra o cosecha
      // del cultivo
      const statusDay = this.decideDayCrop(daysCrops)

      const approval = await CommonService.getApprovalWithRegisters({
        crop_id: cropId,
        stage: stage,
      })

      const cropsAndUsers = await CompanyService.getCompanyWithCropAndUsersBy(
        companyId,
        cropId
      )

      // Decidimos en que estado se encuentra nuestro cultivo parados en un rango de fechas
      // Luego calculamos el procentaje de avance de la siembra del cultivo.

      if (statusDay.xy) {
        statusCrop = this.statusBeforeDayConfig(
          approval[0],
          cropsAndUsers
        )
      }

      if (statusDay.y) {
        statusCrop = this.statusbetweenDay(approval[0], cropsAndUsers)
      }

      if (statusDay.z) {
        statusCrop = this.statusbetweenDay(approval[0], cropsAndUsers)
      }

      if (statusDay.zx) {
        statusCrop = this.statusAfterDay(approval[0], cropsAndUsers)
      }

      return statusCrop
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  //estoy en XY
  static statusBeforeDayConfig(approval, crop) {
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
  static statusbetweenDay(approval, crop) {
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

  static statusAfterDay(approval, crop) {
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

  /**
   * Devuelve un objeto con la coordenada en donde se encuentra el cultivo.
   * Utilizando la fecha de inicio de siembra y la fecha de cosecha más las 
   * Fechas de configuración configuradas.
   * 
   * @param {*} param0 
   */
  static decideDayCrop({ date, dateIni, dateEnd }) {
    const decide = {
      xy: false,
      y: false,
      z: false,
      zx: false,
    }
    const now = moment()
    const startMinusDate = moment(date).subtract(dateIni, 'days')
    const startDate = moment(date)
    const startAddDate = moment(date).add(dateEnd, 'days')

    if (now <= startMinusDate) {
      decide.xy = true
    }

    if (now > startMinusDate && now <= startDate) {
      decide.y = true
    }

    if (now >= startDate && now < startAddDate) {
      decide.z = true
    }

    if (now >= startAddDate) {
      decide.zx = true
    }

    return decide
  }

  /**
   * Se calcula el progreso del crop por medio de las aplicaciones firmadas.
   * retorna un valor expresado en porcentaje
   * 
   * @param {*} approval 
   * @param {*} crop 
   */
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

  /**
   * Verifica si la aplicacion tiene toda las firmas de los usuarios
   * Si tiene toda las firmas en una aplicaciíon completa.
   * 
   * @param {*} signs 
   * @param {*} users 
   */
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

  /**
   * Consulta el estado de cada cultivo de cada compañia productora, 
   * Verifica el estado si esta en siembra o en cosecha.
   * 
   * @param {*} company 
   */
  static async statusPerCrops(company) {
    try {
      let resultSowing = {}
      let resultHarvest = {}
      let listCropsPromise = await company
        .toJSON()
        .productors_to.map(async (crop) => {
          resultSowing = await this.getStatusByCrop(crop.id, company.id)
          const stageCrop = await CropService.getStageCrop(
            crop.id,
            company.id,
            resultSowing.percent
          )

          if (stageCrop.stage === 'harvest') {
            resultHarvest = await this.getStatusByCrop(
              crop.id,
              company.id,
              'harvest'
            )
          }

          const resultCrop =
            stageCrop.stage === 'harvest' ? resultHarvest : resultSowing

          return {
            ...crop,
            stage_now: stageCrop,
            status: resultCrop,
          }
        })

      const listCrops = await Promise.all(listCropsPromise)

      return {
        ...company.toJSON(),
        productors_to: listCrops,
      }
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  /**
   * Realiza el promedio ponderado de cada porcentaje de avance de los cultivos.
   * 
   * @param {*} company 
   */
  static async weightedAverageStatus(company) {
    try {
      let progress = await company.toJSON().productors_to.map(async (crop) => {
        let result = await this.getStatusByCrop(crop.id, company.id)

        const stageCrop = await CropService.getStageCrop(
          crop.id,
          company.id,
          result.percent
        )

        if (stageCrop.stage === 'harvest') {
          result = await this.getStatusByCrop(
            crop.id,
            company.id,
            'harvest'
          )
        }

        return {
          ...result,
          crop_id: crop.id,
          surface: crop.surface,
        }
      })

      progress = await Promise.all(progress)

      if (!progress) return 0

      const sumweighted = progress
        .filter((item) => item)
        .reduce((a, b) => a + (b['percent'] * b['surface'] || 0), 0)
      const sumsurface = progress.reduce((a, b) => a + (b['surface'] || 0), 0)

      return sumweighted / sumsurface
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }
}

module.exports = StatusService
