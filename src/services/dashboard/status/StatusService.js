'use strict'

const moment = require('moment')
const CompanyService = require('../company/CompanyService')
const CropService = require('../crops/CropService')
const CommonService = require('../../approvalRegisters/Common')

const ProductionUserPermission = require('../../../models')
  .productions_users_permissions

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

      if (stage === 'harvest-and-marketing') {
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
        statusCrop = this.statusBeforeDayConfig(approval[0], cropsAndUsers)
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
  static async statusBeforeDayConfig(approval, crop) {
    try {
      if (!approval || approval.Register.length === 0) {
        return {
          percent: 0,
          status: 'created',
          weight: 0,
        }
      }

      const progressCrop = await this.calculateProgress(approval, crop)

      if (
        progressCrop >=
        crop.productors_to[0].roles_companies_crops.expected_surface_percent
      ) {
        return {
          percent: progressCrop,
          status: 'done',
          weight: 1,
        }
      }

      return {
        percent: progressCrop,
        status: 'on_progress',
        weight: 2,
      }
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  //estoy en Y o en Z
  static async statusbetweenDay(approval, crop) {
    try {
      if (!approval || approval.Register.length === 0) {
        return {
          percent: 0,
          status: 'warning',
          weight: 3,
        }
      }
      const progressCrop = await this.calculateProgress(approval, crop)

      if (
        progressCrop >=
        crop.productors_to[0].roles_companies_crops.expected_surface_percent
      ) {
        return {
          percent: progressCrop,
          status: 'done',
          weight: 1,
        }
      }

      return {
        percent: progressCrop,
        status: 'on_progress',
        weight: 2,
      }
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  static async statusAfterDay(approval, crop) {
    try {
      if (!approval || approval.Register.length === 0) {
        return {
          percent: 0,
          status: 'error',
          weight: 5,
        }
      }

      const progressCrop = await this.calculateProgress(approval, crop)

      if (
        progressCrop >=
        crop.productors_to[0].roles_companies_crops.expected_surface_percent
      ) {
        return {
          percent: progressCrop,
          status: 'done',
          weight: 1,
        }
      }

      return {
        percent: progressCrop,
        status: 'error',
        weight: 5,
      }
    } catch (error) {
      console.log(error)
      throw new Error(error)
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
  static async calculateProgress(approval, crop) {
    try {
      let progress = approval.Register.map(async (item) => {
        const complete = await this.registerComplete(
          item.Signs,
          crop.productors_to[0].users,
          approval
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

      progress = await Promise.all(progress)
      progress = progress
        .filter((item) => item)
        .reduce((a, b) => a + (b['percent'] || 0), 0)

      return progress
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  /**
   * Verifica si la aplicacion tiene toda las firmas de los usuarios
   * Si tiene toda las firmas en una aplicaciíon completa.
   *
   * @param {*} signs
   * @param {*} users
   */
  static async registerComplete(signs, users, approval) {
    try {
      let complete = true
      for (const user of users) {
        if (
          signs.filter((item) => item.user_id === user.id).length === 0 &&
          (await this.checkUserHavePermission(
            approval.stage,
            approval.crop_id,
            user
          ))
        ) {
          complete = false
          return complete
        }
      }
      return complete
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  static async checkUserHavePermission(stage, cropId, user) {
    try {
      const permission = await ProductionUserPermission.findOne({
        where: { production_id: cropId, user_id: user.id },
      })
      const data = JSON.parse(permission.toJSON().data)

      const permissionsStage = data.stages
      const permissionsEvent = data.events

      const stageObj = permissionsStage.filter((item) => item.key === stage)
      const eventObj = permissionsEvent.filter((item) => item.label === stage)

      if (stageObj.length > 0) {
        return stageObj[0].permissions.can_edit
      }

      if (stageObj.length === 0 && eventObj.length > 0) {
        return eventObj[0].events[0].permissions.can_edit
      }

      return false
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  /**
   * Consulta el estado de cada cultivo de cada compañia productora,
   * Verifica el estado si esta en siembra o en cosecha.
   *
   * @param {*} company
   */
  static async statusPerCrops(company, locator) {
    try {
      let resultSowing = {}
      let resultHarvest = {}
      let listCropsPromise = await company
        .toJSON()
        .productors_to.map(async (crop) => {
          if(crop.roles_companies_crops.locator_id === locator.id) {
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
                'harvest-and-marketing'
              )
            }

            const resultCrop =
            stageCrop.stage === 'harvest' ? resultHarvest : resultSowing

            return {
              ...crop,
              stage_now: stageCrop,
              status: resultCrop,
            }
          }
          
          return null
        })

      let listCrops = await Promise.all(listCropsPromise)

      listCrops = listCrops.filter(item => item)

      return {
        ...company.toJSON(),
        productors_to: listCrops,
        statusGlobal: {
          status: this.getWorstStatusCompany(listCrops)
        }
      }
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  static getWorstStatusCompany(list) {
    let worst = list.reduce((result, item) => {
      let minRest = result.length ? result[0].status.weight : item.status.weight

      if (item.status.weight < minRest) {
        minRest = item.status.weight
        result.length = 0
      }

      if (item.status.weight === minRest) {
        result.push(item)
      }

      return result
    }, [])

    return worst[0].status.status
  }

  /**
   * Realiza el promedio ponderado de cada porcentaje de avance de los cultivos.
   *
   * @param {*} company
   */
  static async weightedAverageStatus(company, locator) {
    try {
      let progress = await company.toJSON().productors_to.map(async (crop) => {
        if(crop.roles_companies_crops.locator_id === locator.id) {
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
              'harvest-and-marketing'
            )
          }

          return {
            ...result,
            crop_id: crop.id,
            surface: crop.surface,
          }
        }
        
        return null
      })

      progress = await Promise.all(progress)
      progress = progress.filter(item => item)

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
