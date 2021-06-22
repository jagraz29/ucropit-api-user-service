require('dotenv').config()

import chalk from 'chalk'

import { connectDb } from '../models'
import { CountryRepository, CropRepository } from '../repositories'

const start = async () => {
  const dataToFindCrops: any = {}

  let crops: Array<any> = await CropRepository.getCrops(dataToFindCrops)

  for (const crop of crops) {
    try {
      console.log('=== CROP ===')
      console.log(crop._id)

      /**********************************/
      /*     ADD COUNTRY TO MEMBER     */
      /**********************************/

      const dataToFind: any = {
        query: {
          alpha3Code: 'ARG',
        },
      }

      const country = await CountryRepository.getCountry(dataToFind)

      crop.members.map((member) => (member.country = country._id))

      await crop.save()

      console.log(`${chalk.green(`Successfully: CROP: ${crop.id}`)}`)
    } catch (error) {
      console.log(error)
      console.log(
        `${chalk.red(`Error adding country to member id: ${crop.id}`)}`
      )
    }
  }
}

;(async () => {
  const connected = await connectDb()

  if (connected) {
    console.log(`${chalk.green('Process Add Country to all Members...')}`)

    await start()

    console.log(`${chalk.green('Finished Add Country to all Members...')}`)
  }

  process.exit()
})()
