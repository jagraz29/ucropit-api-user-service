import { Evidence } from '../interfaces/Evidence'
import models from '../models'
const { Crop } = models

import { filterDataCropsByCompanies, listEvidencesCrop } from '../utils'

export class CropRepository {
  public static async findAllCropsByCompanies(
    identifier: string
  ): Promise<Object[] | null> {
    /**
     *
     * @param crops
     */
    const cropsInstance = await Crop.find({
      cancelled: false,
      'members.identifier': identifier
    })
      .populate('lots.data')
      .populate('cropType')
      .populate('unitType')
      .populate('company')
      .populate({
        path: 'done',
        populate: [
          { path: 'collaborators' },
          { path: 'type' },
          { path: 'typeAgreement' },
          { path: 'lots' },
          { path: 'files' },
          {
            path: 'achievements',
            populate: [{ path: 'lots' }, { path: 'files' }]
          },
          { path: 'lotsMade' },
          { path: 'user' },
          { path: 'unitType' }
        ]
      })
      .populate('members.user')
      .populate({
        path: 'finished',
        populate: [
          { path: 'collaborators' },
          { path: 'type' },
          { path: 'typeAgreement' },
          { path: 'lots' },
          { path: 'files' },
          { path: 'user' },
          { path: 'unitType' },
          {
            path: 'approvalRegister',
            populate: [
              { path: 'filePdf' },
              { path: 'fileOts' },
              { path: 'activity' }
            ]
          },
          {
            path: 'achievements',
            populate: [{ path: 'lots' }, { path: 'files' }]
          }
        ]
      })
    return !!cropsInstance.length
      ? filterDataCropsByCompanies(cropsInstance, identifier)
      : null
  }

  public static async findAllEvidencesByCropId(
    cropId: string
  ): Promise<Evidence[]> {
    const cropsInstance = await Crop.findById(cropId)
      .populate({
        path: 'done',
        populate: [
          { path: 'files' },
          { path: 'satelliteImages' },
          {
            path: 'achievements',
            populate: [{ path: 'files' }]
          }
        ]
      })
      .populate('members.user')
      .populate({
        path: 'finished',
        populate: [
          { path: 'files' },
          { path: 'satelliteImages' },
          {
            path: 'achievements',
            populate: [{ path: 'files' }]
          }
        ]
      })
      .lean({ virtuals: true })

    return !!cropsInstance ? listEvidencesCrop(cropsInstance) : null
  }
}
