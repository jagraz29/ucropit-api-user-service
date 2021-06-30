require('dotenv').config()
import models, { connectDb } from '../models'
import chalk from 'chalk'
import { Command, OptionValues } from 'commander'
import { IAchievementDocument, Signer } from '../interfaces'
import { uniqByPropMap } from '../utils/List'
import ActivityService from '../services/ActivityService'
import AchievementService from '../services/AchievementService'
import { flatten } from 'lodash'
const Crop = models.Crop

const program = new Command()

// Configuration Commands
program
  .description(
    'Use command for search and delete ghost user signer in achievements'
  )
  .option('-c, --clean', 'Delete all users ghost signers')
  .option('-l, --list', 'List all users ghost signers')

program.parse(process.argv)

/**
 * Search And List users ghost
 */
async function searchGhostUsers(): Promise<void> {
  console.log(`${chalk.yellow('SEARCH USERS GHOST')}`)
  const crops: any = await getCropsWithActivitiesDone()

  crops.forEach((crop) => {
    const { done } = crop

    done.forEach((activity) => {
      const { achievements, signers } = activity
      if (existAchievements(achievements)) {
        achievements.forEach((achievement: IAchievementDocument) => {
          const { signers } = achievement
          const duplicates: Signer[] = findDuplicateSigners(signers)
          logSigners(duplicates, activity, crop, 'USERS DUPLICATE')
        })
      } else {
        const duplicates: Signer[] = findDuplicateSigners(signers)
        logSigners(duplicates, activity, crop, 'USERS DUPLICATE')
      }
    })
  })
}

/**
 * For User Ghost And clean duplicate.
 */
async function deleteGhostUsers(): Promise<void> {
  console.log(`${chalk.yellow('DELETE USERS GHOST')}`)
  const crops: any = await getCropsWithActivitiesDone()

  for (const crop of crops) {
    const { done } = crop
    for (const activity of done) {
      const { achievements, signers } = activity
      if (existAchievements(achievements)) {
        const listCleaned: Signer[] = await cleanSignersAchievement(activity)
        logSigners(listCleaned, activity, crop, 'SIGNERS CLEANED')
      } else if (isDuplicateSigners(signers)) {
        const listCleaned: Signer[] = cleanDuplicateSigners(signers)
        await ActivityService.updateSigners(listCleaned, activity._id)
        logSigners(listCleaned, activity, crop, 'SIGNERS CLEANED')
      }
    }
  }
}

/**
 * Clean list Signers when duplicate signers.
 *
 * @param activity
 * @returns
 */
async function cleanSignersAchievement(activity): Promise<Signer[]> {
  const { achievements } = activity
  const cleanerSigners = flatten(
    achievements.map(async (achievement: IAchievementDocument) => {
      const { signers } = achievement
      if (isDuplicateSigners(signers)) {
        const listCleaned: Signer[] = cleanDuplicateSigners(signers)
        await AchievementService.updateSigners(listCleaned, achievement._id)
        return listCleaned
      }
    })
  ).filter((signers) => signers)

  return Promise.all(cleanerSigners)
}

/**
 * Log List Signers.
 *
 * @param list
 */
function logSigners(list: Signer[], activity, crop, message?: string): void {
  if (list.length > 0) {
    console.log('=======================')
    console.log(`${chalk.green(`CROP ID: ${crop._id}`)}`)
    console.log(`${chalk.green(`ACTIVITY ID: ${activity._id}`)}`)
    console.log(`${chalk.green(`ACTIVITY NAME: ${activity.name}`)}`)
    console.log('=======================')
    console.log(`${chalk.red(message)}`)
    list.forEach((item) => {
      console.log('=======================')
      console.log(`User ID: ${item?.userId}`)
      console.log(`User email: ${item?.email}`)
      console.log(`User fullName: ${item?.fullName}`)
      console.log(`User Signed: ${item?.signed}`)
      console.log('=======================')
    })
  }
}

/**
 * Clean Duplicate signers in a List.
 *
 * @param Signer[] signers
 *
 * @returns Signer[]
 */
function cleanDuplicateSigners(signers: Signer[]): Signer[] {
  const orderSigners = signers.sort(function (after, current) {
    return Number(after.signed) - Number(current.signed)
  })

  const uniqueByUser = uniqByPropMap('email')
  const uniqueSigner = uniqueByUser<Signer>(orderSigners)

  console.log(`${chalk.green('List Signers Cleaned')}`)
  return uniqueSigner
}

/**
 * Find Duplicate Signers and return list.
 *
 * @param Signer[] signers
 *
 * @returns Array
 */
function findDuplicateSigners(signers: Signer[]): Array<Signer> {
  const lookup = signers.reduce((prev, item) => {
    prev[item.email] = ++prev[item.email] || 0
    return prev
  }, {})

  return signers.filter((signer) => lookup[signer.email])
}

/**
 * Check Exist Duplicate Users.
 *
 * @param Signer[]  signers
 *
 * @returns Array
 */
function isDuplicateSigners(signers: Signer[]): boolean {
  const signersId = signers.map((item: Signer) => item.userId)

  return signersId.some((item, index) => signersId.indexOf(item) !== index)
}

/**
 * Check Exist Achievements.
 *
 * @param achievements
 *
 * @returns boolean
 */
function existAchievements(achievements: IAchievementDocument[]): boolean {
  return achievements.length > 0
}

async function getCropsWithActivitiesDone<T>(): Promise<any> {
  const crops: any = await Crop.find({ cancelled: false }).populate({
    path: 'done',
    populate: [
      { path: 'type' },
      { path: 'typeAgreement' },
      { path: 'files' },
      {
        path: 'achievements'
      }
    ]
  })

  return crops.filter((crop) => crop.done.length > 0)
}

;(async () => {
  try {
    const connected = await connectDb()

    if (connected) {
      const options: OptionValues = program.opts()

      if (options.clean) {
        await deleteGhostUsers()
      }

      if (options.list) {
        await searchGhostUsers()
      }
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
