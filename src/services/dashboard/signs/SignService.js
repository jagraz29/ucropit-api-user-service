const CommonService = require('../../approvalRegisters/Common')
const StatusService = require('../../dashboard/status/StatusService')
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

          const sumApprovalsSowing = this.sumPercentApprovals(
            approvalsSowing,
            crop.surface
          )
          const sumApprovalsHarvest = this.sumPercentApprovals(
            approvalHarvest,
            crop.surface
          )

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

  static async sumPercentSignsApprovals(approvals, crop) {
    try {
      const sumApprovals = approvals.map(async (approval) => {
        const result = approval.Register.map(async (item) => {
          const complete = await StatusService.registerComplete(
            item.Signs,
            crop.users,
            approval
          )

          if (complete) {
            return {
              percent:
                Math.round(
                  (parseInt(JSON.parse(item.data).units) / crop.surface) * 100
                ) / 100,
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

  static sumPercentApprovals(approvals, surface) {
    const totalPercentApprovals = approvals.map((approval) => {
      let sumSurfaceRegister = 0
      if (approval && approval.Register.length > 0) {
        for (let register of approval.Register) {
          sumSurfaceRegister += parseInt(JSON.parse(register.data).units)
        }
      }

      return (sumSurfaceRegister * 100) / surface / 100
    })

    return totalPercentApprovals.length > 0 ? totalPercentApprovals[0] : 0
  }

  static weightedAverage(totalSowing, totalHarvest, surfaces, cantSatages) {
    return (
      (totalSowing * surfaces + totalHarvest * surfaces) /
      (surfaces * cantSatages)
    )
  }

  static async cantRegisters(crop, stage) {
    try {
      const approvals = await CommonService.getApprovalWithRegisters({
        crop_id: crop.id,
        stage: stage,
      })

      return approvals
        .map((item) => item.Register.length)
        .reduce((a, b) => a + b, 0)
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = SignService
