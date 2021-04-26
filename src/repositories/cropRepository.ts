import models from '../models'
const { Crop } = models

import { filterDataCropsByCompanies } from '../utils'

export class CropRepository {
  /**
   *
   * @param string cropId.
   *
   * @returns
   */
  public static async findById(cropId: string): Promise<Object | null> {
    return Crop.find({ _id: cropId })
      .populate({
        path: 'lots.data',
        populate: [{ path: 'satelliteFiles', populate: [{ path: 'file' }] }]
      })
      .populate('cropType')
      .populate('unitType')
      .populate('company')
      .populate({
        path: 'done',
        populate: [
          { path: 'type' },
          { path: 'typeAgreement' },
          {
            path: 'lots',
            populate: [{ path: 'satelliteFiles', populate: [{ path: 'file' }] }]
          },
          { path: 'files' },
          {
            path: 'achievements',
            populate: [{ path: 'lots' }, { path: 'files' }]
          },
          { path: 'user' },
          { path: 'unitType' }
        ]
      })
      .populate('members.user')
      .populate({
        path: 'finished',
        populate: [
          { path: 'type' },
          { path: 'typeAgreement' },
          {
            path: 'lots',
            populate: [{ path: 'satelliteFiles', populate: [{ path: 'file' }] }]
          },
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
  }
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
}
