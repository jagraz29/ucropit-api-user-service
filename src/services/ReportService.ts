import GeoLocationService from '../services/GeoLocationService'
import models from '../models'

const Company = models.Company

class ReportService {
  public static generateCropReport (crops, identifier) {
    const reports = crops.map(async (crop) => {
      this.getMembersWithIdentifier(crop, identifier)
      return {
        cuit: identifier,
        bussiness_name: (await this.getCompany(identifier)).name,
        crop: crop.cropType.name.es,
        volume: crop.surface * crop.pay,
        surface: crop.surface,
        responsible: this.getMembersWithIdentifier(crop, identifier),
        date_harvest: crop.dateHarvest.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long'
        })
      }
    })

    return Promise.all(reports)
  }

  private static async getCompany (identifier) {
    return Company.findOne({ identifier: identifier })
  }

  private static getMembersWithIdentifier (crop, identifier) {
    let membersNames = ''
    const members = crop.members.filter(
      (member) => member.identifier === identifier
    )

    for (const member of members) {
      membersNames += `${member.user.firstName} ${member.user.lastName},`
    }

    return membersNames
  }

  public static async listAddressLots (losts) {
    for (const lot of losts) {
      for (const data of lot.data) {
        const { latitude, longitude } = data.centerBound
        const result = await GeoLocationService.getLocationByCoordinates(
          latitude,
          longitude
        )

        console.log(result)
      }
    }
  }
}

export default ReportService
