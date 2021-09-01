require('dotenv').config()

import chalk from 'chalk'
import { Command, OptionValues } from 'commander'

import { connectDb } from '../models'
import { CountryRepository } from '../repositories'
import CountriesService from '../services/CountriesService'

const program = new Command()

program
  .description('Use this command to add Countries to database')
  .option('-a, --add', 'Add Countries to database')

program.parse(process.argv)

const defaultListCountries: Array<string> = ['ARG', 'PRY', 'URY', 'BRL']

const setEnabledCountries = (alpha3Code: string): boolean => {
  return !defaultListCountries.includes(alpha3Code)
}

const addCountries = async () => {
  const dataToFind: any = {}

  const countries = await CountryRepository.getCountries(dataToFind)

  if (countries.length) {
    console.log(`${chalk.green(`Successfully: COUNTRIES EXISTS`)}`)
    return
  }

  const response: any = await CountriesService.getCountries()

  for (const country of response) {
    const newCountry = {
      name: country.name,
      phoneCode: country.callingCodes[0],
      capital: country.capital,
      geolocation: country.latlng,
      timezone: country.timezones[0],
      currencies: country.currencies,
      languages: country.languages,
      flag: country.flag,
      alpha2Code: country.alpha2Code,
      alpha3Code: country.alpha3Code,
      disabled: setEnabledCountries(country.alpha3Code)
    }

    await CountryRepository.createCountry(newCountry)

    console.log(`${chalk.green(`Successfully: COUNTRY: ${newCountry.name}`)}`)
  }
}

;(async () => {
  try {
    const connected = await connectDb()

    if (connected) {
      const options: OptionValues = program.opts()

      if (options.add) {
        await addCountries()
      }
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
