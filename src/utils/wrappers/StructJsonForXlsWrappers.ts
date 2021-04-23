import { ReportSignersByCompany } from '../../interfaces'

interface SingForTypeActivity {
  signed: Number
  signRequest: Number
}

export const structJsonForXls = (crops): Array<ReportSignersByCompany> => {
  return crops.flatMap((crop) => {
    const { identifierCompany, identifierProducer, nameProducer, nameCropType, nameCrop, surfaceCrop, signers } = crop
    return signers.map(({ nameSigned, userSignedId, activities }) => {
      return {
        identifier_company: identifierCompany,
                // nameCompany: string,
        identifier_producer: identifierProducer,
        name_producer: nameProducer,
        crop: nameCropType,
        crop_name: nameCrop,
        surface_crop: surfaceCrop,
        user_signed_id: userSignedId.toString(),
        name_signed: nameSigned,
        sign_ACT_AGREEMENTS: singForTypeActivity(activities,'ACT_AGREEMENTS').signed,
        sign_request_ACT_AGREEMENTS: singForTypeActivity(activities,'ACT_AGREEMENTS').signRequest,
        sign_ACT_SOWING: singForTypeActivity(activities,'ACT_SOWING').signed,
        sign_request_ACT_SOWING: singForTypeActivity(activities,'ACT_SOWING').signRequest,
        sign_ACT_APPLICATION: singForTypeActivity(activities,'ACT_APPLICATION').signed,
        sign_request_ACT_APPLICATION: singForTypeActivity(activities,'ACT_APPLICATION').signRequest,
        sign_ACT_MONITORING: singForTypeActivity(activities,'ACT_MONITORING').signed,
        sign_request_ACT_MONITORING: singForTypeActivity(activities,'ACT_MONITORING').signRequest,
        sign_ACT_HARVEST: singForTypeActivity(activities,'ACT_HARVEST').signed,
        sign_request_ACT_HARVEST: singForTypeActivity(activities,'ACT_HARVEST').signRequest
      }
    })
  })
}

const singForTypeActivity = (activities, typeActivityParam: string): SingForTypeActivity => {
  const data = activities.find(({ typeActivity }) => typeActivity === typeActivityParam)
  return {
    signed: data ? data.signed : 0,
    signRequest: data ? data.signRequest : 0
  }
}
