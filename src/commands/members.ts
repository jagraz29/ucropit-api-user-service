require('dotenv').config()
import models, { connectDb } from '../models'
import chalk from 'chalk'
const Crop = models.Crop
const User = models.User
const Company = models.Company
const CollaboratorRequest = models.CollaboratorRequest

const addNewMembersInCrops = async (
  user: any,
  company: any,
  companyIdFilter?: string,
  rol?: string
) => {
  const query = createQueryFilterCrop(user, company, companyIdFilter)

  let crops: any = await Crop.find(query)

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
        type: rol || 'CAM'
      })

      await crop.save()
      await user.save()

      console.log(`${chalk.green(`Successfully: CROP: ${crop.id}`)}`)
    } catch (error) {
      console.log(`${chalk.red(`Error in crop id: ${crop.id}`)}`)
    }
  }
}

function createQueryFilterCrop(user, company, identifierFilter?: string) {
  const queryFilter: any = {
    cancelled: false,
    $or: [
      { 'members.user': { $ne: user._id } },
      { 'members.identifier': { $ne: company.identifier } }
    ]
  }

  if (identifierFilter) {
    queryFilter.identifier = identifierFilter
  }

  return queryFilter
}

;(async () => {
  const connected = await connectDb()

  if (connected) {
    let cuitFilter = null
    let rolType = null
    const paramsUser = process.argv[2].split('--')
    const paramsCompany = process.argv[3].split('--')
    const argCuitFiltering = process.argv.find((arg) => arg.includes('cuit:'))
    const argRol = process.argv.find((arg) => arg.includes('rol:'))

    if (argCuitFiltering) {
      cuitFilter = argCuitFiltering.split('cuit:')[1]
    }

    if (argRol) {
      rolType = argRol.split('rol:')[1]
    }

    const user = await User.findOne({ email: paramsUser[1] })
    const company = await Company.findOne({ identifier: paramsCompany[1] })
    if (user && company) {
      console.log(`${chalk.green('Process Update all Crops...')}`)
      await addNewMembersInCrops(user, company, cuitFilter, rolType)
      console.log(`${chalk.green('Finished Update all Crops...')}`)
    }
  }
  process.exit()
})()
