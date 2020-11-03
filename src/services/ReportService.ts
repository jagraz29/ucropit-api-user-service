import GeoLocationService from '../services/GeoLocationService'
import models from '../models'

const Company = models.Company

class ReportService {
  public static generateCropReport (crops, identifier) {
    const reports = crops.map(async (crop) => {
      this.getTotalSurface(crop)
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
        }),
        localization: await this.listAddressLots(crop.lots),
        surface_total: this.getTotalSurface(crop)
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
    let listAddressLot = ''
    for (const lot of losts) {
      for (const data of lot.data) {
        const { latitude, longitude } = data.centerBound
        const result = await GeoLocationService.getLocationByCoordinates(
          latitude,
          longitude
        )
        listAddressLot += `${data.name}: ${result[0].address_components[1].long_name} ${result[0].address_components[2].long_name},`
      }
    }

    return listAddressLot
  }

  private static getTotalSurface (crop) {
    const totalPerLot = crop.lots.map((lot) => {
      return this.getTotalSurfaceLot(lot)
    })

    return totalPerLot.reduce((a, b) => a + b, 0)
  }

  private static getTotalSurfaceLot (lot) {
    console.log(lot)
    return lot.data.reduce((a, b) => a + (b['surface'] || 0), 0)
  }
}

export default ReportService
