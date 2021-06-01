import _ from 'lodash'
import { StatusActivities, TypeActivities, TypeAgreement } from '../../interfaces'

export const filterDataCropsByCompanies = (crops, identifierCompany: string): Object[] => {
  return crops.map((crop) => {
    const { identifier: identifierProducer, lots, activities: activitiesCrop } = crop
    const reportPartial = {
      identifierCompany,
      identifierProducer,
      nameProducer: crop.company?.name ?? '',
      nameCropType: crop.cropType?.name.es ?? '',
      nameCrop: crop.name,
      surfaceCrop: calculateSurfaceLots(lots)
    }
    const activities = getDataActivities(activitiesCrop)
    return { ...reportPartial, signers: setSignersToRows(activities) }
  })
}

const setSignersToRows = (activities): Object[] => {
  let result = []
  for (const { nameSigned, emailSigned, userSignedId, typeActivity, signed } of activities) {
    if (!result.some((elem) => elem.userSignedId.toString() === userSignedId.toString())) {
      result.push({
        nameSigned: nameSigned,
        emailSigned: emailSigned,
        userSignedId: userSignedId,
        activities: [{ signed: 0, signRequest: 0, typeActivity }]
      })
    }
    let elementRow = result.find((elem) => elem.userSignedId.toString() === userSignedId.toString())
    let activity = elementRow.activities.find((elem) => elem.typeActivity === typeActivity)
    if (activity) {
      activity.signed += signed ?? 0
      activity.signRequest += 1
    } else {
      elementRow.activities.push({ signed: signed ?? 0, signRequest: 1, typeActivity })
    }
  }
  return result
}

const getDataActivities = (activities): Object[] => {
  return _.flatten(activities.map(({ typeAgreement, achievements, type: { tag: TypeActivity }, signers, status }) => {
    const { name: { en: StatusActivity } } = status[0]

    if (StatusActivity === StatusActivities.DONE || StatusActivity === StatusActivities.FINISHED) {
      const key = typeAgreement?.key ?? null
      let responseWithAgreements: Object[] = []
      let responseWithOutAgreements: Object[] = []
      let signersSet: Object[] = achievements.length ? _.flatten(achievements.map(({ signers }) => signers)) : signers
      if (TypeActivity === TypeActivities.ACT_AGREEMENTS) {
        if (key === TypeAgreement.SUSTAIN || key === TypeAgreement.SEED_USE) {
          responseWithAgreements = setTypeActivityInSigners(signersSet,TypeActivity)
        }
      } else {
        responseWithOutAgreements = setTypeActivityInSigners(signersSet,TypeActivity)
      }
      return [...responseWithAgreements, ...responseWithOutAgreements]
    }
  }).filter(item => item))
}

const setTypeActivityInSigners = (signers, typeActivity: string): Object[] => {
  return signers.map(({ signed, userId, fullName, email }) => {
    return {
      userSignedId: userId,
      nameSigned: fullName,
      emailSigned: email,
      typeActivity,
      signed
    }
  }).filter((item) => item)
}

const calculateSurfaceLots = (lots): Number => {
  return _.flatten(lots.map(({ data }) => {
    let sum: Number = 0
    return data.map(({ surface }) => sum += surface)
            .reduce((a, b) => a + b, 0)
  }).filter(item => item))[0]
}
