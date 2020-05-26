const Crop = require('../../../models').crops
const Company = require('../../../models').companies
const CompanyCrop = require('../../../models').companies_crops
const CompanyService = require('../company/CompanyService')
const _ = require('lodash')
const moment = require('moment')

class CropService {
  static async getStageCrop(cropId, companyId, percentCrop) {
    try {
      const crop = await this.getCrop(cropId, companyId)

      if (!crop)
        throw new Error('Error al obtener el crop y calcular su etapa actual')

      return this.stageCrop(crop, percentCrop)
    } catch (error) {
      throw new Error(error)
    }
  }

  static stageCrop(crop, percent) {
    const statusCrop = { stage: 'sowing' }
    const {
      expected_surface_percent,
      before_day_sowing,
      after_day_sowing,
      before_day_harvest,
      after_day_harvest,
    } = crop.productors[0].roles_companies_crops
    const now = moment()
    const startMinusDateSowing = moment(crop.start_at).subtract(
      before_day_sowing,
      'days'
    )
    const startAddDateSowing = moment(crop.start_at).add(
      after_day_sowing,
      'days'
    )
    const startMinusDateHarvest = moment(crop.end_at).subtract(
      before_day_harvest,
      'days'
    )
    const startAddDateHarvest = moment(crop.end_at).add(
      after_day_harvest,
      'days'
    )

    if (percent < expected_surface_percent) {
      statusCrop.stage = 'sowing'

      return statusCrop
    }

    if (now >= startMinusDateSowing && now <= startAddDateSowing) {
      statusCrop.stage = 'sowing'
    }

    if (
      (now < startMinusDateSowing || now > startAddDateSowing) &&
      now < startMinusDateHarvest
    ) {
      statusCrop.stage = 'sowing'
    }

    if (
      (now >= startMinusDateHarvest &&
        now <= startAddDateHarvest &&
        percent >= expected_surface_percent) ||
      (now > startAddDateHarvest && percent >= expected_surface_percent)
    ) {
      statusCrop.stage = 'harvest'
    }

    return statusCrop
  }

  static async getCrop(cropId, companyId) {
    try {
      const crop = await Crop.findOne({
        where: { id: cropId },
        include: [
          {
            model: Company,
            as: 'productors',
            where: { id: companyId },
            through: {
              model: CompanyCrop,
              attributes: [
                'expected_surface_percent',
                'before_day_sowing',
                'after_day_sowing',
                'before_day_harvest',
                'after_day_harvest',
              ],
            },
          },
        ],
      })

      return crop
    } catch (error) {
      console.log(error)
      return null
    }
  }

  /**
   * Gets a sum of crop's surfaces grouped by crop type
   *
   * @param {company} Integer id
   */
  static async getCropRegisteredSurfacesBy({ company }) {
    const companiesProductors = await CompanyService.getCompaniesProductors(
      company
    )

    const crops = {}

    companiesProductors.forEach((el) => {
      el.productors_to.forEach((el) => {
        crops[el.id] = el
      })
    })
    
    return _(crops)
      .map(({ id, crop_type, surface }) => {
        return {
          id,
          typeId: crop_type.id,
          name: crop_type.name,
          surface,
        }
      })
      .groupBy('typeId')
      .map((el) =>
        _.reduce(
          el,
          (prev, curr) => {
            return {
              ...prev,
              typeId: curr.typeId,
              name: curr.name,
              surface: prev.surface + curr.surface,
            }
          },
          { surface: 0 }
        )
      )
  }
}

module.exports = CropService