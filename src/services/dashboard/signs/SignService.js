const CommonService = require('../../approvalRegisters/Common')
const StatusService = require('../../dashboard/status/StatusService')
const CompanyService = require('../../dashboard/company/CompanyService')

class SignService {
  static async summaryRegister(companies) {
    try {
      const companiesSumRegisters = companies.map(async (company) => {
        const totalRegister = company.productors_to.map(async (crop) => {
          const approvalsSowing = await CommonService.getApprovalWithRegisters({
            crop_id: crop.id,
            stage: 'sowing',
          })

          const approvalHarvest = await CommonService.getApprovalWithRegisters({
            crop_id: crop.id,
            stage: 'harvest-and-marketing',
          })

          const sumApprovalsSowing = this.sumPercentApprovals(approvalsSowing)
          const sumApprovalsHarvest = this.sumPercentApprovals(approvalHarvest)

          return this.weightedAverage(
            sumApprovalsSowing,
            sumApprovalsHarvest,
            crop.surface,
            2
          )
        })

        return {
          id: company.id,
          name: company.name,
          totalRegister: await Promise.all(totalRegister),
        }
      })

      return await Promise.all(companiesSumRegisters)
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  static async summarySigned(companies) {
    try {
      const totalSignsProgress = companies.map(async (company) => {
        const totalSigns = company.productors_to.map(async (crop) => {
          const approvalsSowing = await CommonService.getApprovalWithRegisters({
            crop_id: crop.id,
            stage: 'sowing',
          })

          const approvalHarvest = await CommonService.getApprovalWithRegisters({
            crop_id: crop.id,
            stage: 'harvest-and-marketing',
          })

          const percentSignSowing = await this.sumPercentSignsApprovals(
            approvalsSowing,
            crop
          )

          const percentSignsSowing = await this.sumPercentSignsApprovals(
            approvalHarvest,
            crop
          )

          return this.weightedAverage(
            percentSignSowing,
            percentSignsSowing,
            crop.surface,
            2
          )
        })

        return {
          id: company.id,
          name: company.name,
          totalSigns: await Promise.all(totalSigns),
        }
      })

      return await Promise.all(totalSignsProgress)
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  static async summaryRegisterByCropTypes(productors) {
    try {
      const cropsGroupByCropTypes = await CompanyService.cropTypesGroup(
        productors
      )

      const percentsRegisters = cropsGroupByCropTypes.map(async (cropType) => {
        const weightCrops = cropType.crops.map(async (crop) => {
          const approvalsSowing = await CommonService.getApprovalWithRegisters({
            crop_id: crop.id,
            stage: 'sowing',
          })

          const approvalHarvest = await CommonService.getApprovalWithRegisters({
            crop_id: crop.id,
            stage: 'harvest-and-marketing',
          })

          const sumApprovalsSowing = this.sumPercentApprovals(approvalsSowing)
          const sumApprovalsHarvest = this.sumPercentApprovals(approvalHarvest)

          return {
            ...crop,
            surfaceCrop: crop.surface,
            surfaceRegiterSowing: sumApprovalsSowing,
            surfaceRegisterHarvest: sumApprovalsHarvest,
          }
        })

        const weightCropsSync = await Promise.all(weightCrops)

        return {
          ...cropType,
          totalSurfaceCropType: weightCropsSync.reduce(
            (a, b) => a + (b['surfaceCrop'] || 0),
            0
          ) * 2,
          totalSurfaceSowing: weightCropsSync.reduce(
            (a, b) => a + (b['surfaceRegiterSowing'] || 0),
            0
          ),
          totalSurfaceHarvest: weightCropsSync.reduce(
            (a, b) => a + (b['surfaceRegisterHarvest'] || 0),
            0
          ),
        }
      })

      return await Promise.all(percentsRegisters)
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  static async summarySignedByCropTypes(productors) {
    try {
      const cropsGroupByCropTypes = await CompanyService.cropTypesGroup(
        productors
      )

      const percentsRegisters = cropsGroupByCropTypes.map(async (cropType) => {
        const weightCrops = cropType.crops.map(async (crop) => {
          const approvalsSowing = await CommonService.getApprovalWithRegisters({
            crop_id: crop.id,
            stage: 'sowing',
          })

          const approvalHarvest = await CommonService.getApprovalWithRegisters({
            crop_id: crop.id,
            stage: 'harvest-and-marketing',
          })

          const sumApprovalsSowing = await this.sumPercentSignsApprovals(approvalsSowing, crop)
          const sumApprovalsHarvest = await this.sumPercentSignsApprovals(approvalHarvest, crop)

          return {
            ...crop,
            surfaceCrop: crop.surface,
            surfaceSignedSowing: sumApprovalsSowing,
            surfaceSignedHarvest: sumApprovalsHarvest,
          }
        })

        const weightCropsSync = await Promise.all(weightCrops)

        return {
          ...cropType,
          totalSurfaceCropType: weightCropsSync.reduce(
            (a, b) => a + (b['surfaceCrop'] || 0),
            0
          ) * 2,
          totalSurfaceSowing: weightCropsSync.reduce(
            (a, b) => a + (b['surfaceSignedSowing'] || 0),
            0
          ),
          totalSurfaceHarvest: weightCropsSync.reduce(
            (a, b) => a + (b['surfaceSignedHarvest'] || 0),
            0
          ),
        }
      })

      return await Promise.all(percentsRegisters)
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  static async sumPercentSignsApprovals(approvals, crop) {
    try {
      const sumApprovals = approvals.map(async (approval) => {
        let sumSurfaceSigned = 0
        const result = approval.Register.map(async (item) => {
          const complete = await StatusService.registerComplete(
            item.Signs,
            crop.users,
            approval
          )

          if (complete) {
            return {
              percent: (sumSurfaceSigned += item.data
                ? parseInt(JSON.parse(item.data).units)
                : 0),
            }
          }
        })

        let progress = await Promise.all(result)
        progress = progress
          .filter((item) => item)
          .reduce((a, b) => a + (b['percent'] || 0), 0)

        return progress
      })

      const resultSum = await Promise.all(sumApprovals)

      return resultSum.reduce((a, b) => a + (b || 0), 0)
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  static sumPercentApprovals(approvals) {
    const totalPercentApprovals = approvals.map((approval) => {
      let sumSurfaceRegister = 0
      if (approval && approval.Register.length > 0) {
        for (let register of approval.Register) {
          sumSurfaceRegister += register.data
            ? parseInt(JSON.parse(register.data).units)
            : 0
        }
      }

      return sumSurfaceRegister
    })

    return totalPercentApprovals.length > 0 ? totalPercentApprovals[0] : 0
  }

  static weightedAverage(totalSowing, totalHarvest, surfaces, cantStages) {
    return (totalSowing + totalHarvest) / (surfaces * cantStages)
  }

  static async totalCanRegisterByStage(listCompanies) {
    let listStage = [
      {
        stage: 'fields',
        name: 'Campo',
        cantRegisters: 0,
        cantFiles: 0
      },
      {
        stage: 'pre-sowing',
        name: 'Pre-Siembra',
        cantRegisters: 0,
        cantFiles: 0
      },
      {
        stage: 'sowing',
        name: 'Siembra',
        cantRegisters: 0,
        cantFiles: 0
      },
      {
        stage: 'protection',
        name: 'Protección de Cultivos',
        cantRegisters: 0,
        cantFiles: 0,
      },
      {
        stage: 'harvest-and-marketing',
        name: 'Cosecha y Comercialización',
        cantRegisters: 0,
        cantFiles: 0,
      },
      {
        stage: 'other-expenses',
        name: 'Gastos administrativos',
        cantRegisters: 0,
        cantFiles: 0,
      },
      {
        stage: 'monitoring',
        name: 'Monitoreo',
        cantRegisters: 0,
        cantFiles: 0,
      },
    ]

    const cropWithUsers = await CompanyService.cropsWithUsersCompany(
      listCompanies
    )

    for (let crop of cropWithUsers) {
      for (let item of listStage) {
        const result = await this.cantRegisters(crop, item.stage)
        if (result) {
          listStage = this.sumRegisterByStages(listStage, result)
        }
      }
    }

    return listStage
  }

  static sumRegisterByStages(listStage, registerStage) {
    for (let index in listStage) {
      if (listStage[index].stage === registerStage.stage) {
        listStage[index].cantRegisters += registerStage.register
        listStage[index].cantFiles += registerStage.files
      }
    }

    return listStage
  }

  static async cantRegisters(crop, stage) {
    try {
      const approvals = await CommonService.getApprovalWithRegisters({
        crop_id: crop.id,
        stage: stage,
      })

      let registerWithApprovals = approvals.map(async (approval) => {
        let resultRegister = approval.Register.map(async (item) => {
          const complete = await StatusService.registerComplete(
            item.Signs,
            crop.users,
            approval
          )
          if (complete) {
            return {
              stage: stage,
              register: 1,
              files: item.Files.length,
            }
          }

          return {
            stage: stage,
            register: 0,
            files: 0,
          }
        })

        resultRegister = await Promise.all(resultRegister)

        return {
          stage: resultRegister[0].stage,
          register: resultRegister.reduce(
            (a, b) => a + (b['register'] || 0),
            0
          ),
          files: resultRegister.reduce((a, b) => a + (b['files'] || 0), 0),
        }
      })

      registerWithApprovals = await Promise.all(registerWithApprovals)

      return registerWithApprovals[0]
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = SignService
