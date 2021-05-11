import _ from 'lodash'
import moment from 'moment'

export const getActivitiesOrderedByDateUtils = ({ activities, surface: surfaceCrop }) => {
  const activitiesRes = activities.map(activity => {
    const {
      _id,
      achievements,
      type: { tag: TypeActivity },
      signers,
      name,
      lots,
      surface,
      storages,
      dateStart,
      dateEnd,
      supplies,
      pay,
      dateObservation
    } = activity

    let percent: number = 0

    if (TypeActivity === 'ACT_SOWING' || TypeActivity === 'ACT_APPLICATION') {
      let surfaceAux = !!achievements.length ? achievements.reduce((a,b) => a + b.surface,0) : 0
      percent = (surfaceAux / surface) * 100
    }
    if (TypeActivity === 'ACT_MONITORING' || TypeActivity === 'ACT_HARVEST') {
      let surfaceAux = !!achievements.length ? achievements.reduce((a,b) => a + b.surface,0) : surface
      percent = (surfaceAux / surfaceCrop) * 100
    }

    return {
      dateOrder: dateEnd ? dateEnd : _id.getTimestamp(),
      _id,
      name,
      percent,
      dateStart: dateStart ? dateStart : null,
      dateEnd: dateEnd ? dateEnd : null,
      lots: lots.length,
      surface,
      volume: surface * (pay ? pay : 0),
      pay: pay ? pay : 0,
      dateObservation: dateObservation ? dateObservation : null,
      signed: !achievements.length ? signers.length : null,
      signedIf: !achievements.length ? _.flatten(signers.map(({ signed }) => signed === true)).length : null,
      supplies,
      storages: storages ? storages.map(({ tonsHarvest, storageType: { name: { es: storageTypeNAme } } }) => { return { tonsHarvest, storageTypeNAme }}) : [],
      achievements: getDataAchievements(achievements)
    }
  }).filter(item => item)

  return activitiesRes.sort((a, b) => moment(a.dateOrder).diff(moment(b.dateOrder)))
}

const getDataAchievements = (achievements): Object[] => {
  return achievements.map(({ dateAchievement, lots, surface, signers, supplies, _id }) => {
    return {
      _id,
      dateAchievement,
      lots: lots.length,
      surface,
      supplies,
      signed: signers.length,
      signedIf: _.flatten(signers.map(({ signed }) => signed === true)).length
    }
  }).filter((item) => item)
}
