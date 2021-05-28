import chalk from 'chalk'
import models from '../../models'
import NotificationService from '../../services/NotificationService'
import { emailTemplates } from '../../types/common'

const Achievement = models.Achievement
const Activity = models.Activity

module.exports = function (agenda) {
  agenda.define('reminder-activity-email', async job => {
    try {
      const {
        url,
        activityLabel,
        cropName,
        activity,
        achievement
      } = job.attrs.data

      const result = await Activity.findOne({ _id: activity }).populate({
        path: 'achievements',
        match: {
          _id: achievement
        }
      })

      if (result.achievements?.length > 0) {
        for (let signer of result.achievements[0].signers) {
          if (!signer.signed) {
            await NotificationService.email(
              emailTemplates.NOTIFICATION_ACTIVITY,
              signer,
              {
                name: signer.fullName,
                cropName,
                url,
                activity: activityLabel
              },
              {
                title: 'Recordatorio para firmar',
                content: 'Tenes realizaciones sin firmar'
              }
            )
          }
        }
      }
    } catch (err) {
      console.error(err)
      console.log(`${chalk.green(`[${new Date()}] EMAIL REMINDER EXECUTED`)}`)
    }
  })
}
