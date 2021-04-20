require('dotenv').config()
import models, { connectDb } from '../models'
import chalk from 'chalk'
import { Command, OptionValues } from 'commander'
const Crop = models.Crop

const program = new Command()

// Configuration Commands
program
  .description(
    'Use command for search and delete ghost user signer in achievements'
  )
  .option('-d, --delete', 'Delete all users ghost signers')
  .option('-s, --search', 'List all users ghost signers')

program.parse(process.argv)

/**
 * Search And List users ghost
 */
async function searchGhostUsers(): Promise<void> {
  console.log(`${chalk.yellow('SEARCH USERS GHOST')}`)
  const crops: any = await getCropsWithActivitiesDone()

  crops.forEach((crop) => {
    crop.done.forEach((activity) => {
      if (activity.achievements.length > 0) {
        activity.achievements.forEach((achievement) => {
          const duplicates = findDuplicateSigners(achievement.signers)
          listDuplicateSigners(duplicates, activity, crop)
        })
      } else {
        const duplicates = findDuplicateSigners(activity.signers)
        listDuplicateSigners(duplicates, activity, crop)
      }
    })
  })
}

/**
 * Delete User Ghost
 */
async function deleteGhostUsers(): Promise<void> {
  console.log(`${chalk.yellow('DELETE USERS GHOST')}`)
}

/**
 *
 * @param list
 */
function listDuplicateSigners(list, activity, crop): void {
  console.log('=======================')
  console.log(`${chalk.green(`CROP ID: ${crop._id}`)}`)
  console.log(`${chalk.green(`ACTIVITY ID: ${activity._id}`)}`)
  console.log(`${chalk.green(`ACTIVITY NAME: ${activity.name}`)}`)
  console.log('=======================')
  console.log(`${chalk.red('USER DUPLICATE')}`)
  list.forEach((item) => {
    console.log('=======================')
    console.log(`User ID: ${item.userId}`)
    console.log(`User email: ${item.email}`)
    console.log(`User fullName: ${item.fullName}`)
    console.log(`User Signed: ${item.signed}`)
    console.log('=======================')
  })
}

function findDuplicateSigners(signers) {
  const lookup = signers.reduce((a, e) => {
    a[e.userId] = ++a[e.userId] || 0
    return a
  }, {})

  return signers.filter((e) => lookup[e.userId])
}

function isDuplicateSigners(signers): boolean {
  const signersId = signers.map(function (item) {
    return item.userId
  })

  const isDuplicate = signersId.some(function (item, index) {
    return signersId.indexOf(item) !== index
  })

  return isDuplicate
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
