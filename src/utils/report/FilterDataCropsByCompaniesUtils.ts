export const filterDataCropsByCompanies = (crops, identifierCompany: string): Object[] => {
  return crops.map((crop) => {
    const { identifier: identifierProducer, lots, done, finished } = crop
    const reportPartial = {
      identifierCompany,
        // not found name licency
      identifierProducer,
      nameProducer: crop.company ? crop.company.name : '',
      nameCropType: crop.cropType ? crop.cropType.name.es : '',
      nameCrop: crop.name,
      surfaceCrop: calculateSurfaceLots(lots)
    }
    const activities = [...getDataActivities(done/*,identifierCompany*/), ...getDataActivities(finished/*,identifierCompany*/)]
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
    if (activity/* !== undefined*/) {
      activity.signed += signed ? 1 : 0
      activity.signRequest += 1
    } else {
      elementRow.activities.push({ signed: signed ? 1 : 0, signRequest: 1, typeActivity })
    }
  }
  return result
}

const getDataActivities = (activities/*,identifierCompany: string*/): Object[] => {
  return activities.flatMap(({ typeAgreement, achievements, type: { tag: TypeActivity }, signers }) => {
    const key = typeAgreement ? typeAgreement.key : null
    let responseWithAgreements: Object[] = []
    let responseWithOutAgreements: Object[] = []
    // const identifier = TypeAgreement.visible.includes(identifierCompany)
    let signersSet: Object[] = !!achievements.length ? achievements.flatMap(({ signers }) => signers) : signers
    if (TypeActivity === 'ACT_AGREEMENTS') {
      if (key === 'SUSTAIN' || key === 'SEED_USE') {
        responseWithAgreements = setTypeActivityInSigners(signersSet,TypeActivity)
      }
    } else {
      responseWithOutAgreements = setTypeActivityInSigners(signersSet,TypeActivity)
    }
    return [...responseWithAgreements, ...responseWithOutAgreements]
  }).filter(item => item)
}

const setTypeActivityInSigners = (signers, typeActivity: string): Object[] => {
  return signers.map(({ signed, userId, fullName, email }) => {
    return {
      userSignedId : userId,
      nameSigned: fullName,
      emailSigned: email,
      typeActivity,
      signed
    }
  }).filter((item) => item)
}

const calculateSurfaceLots = (lots): Number => {
  return lots.flatMap(({ data }) => {
    let sum: Number = 0
    return data.map(({ surface }) => sum += surface)
            .reduce((a, b) => a + b, 0)
  }).filter(item => item)[0]
}
