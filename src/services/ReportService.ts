import models from '../models'
import _ from 'lodash'
import GeoLocationService from '../services/GeoLocationService'
import Numbers from '../utils/Numbers'

import { tagsTypeAgreement } from '../utils/Constants'

const Company = models.Company

class ReportService {
  /**
   *
   * @param crops
   */
  public static generateCropReport(crops) {
    const reports = crops.map(async (crop) => {
      return {
        cuit: crop.company?.identifier,
        business_name: (await this.getCompany(crop.company?.identifier)).name,
        crop: crop.cropType.name.es,
        crop_name: crop.name,
        volume: Numbers.roundToTwo(
          this.calVolume(crop.unitType.name.en, crop.pay, crop.lots)
        ),
        surface: crop.surface,
        responsible: this.getMembersWithIdentifier(crop),
        date_harvest: crop.dateHarvest.toLocaleDateString('es-ES', {
          day: 'numeric',
          year: 'numeric',
          month: 'long',
        }),
        city: await this.listAddressLots(crop.lots, 1),
        province: await this.listAddressLots(crop.lots, 2),
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
        percent_achievements_sowing: this.percentAchievementsActivity(
          crop,
          'Sowing'
        ),
        surfaces_signed_sowing: this.sumSurfaceSigners(crop, 'Sowing'),
        surfaces_files_approved: this.totalSurfacesAchievementsFileApproved(
          crop,
          'Sowing'
        ),
        link_pdf_ots_sowing: this.createLinkDownloadFilesSign(
          crop.finished,
          'Sowing'
        ),
        percent_achievements_harvest: this.percentAchievementsActivity(
          crop,
          'Harvest'
        ),
        surfaces_signed_harvest: this.sumSurfaceSigners(crop, 'Harvest'),
        surfaces_files_approved_harvest: this.totalSurfacesAchievementsFileApproved(
          crop,
          'Harvest'
        ),
        link_pdf_ots_harvest: this.createLinkDownloadFilesSign(
          crop.finished,
          'Harvest'
        ),

        percent_achievements_application: this.percentAchievementsActivity(
          crop,
          'Application'
        ),
        surfaces_signed_application: this.sumSurfaceSigners(
          crop,
          'Application'
        ),
        surfaces_files_approved_application: this.totalSurfacesAchievementsFileApproved(
          crop,
          'Application'
        ),
        link_pdf_ots_application: this.createLinkDownloadFilesSign(
          crop.finished,
          'Application'
        ),

        percent_achievements_fertilization: this.percentAchievementsActivity(
          crop,
          'Fertilization'
        ),
        surfaces_signed_fertilization: this.sumSurfaceSigners(
          crop,
          'Fertilization'
        ),
        surfaces_files_approved_fertilization: this.totalSurfacesAchievementsFileApproved(
          crop,
          'Fertilization'
        ),
        link_pdf_ots_fertilization: this.createLinkDownloadFilesSign(
          crop.finished,
          'Fertilization'
        ),

        percent_achievements_tillage: this.percentAchievementsActivity(
          crop,
          'Tillage'
        ),
        surfaces_signed_tillage: this.sumSurfaceSigners(crop, 'Tillage'),
        surfaces_files_approved_tillage: this.totalSurfacesAchievementsFileApproved(
          crop,
          'Tillage'
        ),
        link_pdf_ots_tillage: this.createLinkDownloadFilesSign(
          crop.finished,
          'Tillage'
        ),

        mail_producers: this.getMailsProducers(crop),
        phone_producers: this.getPhonesProducers(crop),
      }
    })

    return Promise.all(reports)
  }

  public static async generateLotReports(crops) {
    const reports = crops.map((crop) => {
      const reportByCrop = crop.lots.map(async (item) => {
        const reportByLot = item.data.map(async (lot) => {
          return {
            cuit: crop.company?.identifier,
            business_name: (await this.getCompany(crop.company?.identifier))
              .name,
            crop: crop.cropType.name.es,
            crop_name: crop.name,
            volume: Numbers.roundToTwo(
              this.calVolume(crop.unitType.name.en, crop.pay, crop.lots)
            ),
            surface: crop.surface,
            responsible: this.getMembersWithIdentifier(crop),
            date_harvest: crop.dateHarvest.toLocaleDateString('es-ES', {
              day: 'numeric',
              year: 'numeric',
              month: 'long',
            }),
            city: await this.getLocaleAddress(lot, 2),
            province: await this.getLocaleAddress(lot, 1),
            kmz_links: this.linkKmzLot(lot),
            tags_lots: this.getListTagLots(crop.lots),
            surface_total: lot.surface,
            link_sustainability_agreements: this.generateStaticDownloads(
              crop.finished,
              tagsTypeAgreement.SUSTAIN
            ),
            link_pdf_ots_agreement_sus: this.createLinkDownloadFilesSign(
              crop.finished.filter(
                (activity) =>
                  activity.type.tag === 'ACT_AGREEMENTS' &&
                  activity.typeAgreement &&
                  activity.typeAgreement.key === 'SUSTAIN'
              ),
              'Agreements'
            ),
            names_signers_sustainability_agreements: this.getNameSigner(
              crop.finished.filter(
                (activity) =>
                  activity.type.tag === 'ACT_AGREEMENTS' &&
                  activity.typeAgreement &&
                  activity.typeAgreement.key === 'SUSTAIN'
              )
            ),
            total_surface_sus: this.includeLotInActivity(
              crop.finished,
              lot,
              tagsTypeAgreement.SUSTAIN
            ),
            link_land_use_agreement: this.generateStaticDownloads(
              crop.finished,
              tagsTypeAgreement.EXPLO
            ),
            link_pdf_ots_agreement_explo: this.createLinkDownloadFilesSign(
              crop.finished.filter(
                (activity) =>
                  activity.type.tag === 'ACT_AGREEMENTS' &&
                  activity.typeAgreement &&
                  activity.typeAgreement.key === 'EXPLO'
              ),
              'Agreements'
            ),
            names_signers_land_use: this.getNameSigner(
              crop.finished.filter(
                (activity) =>
                  activity.type.tag === 'ACT_AGREEMENTS' &&
                  activity.typeAgreement &&
                  activity.typeAgreement.key === 'EXPLO'
              )
            ),
            total_surface_explo: this.includeLotInActivity(
              crop.finished,
              lot,
              tagsTypeAgreement.EXPLO
            ),
            percent_achievements_sowing: this.percentAchievementsActivity(
              crop,
              'Sowing'
            ),
            link_pdf_ots_sowing: this.createLinkDownloadFilesSign(
              crop.finished,
              'Sowing'
            ),
            link_evidences_files_sowing: this.getEvidenceFiles(
              crop,
              'ACT_SOWING'
            ),
            cant_achievements_sowing: this.sumCantAchievementsByLot(
              crop,
              lot,
              'ACT_SOWING'
            ),
            percent_achievements_harvest: this.percentAchievementsActivity(
              crop,
              'Harvest'
            ),
            link_pdf_ots_harvest: this.createLinkDownloadFilesSign(
              crop.finished,
              'Harvest'
            ),
            link_evidences_files_harvest: this.getEvidenceFiles(
              crop,
              'ACT_HARVEST'
            ),
            cant_achievements_harvest: this.sumCantAchievementsByLot(
              crop,
              lot,
              'ACT_HARVEST'
            ),

            percent_achievements_application: this.percentAchievementsActivity(
              crop,
              'Application'
            ),
            link_pdf_ots_application: this.createLinkDownloadFilesSign(
              crop.finished,
              'Application'
            ),

            link_evidences_files_application: this.getEvidenceFiles(
              crop,
              'ACT_APPLICATION'
            ),

            cant_achievements_application: this.sumCantAchievementsByLot(
              crop,
              lot,
              'ACT_APPLICATION'
            ),

            percent_achievements_fertilization: this.percentAchievementsActivity(
              crop,
              'Fertilization'
            ),
            link_pdf_ots_fertilization: this.createLinkDownloadFilesSign(
              crop.finished,
              'Fertilization'
            ),
            link_evidences_files_fertilization: this.getEvidenceFiles(
              crop,
              'ACT_FERTILIZATION'
            ),
            cant_achievements_fertilization: this.sumCantAchievementsByLot(
              crop,
              lot,
              'ACT_FERTILIZATION'
            ),

            percent_achievements_tillage: this.percentAchievementsActivity(
              crop,
              'Tillage'
            ),
            surfaces_signed_tillage: this.sumSurfaceSigners(crop, 'Tillage'),
            link_pdf_ots_tillage: this.createLinkDownloadFilesSign(
              crop.finished,
              'Tillage'
            ),
            link_evidences_files_tillage: this.getEvidenceFiles(
              crop,
              'ACT_TILLAGE'
            ),
            cant_achievements_tillage: this.sumCantAchievementsByLot(
              crop,
              lot,
              'ACT_TILLAGE'
            ),

            mail_producers: this.getMailsProducers(crop),
            phone_producers: this.getPhonesProducers(crop),
          }
        })

        return Promise.all(reportByLot)
      })

      return Promise.all(reportByCrop)
    })

    return _.flatten(_.flatten(await Promise.all(reports)))
  }

  private static async getCompany(identifier) {
    return Company.findOne({ identifier: identifier })
  }

  private static getMembersWithIdentifier(crop) {
    let membersNames = ''
    const members = crop.members.filter((member) => member.type === 'PRODUCER')

    for (const member of members) {
      membersNames += `${member.user.firstName} ${member.user.lastName},`
    }

    return membersNames
  }

  private static getMailsProducers(crop) {
    let membersMails = ''
    const members = crop.members.filter((member) => member.type === 'PRODUCER')

    for (const member of members) {
      membersMails += `
      ${member.user.email},
      `
    }

    return membersMails
  }

  private static getPhonesProducers(crop) {
    let membersPhones = ''
    const members = crop.members.filter((member) => member.type === 'PRODUCER')

    for (const member of members) {
      membersPhones += `
      ${member.user.phone},
      `
    }

    return membersPhones
  }

  public static async listAddressLots(lots, pos: number) {
    let listAddressLot = ''
    let result = ''
    for (const lot of lots) {
      for (const data of lot.data) {
        result = await this.getLocaleAddress(data, pos)
        listAddressLot += `
          ${result},
        `
      }
    }

    return listAddressLot
  }

  private static async getLocaleAddress(
    lot: any,
    pos: number
  ): Promise<string> {
    let listAddressLot = ''
    let result = ''
    if (lot.centerBound) {
      const { latitude, longitude } = lot.centerBound

      const resultAddress: any = await GeoLocationService.getLocationByCoordinates(
        latitude,
        longitude
      )

      if (
        resultAddress.length > 0 &&
        resultAddress[0].address_components.length > 0
      ) {
        const address = resultAddress[0].address_components.filter((item) =>
          item.types.includes(`administrative_area_level_${pos}`)
        )

        result = address.length > 0 ? address[0].short_name : ''
      }
    }

    listAddressLot += `
    ${result},
  `

    return listAddressLot
  }

  private static generateLinkShowLotKmz(lots) {
    let links = ''
    for (const lot of lots) {
      for (const data of lot.data) {
        links += this.linkKmzLot(data)
      }
    }

    return links
  }

  private static linkKmzLot(lot) {
    return `${process.env.BASE_URL}/v1/reports/map/lot?id=${lot._id}`
  }

  private static getListTagLots(lots) {
    let tags = ''
    for (const lot of lots) {
      tags += `
        ${lot.tag},
        `
    }

    return tags
  }

  private static getTotalSurface(crop) {
    const totalPerLot = crop.lots.map((lot) => {
      return this.getTotalSurfaceLot(lot)
    })

    return totalPerLot.reduce((a, b) => a + b, 0)
  }

  private static getTotalSurfaceLot(lot) {
    return lot.data.reduce((a, b) => a + (b['surface'] || 0), 0)
  }

  private static calVolume(
    unit: string,
    pay: number,
    lots: Array<any>
  ): number {
    const surfaces = this.sumSurfaceLotsCrop(lots)

    if (unit === 'Tons') {
      return pay * surfaces
    }

    if (unit === 'Kilograms') {
      return (pay / 1000) * surfaces
    }

    if (unit === 'Quintales') {
      return (pay / 10) * surfaces
    }

    return 0
  }

  private static sumCantAchievementsByLot(crop, lot, typeActivity) {
    const done = this.cantAchievementByLot(
      crop.done.filter((activity) => activity.type.tag === typeActivity),
      lot
    )
    const finished = this.cantAchievementByLot(
      crop.finished.filter((activity) => activity.type.tag === typeActivity),
      lot
    )

    return done + finished
  }

  private static cantAchievementByLot(activities, lot) {
    let cant = 0
    for (const activity of activities) {
      for (const achievement of activity.achievements) {
        const lotSelected = achievement.lots.find(
          (lotMade) => lotMade._id.toString() === lot._id.toString()
        )

        if (lotSelected) cant++
      }
    }

    return cant
  }

  private static sumSurfaceLotsCrop(lots: Array<any>): number {
    let sum = 0

    sum = lots
      .map((lot) => {
        return {
          total: lot.data.reduce((a, b) => a + (b['surface'] || 0), 0),
        }
      })
      .reduce((a, b) => a + (b['total'] || 0), 0)

    return sum
  }

  private static getEvidenceFiles(crop: any, tag: string): string {
    let urls: string = ''

    const activities: Array<any> = crop.done
      .filter((activity) => activity.type.tag === tag)
      .concat(crop.finished.filter((activity) => activity.type.tag === tag))

    const urlsDownloads = activities.map((activity) => {
      return activity.achievements.map((achievement) => {
        const urlFiles = achievement.files.map(
          (file) => `${process.env.BASE_URL}/v1/files/downloads/${file._id}`
        )

        return urlFiles
      })
    })

    const listEndpointsDownload = _.flatten(_.flatten(urlsDownloads))

    for (const endpoint of listEndpointsDownload) {
      urls += `
      ${endpoint},
      `
    }

    return urls
  }

  private static generateStaticDownloads(
    activities,
    typeAgreement: string = tagsTypeAgreement.EXPLO
  ) {
    let urls: string = ''
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

  private static createLinkDownloadFilesSign(activities, type) {
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

  private static sumSurfaceActivity(
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

  private static includeLotInActivity(
    activities,
    lot,
    typeAgreement: string = tagsTypeAgreement.EXPLO
  ) {
    const surfaceLot = activities
      .map((activity) => {
        if (
          activity.type.name.en === 'Agreements' &&
          activity.typeAgreement.key === typeAgreement
        ) {
          const lotSelected = activity.lots.find(
            (lotItem) => lotItem._id.toString() === lot._id.toString()
          )

          if (lotSelected) return lotSelected.surface
        }
        return undefined
      })
      .filter((item) => item)

    return surfaceLot[0] || 0
  }

  private static percentAchievementsActivity(crop, type) {
    const listActivitiesDone = this.getActivitiesAchievementByType(
      crop,
      type,
      'done'
    )

    const listActivitiesFinished = this.getActivitiesAchievementByType(
      crop,
      type,
      'finished'
    )

    const totalPercentDone = this.getTotalPercent(listActivitiesDone)

    const totalPercentFinished = this.getTotalPercent(listActivitiesFinished)

    return totalPercentDone + totalPercentFinished
  }

  private static totalSurfacesAchievementsFileApproved(crop, type) {
    const listActivitiesDone = this.getActivitiesAchievementByType(
      crop,
      type,
      'done'
    )

    const listActivitiesFinished = this.getActivitiesAchievementByType(
      crop,
      type,
      'finished'
    )

    const totalSurfaceDone = this.getSurfaceFileApproved(listActivitiesDone)
    const totalSurfaceFinished = this.getSurfaceFileApproved(
      listActivitiesFinished
    )

    return totalSurfaceDone + totalSurfaceFinished
  }

  private static getTotalPercent(activities) {
    let total = 0

    for (const activity of activities) {
      total += activity.achievements.reduce(
        (a, b) => a + (b['percent'] || 0),
        0
      )
    }

    return total
  }

  private static getHashSign(activities) {
    let hashList = ''
    const hashArrayList = activities.map((activity) => {
      return activity.approvalRegister ? activity.approvalRegister.ots : ''
    })

    const hashItemsHash = _.flatten(hashArrayList)

    for (const hash of hashItemsHash) {
      hashList += `
      ${hash},
      `
    }

    return hashList
  }

  private static sumSurfaceSigners(crop, type) {
    const listActivitiesDone = this.getActivitiesAchievementByType(
      crop,
      type,
      'done'
    )

    const listActivitiesFinished = this.getActivitiesAchievementByType(
      crop,
      type,
      'finished'
    )

    const sumTotalActivitiesDone = this.getSurfaceSigned(listActivitiesDone)
    const sumTotalActivitiesFinished = this.getSurfaceSigned(
      listActivitiesFinished
    )

    return sumTotalActivitiesDone + sumTotalActivitiesFinished
  }

  private static getNameSigner(activities) {
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

  private static getSurfaceSigned(activities) {
    let total = 0

    for (const activity of activities) {
      for (const achievement of activity.achievements) {
        if (this.isCompleteSigners(achievement.signers)) {
          total += achievement.lots.reduce((a, b) => a + (b['surface'] || 0), 0)
        }
      }
    }

    return total
  }

  private static getSurfaceFileApproved(activities) {
    let total = 0
    for (const activity of activities) {
      for (const achievement of activity.achievements) {
        if (this.isApprovedFileEvidence(achievement.files)) {
          total += achievement.lots.reduce((a, b) => a + (b['surface'] || 0), 0)
        }
      }
    }

    return total
  }

  private static getActivitiesAchievementByType(crop, type, status) {
    return crop[status].length > 0
      ? crop[status].filter((activity) => activity.type.name.en === type)
      : []
  }

  private static isCompleteSigners(signers): boolean {
    for (const user of signers) {
      if (!user.signed) {
        return false
      }
    }

    return true
  }

  private static isApprovedFileEvidence(files) {
    for (const file of files) {
      if (file.settings && file.settings.fromLots) {
        return true
      }
    }

    return false
  }
}

export default ReportService
