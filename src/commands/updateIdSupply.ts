require('dotenv').config()
import models, { connectDb } from '../models'
import chalk from 'chalk'
import { Command, OptionValues } from 'commander'
import { data } from './supplies/data'

const { Supply, Achievement } = models

const program = new Command()

program
  .description('Descripción de lo que hace este comando')
  .option('-u, --updated', 'Descripcion de lo que hace esta opcion')

program.parse(process.argv)

async function execUpdateSupply() {
  console.log('EXEC COMMAND')
  console.log(data)
  for (const item of data) {
    const achievement = await Achievement.findById(item.achievementId)

    console.log(achievement.supplies.id(item.SupplyIdApplied))
  }
  //   data.map(async (item) => {
  //     const achievement = await Supply.findOne(item.achievementId)

  //     console.log(achievement)
  //   })
}
;(async () => {
  try {
    const connected = await connectDb()

    if (connected) {
      const options: OptionValues = program.opts()

      if (options.updated) {
        await execUpdateSupply()
      }
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
