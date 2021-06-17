require('dotenv').config()
import models, { connectDb } from '../models'
import chalk from 'chalk'
import CropService from '../services/CropService'
import ActivityService from '../services/ActivityService'
import BlockChainServices from '../services/BlockChainService'
import ApprovalRegisterSingService from '../services/ApprovalRegisterSignService'
import { Command, OptionValues } from 'commander'

const Crop = models.Crop

const program = new Command()

// Configuration Commands
program
  .description('Use command for sign missing signature activities')
  .option(
    '-s, --sign-activities <status> [status-activity]',
    'Search activities with all signatures and send them to stamp to blockchain'
  )
  .option(
    '-c, --create-sing-crops',
    'Send to blockchain the activities in the finished and missing state of ots files'
  )

program.parse(process.argv)

/**
 * Process sign activities to ready signed.
 *
 * @param string status
 */
async function signActivities(status: string): Promise<void> {
  const crops: any = await getCropsByStatusActivities(status)

  for (const crop of crops) {
    const { done } = crop
    for (const activity of done) {
      if (
        existAchievements(activity) &&
        activityAchievementsReadyStamp(activity)
      ) {
        await stampBlockChain(activity, crop)
        await changeStatusActivityInCrop(activity, crop)
      }

      if (!existAchievements(activity) && activityReadyStamp(activity)) {
        await stampBlockChain(activity, crop)
        await changeStatusActivityInCrop(activity, crop)
      }
      console.log(
        `${chalk.green(`PROCESS SIGNED ACTIVITY: ${activity.type.name.es}`)}`
      )
      console.log(`${chalk.green(`ACTIVITY SIGNED: ${activity.id}`)}`)
    }
  }
}

/**
 * Verify activity is ready to stamp in block chain.
 *
 * @param activity
 *
 * @returns boolean
 */
function activityReadyStamp(activity): boolean {
  return (
    !activity.approvalRegister && ActivityService.isCompleteSingers(activity)
  )
}

/**
 * Verify is complete sign and percent achievements.
 *
 * @param activity
 *
 * @returns boolean
 */
function activityAchievementsReadyStamp(activity): boolean {
  return (
    !activity.approvalRegister &&
    ActivityService.isCompleteSignersAchievements(activity) &&
    ActivityService.isCompletePercentAchievement(activity)
  )
}

/**
 * Check Exist Achievements.
 *
 * @param achievements
 *
 * @returns boolean
 */
function existAchievements(activity): boolean {
  const { achievements } = activity
  return achievements && achievements.length > 0
}

/**
 * Get Collections Crops filter status.
 *
 * @param string status
 *
 * @returns
 */
async function getCropsByStatusActivities(status: string) {
  let crops = await Crop.find({ cancelled: false })
    .populate('cropType')
    .populate({
      path: status,
      populate: [
        { path: 'collaborators' },
        { path: 'type' },
        { path: 'unitType' },
        { path: 'typeAgreement' },
        { path: 'lots' },
        { path: 'files' },
        { path: 'user' },
        {
          path: 'achievements',
          populate: [
            { path: 'lots' },
            { path: 'files' },
            { path: 'supplies', populate: [{ path: 'typeId' }] }
          ]
        },
        {
          path: 'approvalRegister',
          populate: [
            { path: 'filePdf' },
            { path: 'fileOts' },
            { path: 'activity' }
          ]
        }
      ]
    })

  return crops.filter((crop) => crop[status].length > 0)
}

async function createSignCrops(): Promise<void> {
  let crops: any = await getCropsByStatusActivities('finished')

  for (const crop of crops) {
    console.log(`${chalk.green(`${crop.name}`)}`)
    for (const activity of crop.finished) {
      if (!activity.approvalRegister) {
        await stampBlockChain(activity, crop)
      } else {
        console.log(`${chalk.green('Activity have approval register')}`)
      }
    }
  }
}

/**
 * Change status Activity in Crop.
 *
 * @param activity
 * @param crop
 */
async function changeStatusActivityInCrop(activity, crop): Promise<void> {
  await ActivityService.changeStatus(activity, 'FINISHED')
  await CropService.removeActivities(activity, crop, 'done')
  await CropService.addActivities(activity, crop)
}

/**
 * Process Stamp Activity in BlockChain.
 *
 * @param activity
 * @param crop
 */
async function stampBlockChain(activity, crop): Promise<void> {
  const {
    ots,
    hash,
    pathPdf,
    nameFilePdf,
    nameFileOts,
    pathOtsFile
  } = await BlockChainServices.sign(crop, activity)

  const approvalRegisterSign = await ApprovalRegisterSingService.create({
    ots,
    hash,
    pathPdf,
    nameFilePdf,
    nameFileOts,
    pathOtsFile,
    activity
  })

  activity.approvalRegister = approvalRegisterSign._id

  await activity.save()
}

;(async () => {
  try {
    const connected = await connectDb()

    if (connected) {
      const options: OptionValues = program.opts()

      console.log(`${chalk.green('Activity signing begins')}`)
      if (options.createSingCrops) {
        await createSignCrops()
      }

      if (options.signActivities) {
        await signActivities(options.signActivities)
      }

      console.log(`${chalk.green('Sign activities finished')}`)
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
