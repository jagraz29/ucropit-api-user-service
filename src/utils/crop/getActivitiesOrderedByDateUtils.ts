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

    let signed: number = !!achievements.length ? _.flatten(achievements.map(({ signers }) => signers)).length : signers.length
    let signedIf: number = !!achievements.length ? _.flatten(achievements.map(({ signers }) => signers.signed === true)).length : signers.length

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
      name,
      percent,
      dateStart: dateStart ? dateStart : null,
      dateEnd: dateEnd ? dateEnd : null,
      lots: lots.length,
      surface,
      volume: surface * (pay ? pay : 0),
      yields: pay ? pay : 0,
      dateObservation: dateObservation ? dateObservation : null,
      signed,
      signedIf,
      supplies,
      storages: storages.map(({ tonsHarvest, storageType: { name: { es: storageTypeNAme } } }) => { return { tonsHarvest, storageTypeNAme }}),
      achievements: achievements.map(({ dateAchievement, lots, surface }) => { return { dateAchievement, lots: lots.length, surface, supplies }})
    }
  }).filter(item => item)

  return activitiesRes.sort((a, b) => moment(a.dateOrder).diff(moment(b.dateOrder)))
}
