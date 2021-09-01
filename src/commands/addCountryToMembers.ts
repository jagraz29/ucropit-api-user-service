require('dotenv').config()

import chalk from 'chalk'
import { Command, OptionValues } from 'commander'

import { connectDb } from '../models'
import { CountryRepository, CropRepository } from '../repositories'

const program = new Command()

program
  .description('Use this command to add the Country in the crop members')
  .option('-a, --add', 'Add the Country in the crop members')

program.parse(process.argv)

const addCountryToMembers = async () => {
  const dataToFindCrops: any = {}

  const crops: Array<any> = await CropRepository.getCrops(dataToFindCrops)

  const dataToFind: any = {
    query: {
      alpha3Code: 'ARG'
    }
  }

  const country = await CountryRepository.getCountry(dataToFind)

  for (const crop of crops) {
    crop.members.map((member) => (member.country = country._id))

    await crop.save()

    console.log(`${chalk.green(`Successfully: CROP: ${crop.id}`)}`)
  }
}

;(async () => {
  try {
    const connected = await connectDb()

    if (connected) {
      const options: OptionValues = program.opts()

      if (options.add) {
        await addCountryToMembers()
      }
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
