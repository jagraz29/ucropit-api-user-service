require('dotenv').config()
import models, { connectDb } from '../models'
import chalk from 'chalk'
import BlockChainServices from '../services/BlockChainService'
import ApprovalRegisterSingService from '../services/ApprovalRegisterSignService'

const Crop = models.Crop

const createSignCrops = async () => {
  let crops = await Crop.find({ cancelled: false })
    .populate('cropType')
    .populate({
      path: 'finished',
      populate: [
        { path: 'collaborators' },
        { path: 'type' },
        { path: 'typeAgreement' },
        { path: 'lots' },
        { path: 'files' },
        { path: 'user' },
        {
          path: 'approvalRegister',
          populate: [
            { path: 'filePdf' },
            { path: 'fileOts' },
            { path: 'activity' }
          ]
        }
      ]
    })

  crops = crops.filter((crop) => crop.finished.length > 0)

  //
  for (const crop of crops) {
    console.log(`${chalk.green(`${crop.name}`)}`)
    for (const activity of crop.finished) {
      if (!activity.approvalRegister) {
        const {
          ots,
          hash,
          pathPdf,
          nameFilePdf,
          nameFileOts,
          pathOtsFile
        } = await BlockChainServices.sign(crop, activity)

        const approvalRegisterSign = await ApprovalRegisterSingService.create({
          ots,
          hash,
          pathPdf,
          nameFilePdf,
          nameFileOts,
          pathOtsFile,
          activity
        })

        activity.approvalRegister = approvalRegisterSign._id

        await activity.save()
      } else {
        console.log(`${chalk.green('Activity have approval register')}`)
      }
    }
  }
}

(async () => {
  const connected = await connectDb()

  if (connected) {
    console.log(`${chalk.green('Activity signing begins')}`)
    await createSignCrops()
    console.log(`${chalk.green('Sign activities finished')}`)
  }
  process.exit()
})()
