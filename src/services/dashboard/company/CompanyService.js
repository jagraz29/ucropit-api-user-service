'use strict'

const Company = require('../../../models').companies
const ContractCompany = require('../../../models').contract_companies
const CompanyCrop = require('../../../models').companies_crops
const Crop = require('../../../models').crops
const User = require('../../../models').users
const CropType = require('../../../models').crop_types
const CropUser = require('../../../models').crop_users

const unique = (list) => {
  let aux = []
  return list.filter((value) => {
    if (
      aux.length === 0 ||
      aux.filter((item) => item === value.id).length === 0
    ) {
      aux.push(value.id)
      return value
    }
  })
}

class CompanyService {
  static async getCompanyWithCropAndUsersBy(companyId, cropId) {
    return Company.findOne({
      where: { id: companyId },
      include: [
        {
          model: Crop,
          where: { id: cropId },
          as: 'productors_to',
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
          include: [
            {
              model: User,
              through: {
                model: CropUser,
                attributes: ['id', 'first_name', 'last_name'],
              },
            },
          ],
        },
      ],
    })
  }

  static async getCompanyWithCrops(
    companyId,
    cropId = null,
    attributesRelationship = []
  ) {
    const filterCrop = cropId
      ? { status: 'accepted', id: cropId }
      : { status: 'accepted' }

    return Company.findOne({
      where: { id: companyId },
      include: [
        {
          model: Crop,
          where: filterCrop,
          attributes: [
            'id',
            'crop_name',
            'units',
            'start_at',
            'end_at',
            'surface',
          ],
          as: 'productors_to',
          through: {
            model: CompanyCrop,
            attributes: attributesRelationship,
          },
        },
      ],
    })
  }

  /**
   * Get Companies Productors, with crop associate and users
   *
   * @param {*} companyId
   * @param {*} cropTypeId
   */
  static async getCompaniesProductors(companyId, cropTypeId = null) {
    let queryCropType = {}
    if (cropTypeId) queryCropType = { id: cropTypeId }

    const result = await Company.findOne({
      where: { id: companyId },
      include: [
        {
          model: Company,
          as: 'productors',
          through: {
            model: ContractCompany,
            attributes: [],
          },
          include: [
            {
              model: Crop,
              where: { status: 'accepted' },
              attributes: ['id', 'crop_name', 'units', 'surface'],
              as: 'productors_to',
              through: {
                model: CompanyCrop,
                attributes: [],
              },
              include: [
                {
                  model: CropType,
                  where: queryCropType,
                  attributes: ['id', 'name'],
                },
                {
                  model: User,
                  through: {
                    model: CropUser,
                    attributes: ['id', 'first_name', 'last_name'],
                  },
                },
              ],
            },
          ],
        },
      ],
    })

    return result.toJSON().productors
  }

  static async getCompany(companyId) {
    return await Company.findOne({
      where: { id: companyId },
      include: [
        {
          model: Crop,
          where: { status: 'accepted' },
          as: 'productors_to',
          through: {
            model: CompanyCrop,
          },
        },
      ],
    })
  }

  /**
   * Get companies productos.
   *
   * @param {*} companies
   */
  static async cropsWithUsersCompany(companies) {
    const result = companies.map((item) => {
      const productors = item.productors_to.map((productor) => {
        return { ...productor }
      })

      return productors
    })

    const resultConcant = result.reduce((acc, val) => acc.concat(val), [])

    return unique(resultConcant)
  }

  static async cropTypesGroup(companies) {
    let listCropTypes = []
    try {
      const crops = await this.cropsWithUsersCompany(companies)

      for (const crop of crops) {
        if (
          listCropTypes.length === 0 ||
          listCropTypes.filter((item) => item.id === crop.crop_type.id)
            .length === 0
        ) {
          const cropType = {
            ...crop.crop_type,
            crops: [],
          }

          cropType.crops.push({
            id: crop.id,
            name: crop.crop_name,
            units: crop.units,
            surface: crop.surface,
            users: crop.users,
          })

          listCropTypes.push(cropType)
        } else {
          const objIndex = listCropTypes.findIndex(
            (obj) => obj.id === crop.crop_type.id
          )

          listCropTypes[objIndex].crops.push({
            id: crop.id,
            name: crop.crop_name,
            units: crop.units,
            surface: crop.surface,
            users: crop.users,
          })
        }
      }

      return listCropTypes
    } catch (error) {
      console.log(error)
      return null
    }
  }

  static statusCompany(percent) {
    let status = {}
    if (percent === 0) {
      status = {
        percent,
        status: 'default',
      }
    }

    if (percent > 0 && percent <= 0.3333) {
      status = {
        percent,
        status: 'error',
      }
    }

    if (percent > 0.3334 && percent <= 0.6666) {
      status = {
        percent,
        status: 'warning',
      }
    }

    if (percent > 0.6666 && percent <= 0.99) {
      status = {
        percent,
        status: 'on_progress',
      }
    }

    if (percent > 0.99) {
      status = {
        percent,
        status: 'done',
      }
    }

    return status
  }
}

module.exports = CompanyService
