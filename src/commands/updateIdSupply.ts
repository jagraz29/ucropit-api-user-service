require('dotenv').config()
import models, { connectDb } from '../models'
import chalk from 'chalk'
import { Command, OptionValues } from 'commander'
import { data } from './supplies/data'

const { Supply, Achievement } = models

const program = new Command()

program
  .description('Use command for update suplies achievements')
  .option('-u, --updated', 'Update all supplies id in achievements')

program.parse(process.argv)

async function execUpdateSupply() {
  console.log('EXEC COMMAND')
  //console.log(data)

  for (const item of data) {
    const achievement = await Achievement.findById(item.achievementId)

    console.log(achievement.supplies.id(item.SupplyIdApplied))
    let supplies = achievement.supplies.id(item.SupplyIdApplied)

    if(supplies.length){
      let id = supplies._id
      await achievement.insert(item.supply)
      //await achievement.update({"supplies._id" : id },{"$set" : {"supplies._id" : ObjectId(item.supply) } )
      await achievement.remove({'supplies._id': ObjectId(id)});
    }
    
  }
  
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
