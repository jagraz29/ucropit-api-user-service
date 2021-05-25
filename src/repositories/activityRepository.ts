import models from '../models'

const { Activity } = models

export enum TypeActivity {
  Sowing = 'ACT_SOWING',
  Harvest = 'ACT_HARVEST',
  Application = 'ACT_APPLICATION',
  Monitoring = 'ACT_MONITORING',
  Tillage = 'ACT_TILLAGE',
  Fertilization = 'ACT_FERTILIZATION'
}

export enum NameActivity {
  Sowing = 'Siembra',
  Harvest = 'Cosecha',
  Application = 'Aplicación',
  Monitoring = 'Monitoreo',
  Tillage = 'Labranza',
  Fertilization = 'Fertilización'
}

export class ActivityRepository {
  /**
   *
   * @param string lotId
   *
   * @returns
   */
  public static findById(lotId: string) {
    return Activity.findById(lotId)
  }

  /**
   * Get all Activities filter by type activity.
   *
   * @param TypeActivity type
   */
  public static async getActivitiesFilterByName(name: NameActivity) {
    const activities = await Activity.find({ name: name })
      .populate('type')
      .populate({
        path: 'achievements',
        populate: [{ path: 'supplies.supply' }]
      })
      .lean({ virtuals: true })

    return !!activities ? activities : null
  }

  /**
   * Get Activities.
   *
   * @returns
   */
  public static async getActivities({
    query,
    limit,
    skip,
    sort,
    populate,
  }: any): Promise<any> {
    return Activity
      .find(query ? query : {})
      .populate(populate ? populate : [])
      .limit(limit ? limit : 0)
      .skip(skip ? skip : 0)
      .sort(sort ? sort : {})
  }
}
