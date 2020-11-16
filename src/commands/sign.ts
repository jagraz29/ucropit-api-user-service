require('dotenv').config()
import models, { connectDb } from '../models'
import chalk from 'chalk'
import BlockChainServices from '../services/BlockChainService'
import ApprovalRegisterSingService from '../services/ApprovalRegisterSignService'
import crop from '../models/crop'

const Crop = models.Crop
const Activity = models.Activity

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

  crops = crops
    .map((crop) => {
      if (crop.finished.length > 0) {
        return crop
      }
      return undefined
    })
    .filter((crop) => crop)

  //
  for (const crop of crops) {
    console.log(`${chalk.green(`${crop.name}`)}`)
    for (const activity of crop.finished) {
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
    }
  }
}

(async () => {
  const connected = await connectDb()

  if (connected) {
    console.log(`${chalk.green('Proceso de realizar de crear las firmas')}`)
    await createSignCrops()
    console.log(`${chalk.green('Termino el proceso de firmas')}`)
  }
  process.exit()
})()
