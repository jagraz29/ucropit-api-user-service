import models from '../models'
const { Crop } = models

import { joinActivitiesByCrop } from '../utils'

export class CropRepository {
  /**
   *
   * @param identifier
   */
  public static async findAllCropsByCompanies (identifier: string): Promise<Object[] | null> {
    const cropsInstance = await Crop.find({
      cancelled: false,
      'members.identifier': identifier
    })
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
            populate: [{ path: 'lots' }, { path: 'files' }, { path: 'supplies', populate: [{ path: 'typeId' }] }]
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
            populate: [{ path: 'lots' }, { path: 'files' }, { path: 'supplies', populate: [{ path: 'typeId' }] }]
          }
        ]
      })
      .populate('members.user')
      .lean()
    return !!cropsInstance.length
      ? cropsInstance.map(crop => joinActivitiesByCrop(crop))
      : null
  }

  /**
   *  Get One crop and json converter.
   *
   * @param id
   */
  public static async getCropWithActivities (id: string): Promise<Object[] | null> {
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
            populate: [{ path: 'lots' }, { path: 'files' }, { path: 'supplies', populate: [{ path: 'typeId' }] }]
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
            populate: [{ path: 'lots' }, { path: 'files' }, { path: 'supplies', populate: [{ path: 'typeId' }] }]
          }
        ]
      })
      .populate('members.user')
      .lean()
    return cropInstance
      ? joinActivitiesByCrop(cropInstance)
      : null
  }

  /**
   *  Get All crops by identifier and type.
   *
   * @param string id
   */
  public static async findAllCropsByCompanyAndCropType(identifier: string, cropType: string, company: string): Promise<Object[] | null> {
    const cropsInstance = await Crop.find({
      cancelled: false,
      'members.identifier': identifier,
      'cropType' : cropType,
      'company' : company
    })
      .populate('unitType')

    return !!cropsInstance.length
      ? cropsInstance
      : null
  }

  /**
   *  Get crops.
   *
   * @param object pipeline
   */
  public static async findCrops(pipeline: any) {
    const cropsInstance = await Crop.aggregate(pipeline)

    return !!cropsInstance.length
      ? cropsInstance
      : null
  }
}
