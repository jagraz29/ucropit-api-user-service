import models from '../models'
import _ from 'lodash'

const Company = models.Company

class ReportService {
  /**
   *
   * @param crops
   * @param identifier
   */
  public static generateCropReport (crops, identifier) {
    const reports = crops.map(async (crop) => {
      this.generateLinkPdfSign(crop.finished)
      return {
        cuit: identifier,
        business_name: (await this.getCompany(identifier)).name,
        crop: crop.cropType.name.es,
        volume: crop.surface * crop.pay,
        surface: crop.surface,
        responsible: this.getMembersWithIdentifier(crop),
        date_harvest: crop.dateHarvest.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long'
        }),
        localization: await this.listAddressLots(crop.lots),
        kmz_links: this.generateLinkShowLotKmz(crop.lots),
        surface_total: this.getTotalSurface(crop),
        link_sustainability_agreements: this.generateStaticDownloads(
          crop.finished,
          'SUSTAIN'
        ),
        link_sustainability_agreements_pdf_sign: this.generateLinkPdfSign(
          crop.finished
        ),
        link_land_use_agreement: this.generateStaticDownloads(
          crop.finished,
          'EXPLO'
        ),
        link_land_use_pdf_sign: this.generateLinkPdfSign(crop.finished),
        total_surface_sus: this.sumSurfaceActivity(crop.finished, 'SUSTAIN'),
        total_surface_explo: this.sumSurfaceActivity(crop.finished, 'EXPLO')
      }
    })

    return Promise.all(reports)
  }

  private static async getCompany (identifier) {
    return Company.findOne({ identifier: identifier })
  }

  private static getMembersWithIdentifier (crop) {
    let membersNames = ''
    const members = crop.members.filter((member) => member.type === 'PRODUCER')

    for (const member of members) {
      membersNames += `${member.user.firstName} ${member.user.lastName},`
    }

    return membersNames
  }

  public static async listAddressLots (lots) {
    let listAddressLot = ''
    for (const lot of lots) {
      for (const data of lot.data) {
        const { latitude, longitude } = data.centerBound

        listAddressLot += `
        https://www.google.com.ar/maps/place/35%C2%B028'56.5%22S+60%C2%B057'47.1%22W/@${latitude},${longitude},132450m/data=!3m1!1e3!4m5!3m4!1s0x0:0x0!8m2!3d${latitude}!4d${longitude},
        `
      }
    }

    return listAddressLot
  }

  private static generateLinkShowLotKmz (lots) {
    let links = ''
    for (const lot of lots) {
      for (const data of lot.data) {
        links += `
        ${process.env.BASE_URL}/v1/reports/map/lot?id=${data._id},
        `
      }
    }

    return links
  }

  private static getTotalSurface (crop) {
    const totalPerLot = crop.lots.map((lot) => {
      return this.getTotalSurfaceLot(lot)
    })

    return totalPerLot.reduce((a, b) => a + b, 0)
  }

  private static getTotalSurfaceLot (lot) {
    return lot.data.reduce((a, b) => a + (b['surface'] || 0), 0)
  }

  private static generateStaticDownloads (
    activities,
    typeAgreement: string = 'EXPLO'
  ) {
    let urls = ''
    const urlsDownloads = activities
      .map((activity) => {
        if (
          activity.type.name.en === 'Agreements' &&
          activity.typeAgreement.key === typeAgreement
        ) {
          const urlFiles = activity.files
            .map(
              (file) => `${process.env.BASE_URL}/v1/files/downloads/${file._id}`
            )
            .filter((list) => list.length > 0)

          return urlFiles
        }

        return undefined
      })
      .filter((endpoints) => endpoints)

    const listEndpointsDownload = _.flatten(urlsDownloads)

    for (const endpoint of listEndpointsDownload) {
      urls += `
      ${endpoint},
      `
    }

    return urls
  }

  private static sumSurfaceActivity (
    activities,
    typeAgreement: string = 'EXPLO'
  ) {
    const totalSurface = activities
      .map((activity) => {
        if (
          activity.type.name.en === 'Agreements' &&
          activity.typeAgreement.key === typeAgreement
        ) {
          return activity.lots.reduce((a, b) => a + (b['surface'] || 0), 0)
        }
        return undefined
      })
      .filter((item) => item)

    return totalSurface[0]
  }

  private static generateLinkPdfSign (activities) {
    let urls = ''
    const urlDownloadsFiles = activities.map((activity) => {
      return activity.signers
        .map((signer) => {
          if (signer.approvalRegister) {
            return `${process.env.BASE_URL}/v1/files/downloads/sings/${signer.approvalRegister.file._id}`
          }

          return undefined
        })
        .filter((item) => item)
    })

    const listEndpointsDownloadPdf = _.flatten(urlDownloadsFiles)

    for (const endpoint of listEndpointsDownloadPdf) {
      urls += `
      ${endpoint},
      `
    }

    return urls
  }
}

export default ReportService
