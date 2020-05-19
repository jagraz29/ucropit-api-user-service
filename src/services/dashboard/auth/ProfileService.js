'use strict'

const User = require('../../../models').users
const Company = require('../../../models').companies
const CompanyUserProfile = require('../../../models').companies_users_profiles
const ContractCompany = require('../../../models').contract_companies
const CompanyCrop = require('../../../models').companies_crops
const Crop = require('../../../models').crops
const CropType = require('../../../models').crop_types
const Production = require('../../../models').productions

const StatusService = require('../../../services/dashboard/status/StatusService')
const CompanyService = require('../../../services/dashboard/company/CompanyService')

class ProfileService {
  static async profile(user) {
    console.log()
    try {
      let profileUserCompany = await this.getProfileCompany(user)

      let listProfilesCompany = profileUserCompany.companies.map(
        async (company) => {
          const productors = company.productors.map(async (productor) => {
            const companyObj = await StatusService.statusPerCrops(productor)
            const percent = await StatusService.weightedAverageStatus(productor)
            const statusGlobal = CompanyService.statusCompany(percent)
            return {
              ...companyObj,
              statusGlobal,
            }
          })

          const productorsList = await Promise.all(productors)

          return {
            ...company.toJSON(),
            productors: productorsList,
          }
        }
      )

      listProfilesCompany = await Promise.all(listProfilesCompany)

      return { error: false, profile: listProfilesCompany }
    } catch (error) {
      return { error: true, msg: `${error}` }
    }
  }

  /**
   * Get Profile User, companies associate.
   *
   * @param {*} user
   *
   * @return Object
   */
  static async getProfileCompany(user) {
    try {
      const userProfile = await User.findOne({
        where: { id: user.id },
        include: [
          {
            model: Company,
            through: {
              model: CompanyUserProfile,
              attributes: ['default_login'],
            },
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
                    attributes: [
                      'id',
                      'crop_name',
                      'units',
                      'surface',
                      'quintals',
                      'reference_price',
                      'start_at',
                      'end_at',
                    ],
                    as: 'productors_to',
                    through: {
                      model: CompanyCrop,
                      attributes: [],
                    },
                    include: [
                      {
                        model: CropType,
                        attributes: ['id', 'name'],
                      },
                      {
                        model: Production,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      })
      return userProfile
    } catch (error) {
      console.log(
        `Error al realizar la query del user profile: ${error.message}`
      )
      return { error: true, msg: `${error.message}` }
    }
  }
}

module.exports = ProfileService
