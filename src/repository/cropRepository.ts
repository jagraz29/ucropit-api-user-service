import models from '../models'
const { Crop } = models

import { filterDataCropsByCompanies, joinActivitiesByCrop } from '../utils'

export class CropRepository {
  public static async findAllCropsByCompanies(identifier: string) {
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

  /**
   *  Get One crop and json converter.
   *
   * @param string id
   */
  public static async getCropWithActivities(id: string) {
    const cropInstance = await Crop.findById(id)
      .populate('lots.data')
      .populate('cropType')
      .populate('unitType')
      .populate({ path: 'company', populate: [{ path: 'files' }] })
      .populate({
        path: 'pending',
        populate: [
          { path: 'collaborators' },
          { path: 'type' },
          { path: 'typeAgreement' },
          { path: 'lots', select: '-area -__v' },
          { path: 'files' },
          {
            path: 'supplies',
            populate: [{ path: 'typeId' }]
          },
          {
            path: 'storages',
            populate: [{ path: 'storageType' }]
          }
        ]
      })
      .populate({
        path: 'toMake',
        populate: [
          { path: 'collaborators' },
          { path: 'type' },
          { path: 'typeAgreement' },
          { path: 'lots', select: '-area -__v' },
          { path: 'files' },
          {
            path: 'supplies',
            populate: [{ path: 'typeId' }]
          },
          {
            path: 'storages',
            populate: [{ path: 'storageType' }]
          }
        ]
      })
      .populate({
        path: 'done',
        populate: [
          { path: 'collaborators' },
          { path: 'type' },
          { path: 'typeAgreement' },
          { path: 'lots', select: '-area -__v' },
          { path: 'files' },
          {
            path: 'achievements',
            populate: [
              { path: 'lots' },
              { path: 'files' },
              { path: 'supplies', populate: [{ path: 'typeId' }] }
            ]
          },
          {
            path: 'supplies',
            populate: [{ path: 'typeId' }]
          },
          {
            path: 'storages',
            populate: [{ path: 'storageType' }]
          },
          { path: 'lotsMade' }
        ]
      })
      .populate({
        path: 'finished',
        populate: [
          { path: 'collaborators' },
          { path: 'type' },
          { path: 'typeAgreement' },
          { path: 'lots', select: '-area -__v' },
          { path: 'files' },
          {
            path: 'supplies',
            populate: [{ path: 'typeId' }]
          },
          {
            path: 'storages',
            populate: [{ path: 'storageType' }]
          },
          {
            path: 'achievements',
            populate: [
              { path: 'lots' },
              { path: 'files' },
              { path: 'supplies', populate: [{ path: 'typeId' }] }
            ]
          }
        ]
      })
      .populate('members.user')
      .lean()
    return cropInstance ? joinActivitiesByCrop(cropInstance) : null
  }

  /**
   *  Get All crops by identifier and type.
   *
   * @param string id
   */
  public static async findAllCropsByCompanyAndCropType(
    identifier: string,
    cropType: string,
    company: string
  ) {
    const cropsInstance = await Crop.find({
      cancelled: false,
      'members.identifier': identifier,
      cropType: cropType,
      company: company
    }).populate('unitType')

    return !!cropsInstance.length ? cropsInstance : null
  }
}
