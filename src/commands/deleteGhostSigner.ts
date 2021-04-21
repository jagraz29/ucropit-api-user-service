require('dotenv').config()
import models, { connectDb } from '../models'
import chalk from 'chalk'
import { Command, OptionValues } from 'commander'
import { Signer } from '../interfaces/Signer'
import { uniqByPropMap } from '../utils/List'
import ActivityService from '../services/ActivityService'
import AchievementService from '../services/AchievementService'
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
        achievements.forEach((achievement) => {
          const { signers } = achievement
          const duplicates: Signer[] = findDuplicateSigners(signers)
          listDuplicateSigners(duplicates, activity, crop)
        })
      } else {
        const duplicates: Signer[] = findDuplicateSigners(signers)
        listDuplicateSigners(duplicates, activity, crop)
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
        console.log(listCleaned)
      } else if (isDuplicateSigners(signers)) {
        const listCleaned: Signer[] = cleanDuplicateSigners(signers)
        await ActivityService.updateSigners(listCleaned, activity._id)
        console.log(listCleaned)
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
  const cleanerSigners = achievements
    .map(async (achievement) => {
      const { signers } = achievement
      if (isDuplicateSigners(signers)) {
        const listCleaned: Signer[] = cleanDuplicateSigners(signers)
        await AchievementService.updateSigners(listCleaned, achievement._id)
        return listCleaned
      }
    })
    .filter((signers) => signers)

  return Promise.all(cleanerSigners)
}

/**
 * Log List Signers.
 *
 * @param list
 */
function listDuplicateSigners(list: Signer[], activity, crop): void {
  console.log('=======================')
  console.log(`${chalk.green(`CROP ID: ${crop._id}`)}`)
  console.log(`${chalk.green(`ACTIVITY ID: ${activity._id}`)}`)
  console.log(`${chalk.green(`ACTIVITY NAME: ${activity.name}`)}`)
  console.log('=======================')
  console.log(`${chalk.red('USERS DUPLICATE')}`)
  list.forEach((item) => {
    console.log('=======================')
    console.log(`User ID: ${item.userId}`)
    console.log(`User email: ${item.email}`)
    console.log(`User fullName: ${item.fullName}`)
    console.log(`User Signed: ${item.signed}`)
    console.log('=======================')
  })
}

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
  const lookup = signers.reduce((a, e) => {
    a[e.email] = ++a[e.email] || 0
    return a
  }, {})

  return signers.filter((e) => lookup[e.email])
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
 * @returns
 */
function existAchievements(achievements): boolean {
  return achievements.length > 0
}

async function getCropsWithActivitiesDone<T>(): Promise<Array<T>> {
  const crops = (
    await Crop.find({ cancelled: false }).populate({
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
  ).filter((crop) => crop.done.length > 0)

  return crops
}

;(async () => {
  const connected = await connectDb()

  if (connected) {
    const options: OptionValues = program.opts()

    if (options.delete) {
      await deleteGhostUsers()
    }

    if (options.search) {
      await searchGhostUsers()
    }
  }
  process.exit()
})()
