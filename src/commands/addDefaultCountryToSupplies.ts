require('dotenv').config()
import models, { connectDb } from '../models'
import { Command, OptionValues } from 'commander'
import SupplyRepository from '../repositories/supplyRepository'
import { CountryRepository } from '../repositories/countryRepository'
import { generateArrayPercentage } from '../utils/GenerateArrayPercentage'

const Supplies = models.Supply

const program = new Command()

program
  .description('Use command for add default country(AR) to supplies')
  .option('-a, --add', 'add default country to all supplies')

program.parse(process.argv)

async function execAddDefaultCountryToSupplies() {
  let supply,
    cursor,
    count = 0,
    countLots = 0

  const maxLen = 50
  let porcentagesArray = generateArrayPercentage('.', maxLen)

  const countryToFind: any = {
    query: {
      alpha3Code: 'ARG'
    }
  }
  const country = await CountryRepository.getCountry(countryToFind)

  try {
    countLots = await SupplyRepository.count({})
    cursor = await Supplies.aggregate([]).cursor().exec()

    while ((supply = await cursor.next())) {
      const supplyId = supply._id
      const updateData = {
        countryId: country._id,
        alphaCode: country.alpha2Code
      }
      await SupplyRepository.updateOne(supplyId, updateData)
      count++
      const avg = (count * maxLen) / countLots
      const avgPorcentage = (avg / maxLen) * 100
      porcentagesArray = generateArrayPercentage('#', avg + 1, porcentagesArray)
      console.log(
        new Date(),
        `[${porcentagesArray.join(
          ''
        )}] supply ${count}/${countLots} (${avgPorcentage.toFixed(1)}%)`
      )
    }
    console.log(`Total Supplies updated: ${count}`)
  } catch (error) {
    console.log('Error:::', { error })
  }
}
;(async () => {
  try {
    const connected = await connectDb()

    if (connected) {
      const options: OptionValues = program.opts()

      if (options.add) {
        await execAddDefaultCountryToSupplies()
      }
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
