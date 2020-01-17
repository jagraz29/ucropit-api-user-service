'use static'

const Common = require('./Common')
const Mail = require('../Mail')
const ProductionPermissions = require('../production/ProductionPermissions')

class Sender {
  /**
   * Send via mail request approbation register
   * @param {*} param0
   */
  static async needApprobation ({ approvalRegister, stage, authUser, pathname }) {
    try {
      const production = await Common.getProductionBy(approvalRegister)

      const usersCanSign = await ProductionPermissions.whoCanSign(
        production.crop_id,
        stage
      )

      const filteredUsers = usersCanSign
        .filter(el => el !== null)
        .filter(el => el.id !== authUser.id)
        .map(el => el.id)

      await Mail.sendNotificationMail({
        data: {
          path: pathname,
          production,
          stage: stagesName(stage)
        },
        usersID: filteredUsers,
        type: 'need_approbation'
      })
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = Sender
