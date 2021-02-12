require('dotenv').config()
import models, { connectDb } from '../models'
import chalk from 'chalk'
const Crop = models.Crop
const User = models.User
const Company = models.Company
const CollaboratorRequest = models.CollaboratorRequest

const addNewMembersInCrops = async (user: any, company: any) => {
  let crops = await Crop.find({
    cancelled: false,
    'members.user': { $ne: user._id },
    'members.identifier': { $ne: company.identifier }
  }).limit(4)

  for (const crop of crops) {
    try {
      console.log('=== CROP ===')
      console.log(crop._id)

      let request = await CollaboratorRequest.findOne({
        user: user._id,
        company: company._id
      })

      if (!request) {
        request = await CollaboratorRequest.create({
          user: user._id,
          company: company._id
        })

        user.collaboratorRequest.push(request._id)
      }

      console.log('==== COLLABORATOR REQUEST ====')
      console.log(request._id)

      crop.members.push({
        user: user._id,
        producer: false,
        identifier: company.identifier,
        type: 'CAM'
      })

      await crop.save()
      await user.save()

      console.log(`${chalk.green(`Successfully: CROP: ${crop.id}`)}`)
    } catch (error) {
      console.log(`${chalk.red(`Error in crop id: ${crop.id}`)}`)
    }
  }
}

;(async () => {
  const connected = await connectDb()

  if (connected) {
    const paramsUser = process.argv[2].split('--')
    const paramsCompany = process.argv[3].split('--')
    const user = await User.findOne({ email: paramsUser[1] })
    const company = await Company.findOne({ identifier: paramsCompany[1] })
    if (user && company) {
      console.log(`${chalk.green('Process Update all Crops...')}`)
      await addNewMembersInCrops(user, company)
      console.log(`${chalk.green('Finished Update all Crops...')}`)
    }
  }
  process.exit()
})()
