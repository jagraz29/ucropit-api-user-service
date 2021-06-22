require('dotenv').config()

import chalk from 'chalk'

import models, { connectDb } from '../models'
import { CountryRepository } from '../repositories'

const Company = models.Company

const start = async () => {
  let companies: Array<any> = await Company.find()

  for (const company of companies) {
    try {
      console.log('=== COMPANY ===')
      console.log(company._id)

      /**********************************/
      /*     ADD COUNTRY TO COMPANY     */
      /**********************************/

      const dataToFind: any = {
        query: {
          alpha3Code: 'ARG',
        },
      }

      const country = await CountryRepository.getCountry(dataToFind)

      company.country = country._id

      await company.save()

      console.log(`${chalk.green(`Successfully: COMPANY: ${company.id}`)}`)
    } catch (error) {
      console.log(error)
      console.log(
        `${chalk.red(`Error adding country to company id: ${company.id}`)}`
      )
    }
  }
}

;(async () => {
  const connected = await connectDb()

  if (connected) {
    console.log(`${chalk.green('Process Add Country to all Companies...')}`)

    await start()

    console.log(`${chalk.green('Finished Add Country to all Companies...')}`)
  }

  process.exit()
})()
