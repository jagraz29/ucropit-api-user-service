/* global logger */
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

class ProfileService {
  static async profile(user) {
    try {
      let profileUserCompany = await this.getProfileCompany(user)


      let listProfilesCompany = profileUserCompany.companies.map(
        async (company) => {
          const productors = company.productors.map(async (productor) => {
           
            const companyObj = await StatusService.statusPerCrops(productor, company)
            const percent = await StatusService.weightedAverageStatus(productor, company)
            return {
              ...companyObj,
              statusGlobal: {
                status: companyObj.statusGlobal.status,
                percent,
              },
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

      const filterCompanies = listProfilesCompany.map((item) => {
        const filterCompaniesCrops = item.productors.map((company) => {
          const filterCrops = company.productors_to.filter(
            (crop) => crop.roles_companies_crops.locator_id === item.id
          )

          return {
            ...company,
            productors_to: filterCrops
          }
        })

        return {
          ...item,
          productors: filterCompaniesCrops
        }
      })

      return { error: false, profile: filterCompanies }
    } catch (error) {
      logger.log({
        level: 'error',
        defaultMeta: {
          application: 'ProfileService Error',
          method: 'profile'
        },
        message: `Error al realizar la query del user profile: ${error.message}`,
        Date: new Date()
      })
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
                      attributes: ['locator_id'],
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
      logger.log({
        level: 'error',
        defaultMeta: {
          application: 'ProfileService Error',
          method: 'getProfileCompany'
        },
        message: `Error al realizar la query del user profile: ${error.message}`,
        Date: new Date()
      })
      console.log(
        `Error al realizar la query del user profile: ${error.message}`
      )
      return { error: true, msg: `${error.message}` }
    }
  }
}

module.exports = ProfileService
