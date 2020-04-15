'use strict'

const Company = require('../../../models').companies
const ContractCompany = require('../../../models').contract_companies
const CompanyCrop = require('../../../models').companies_crops
const Crop = require('../../../models').crops
const User = require('../../../models').users
const CropType = require('../../../models').crop_types
const CropUser = require('../../../models').crop_users

class CompanyService {
  static async getCompanyWithCropAndUsersBy(companyId, cropId) {
    return await Company.findOne({
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

    return await Company.findOne({
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
              attributes: ['id', 'crop_name', 'units'],
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

    return result.reduce((acc, val) => acc.concat(val), [])
  }
}

module.exports = CompanyService
