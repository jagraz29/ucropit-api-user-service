require('dotenv').config()
import { connectDb } from '../models'
import chalk from 'chalk'
import { Command, OptionValues } from 'commander'

const program = new Command()

program
  .description(
    'Use this command to add EIQ Surface supply selected in the activities'
  )
  .option('-a, --add', 'Add EIQ index supply selected in activity')

program.parse(process.argv)
;(async () => {
  try {
    const connected = await connectDb()

    if (connected) {
      const options: OptionValues = program.opts()

      //   if (options.add) {

      //   }
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
