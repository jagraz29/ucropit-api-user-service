'use strict'

const User = require('../../models').users
const Company = require('../../models').companies
const CompanyUserProfile = require('../../models').companies_users_profiles
const ContractCompany = require('../../models').contract_companies
const CompanyCrop = require('../../models').companies_crops
const Crop = require('../../models').crops
const CropType = require('../../models').crop_types
const Production = require('../../models').productions
const ProductionStage = require('../../models').production_stage

class ProfileService {

  /**
   * Get Profile User, companies associate 
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
              attributes: []
            },
            include: [
              {
                model: Company,
                as: 'productors',
                through: {
                  model: ContractCompany,
                  attributes: []
                },
                include: [
                  {
                    model: Crop,
                    where: { status: 'accepted' },
                    attributes: ['id', 'crop_name', 'units'],
                    as: 'productors_to',
                    through: {
                      model: CompanyCrop,
                      attributes: []
                    },
                    include: [
                      {
                        model: CropType,
                        attributes: ['id', 'name']
                      },
                      {
                        model: Production,
                        include:[
                          {
                            model: ProductionStage,
                            as: 'Stage'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      })
      return { error: false, userProfile }
    } catch (error) {
      console.log(
        `Error al realizar la query del user profile: ${error.message}`
      )
      return { error: true, msg: `${error.message}` }
    }
  }
}

module.exports = ProfileService
