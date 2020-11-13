import models from '../models'
import _ from 'lodash'

import { tagsTypeAgreement } from '../utils/Constants'

const Company = models.Company

class ReportService {
  /**
   *
   * @param crops
   * @param identifier
   */
  public static generateCropReport (crops, identifier) {
    const reports = crops.map(async (crop) => {
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
        tags_lots: this.getListTagLots(crop.lots),
        surface_total: this.getTotalSurface(crop),
        link_sustainability_agreements: this.generateStaticDownloads(
          crop.finished,
          tagsTypeAgreement.SUSTAIN
        ),
        hash_sustainability_agreements_sign: this.getHashSign(crop.finished),
        names_signers_sustainability_agreements: this.getNameSigner(
          crop.finished
        ),
        total_surface_sus: this.sumSurfaceActivity(
          crop.finished,
          tagsTypeAgreement.SUSTAIN
        ),
        link_land_use_agreement: this.generateStaticDownloads(
          crop.finished,
          tagsTypeAgreement.EXPLO
        ),
        hash_land_use_sign: this.getHashSign(crop.finished),
        names_signers_land_use: this.getNameSigner(crop.finished),
        total_surface_explo: this.sumSurfaceActivity(
          crop.finished,
          tagsTypeAgreement.EXPLO
        ),
        link_pdf_ots_agreement: this.createLinkDownloadFilesSign(
          crop.finished,
          'Agreements'
        ),
        mail_producers: this.getMailsProducers(crop),
        phone_producers: this.getPhonesProducers(crop)
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

  private static getMailsProducers (crop) {
    let membersMails = ''
    const members = crop.members.filter((member) => member.type === 'PRODUCER')

    for (const member of members) {
      membersMails += `
      ${member.user.email},
      `
    }

    return membersMails
  }

  private static getPhonesProducers (crop) {
    let membersPhones = ''
    const members = crop.members.filter((member) => member.type === 'PRODUCER')

    for (const member of members) {
      membersPhones += `
      ${member.user.phone},
      `
    }

    return membersPhones
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

  private static getListTagLots (lots) {
    let tags = ''
    for (const lot of lots) {
      tags += `
        ${lot.tag},
        `
    }

    return tags
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
    typeAgreement: string = tagsTypeAgreement.EXPLO
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

  private static createLinkDownloadFilesSign (activities, type) {
    let urls = ''
    const urlsDownloads = activities
      .map((activity) => {
        if (activity.type.name.en === type) {
          const approvalRegister = activity.approvalRegister
            ? activity.approvalRegister
            : null
          if (approvalRegister) {
            return `
              ${process.env.BASE_URL}/v1/files/downloads/sings/${approvalRegister.filePdf}
              ${process.env.BASE_URL}/v1/files/downloads/sings/${approvalRegister.fileOts}
              `
          }
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
    typeAgreement: string = tagsTypeAgreement.EXPLO
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

  private static getHashSign (activities) {
    let hashList = ''
    const hashArrayList = activities.map((activity) => {
      return activity.approvalRegister.ots
    })

    const hashItemsHash = _.flatten(hashArrayList)

    for (const hash of hashItemsHash) {
      hashList += `
      ${hash},
      `
    }

    return hashList
  }

  private static getNameSigner (activities) {
    let nameList = ''

    const namesArrayList = activities.map((activity) => {
      return activity.signers
        .map((signer) => {
          if (signer.signed) {
            return `${signer.fullName}`
          }

          return undefined
        })
        .filter((item) => item)
    })

    const nameItems = _.flatten(namesArrayList)

    for (const names of nameItems) {
      nameList += `
      ${names},
      `
    }

    return nameList
  }
}

export default ReportService
