import models from '../models'
const { Crop, CropType } = models

import {
  joinActivitiesByCrop,
  listEvidencesCrop,
  joinActivitiesFilterTypeWithCrop
} from '../utils'

export class CropRepository {
  /**
   *
   * @param query
   * @param limit
   * @param skip
   * @param sort
   * @param dataToPopulate
   *
   * @returns
   */
  public static async getCrops({
    query,
    limit,
    skip,
    sort,
    populate
  }: any): Promise<any> {
    return Crop.find(query ?? {})
      .populate(populate ?? [])
      .limit(limit ?? 0)
      .skip(skip ?? 0)
      .sort(sort ?? {})
  }

  /**
   * @function findCropsSample
   * Get crops sample.
   * @param object query
   */
  public static async findCropsSample(query) {
    const crops = await Crop.find(query)
    return crops
  }
  /**
   *
   * @param identifier
   */
  public static async findAllCropsByCompanies(identifier: string) {
    const cropsInstance = await Crop.find({
      cancelled: false,
      'members.identifier': identifier
    })
      .populate('lots.data')
      .populate('cropType')
      .populate('unitType')
      .populate({
        path: 'company',
        populate: [
          { path: 'files' },
          { path: 'contacts.user' },
          { path: 'country' }
        ]
      })
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
    return cropsInstance.length
      ? cropsInstance.map((crop) => joinActivitiesByCrop(crop))
      : null
  }

  /**
   *  Get One crop and json converter.
   *
   * @param id
   */
  public static async getCropWithActivities(id: string) {
    const cropInstance = await Crop.findById(id)
      .populate({
        path: 'lots.data',
        populate: [{ path: 'envImpactIndex', select: 'eiq' }]
      })
      .populate('cropType')
      .populate('unitType')
      .populate('envImpactIndex', 'eiq')
      .populate('badges.badge')
      .populate({
        path: 'pending',
        populate: [
          { path: 'collaborators' },
          { path: 'envImpactIndex', select: 'eiq' },
          { path: 'unitType' },
          { path: 'type' },
          { path: 'typeAgreement' },
          { path: 'files' },
          { path: 'lots', select: '-area -__v' },
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
          { path: 'envImpactIndex', select: 'eiq' },
          { path: 'unitType' },
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
          { path: 'envImpactIndex', select: 'eiq' },
          { path: 'collaborators' },
          { path: 'unitType' },
          { path: 'type' },
          { path: 'typeAgreement' },
          {
            path: 'lots',
            select: '-area -__v',
            populate: [{ path: 'envImpactIndex', select: 'eiq' }]
          },
          { path: 'files' },
          {
            path: 'achievements',
            populate: [
              {
                path: 'lots',
                populate: [{ path: 'envImpactIndex', select: 'eiq' }]
              },
              { path: 'envImpactIndex', select: 'eiq' },
              { path: 'files' },
              { path: 'supplies.supply', populate: [{ path: 'typeId' }] },
              { path: 'supplies.typeId' }
            ]
          },
          { path: 'supplies.supply', populate: [{ path: 'typeId' }] },
          { path: 'supplies.typeId' },
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
          { path: 'envImpactIndex', select: 'eiq' },
          { path: 'collaborators' },
          { path: 'unitType' },
          { path: 'type' },
          { path: 'typeAgreement' },
          {
            path: 'lots',
            select: '-area -__v',
            populate: [{ path: 'envImpactIndex', select: 'eiq' }]
          },
          { path: 'files' },
          { path: 'supplies.supply', populate: [{ path: 'typeId' }] },
          { path: 'supplies.typeId' },
          {
            path: 'storages',
            populate: [{ path: 'storageType' }]
          },
          {
            path: 'achievements',
            populate: [
              {
                path: 'lots',
                populate: [{ path: 'envImpactIndex', select: 'eiq' }]
              },
              { path: 'envImpactIndex', select: 'eiq' },
              { path: 'files' },
              { path: 'supplies.supply', populate: [{ path: 'typeId' }] },
              { path: 'supplies.typeId' }
            ]
          }
        ]
      })
      .populate('members.user')
      .lean({ virtuals: true })
    return cropInstance ? joinActivitiesByCrop(cropInstance) : null
  }

  /**
   *  Get All crops by identifier and type.
   *
   * @param string id
   */
  public static async findAllCropsByCompanyAndCropType({ cropType, company }) {
    const cropsInstance = await Crop.find({
      cancelled: false,
      cropType,
      company
    })
      .populate('unitType')
      .lean()

    return cropsInstance.length ? cropsInstance : null
  }

  /**
   *  Get All crops by identifier and type.
   *
   * @param string id
   */
  public static async findAllCropType({ id }) {
    const cropTypeInstance = await CropType.find({ id }).populate('name').lean()

    return cropTypeInstance.length ? cropTypeInstance : null
  }

  public static async findCropsWithLotsPopulateData(query) {
    const crops = await Crop.find(query).populate('lots.data')
    return crops
  }

  public static async findAllEvidencesByCropId(cropId: string) {
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
        path: 'company',
        populate: [
          { path: 'files' },
          { path: 'contacts.user' },
          { path: 'country' }
        ]
      })
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
    return cropsInstance ? listEvidencesCrop(cropsInstance) : null
  }

  /**
   *  Get crops.
   *
   * @param object pipeline
   */
  public static async findCrops(pipeline: any) {
    const cropsInstance = await Crop.aggregate(pipeline).allowDiskUse(true)

    return cropsInstance.length ? cropsInstance : null
  }

  /**
   *
   * @param query
   * @param dataToUpdate
   *
   * @returns
   */
  public static async updateOneCrop(
    query: any,
    dataToUpdate: any
  ): Promise<any> {
    return Crop.updateOne(query, dataToUpdate)
  }

  /**
   *
   * @param type
   */
  public static async findCropsFilterActivityForBilling(query, type) {
    const cropsInstance = await this.getCropWithPopulates(query, 'find')

    return !!cropsInstance.length
      ? joinActivitiesFilterTypeWithCrop(cropsInstance, type)
      : null
  }

  /**
   *
   * @param query
   * @returns
   */
  private static async getCropWithPopulates(
    query,
    method: string,
    isVirtuals?: boolean
  ) {
    const queryCrops = Crop[method](query)
      .populate('lots.data')
      .populate('cropType')
      .populate('unitType')
      .populate({
        path: 'company',
        populate: [
          { path: 'files' },
          { path: 'contacts.user' },
          { path: 'country' }
        ]
      })
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

    if (isVirtuals) {
      return queryCrops.lean({ virtuals: true })
    }

    return queryCrops.lean()
  }
}
