import models from '../models'
import _ from 'lodash'
import GeoLocationService from '../services/GeoLocationService'
import Numbers from '../utils/Numbers'

import {
  tagsTypeAgreement,
  responsibleRoles,
  supplyTypesSeedGen,
  rolesAdvisorPromoter
} from '../utils/Constants'
import Achievement from '../models/achievement'
import Activity from '../models/activity'

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
          month: 'long'
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
        phone_producers: this.getPhonesProducers(crop)
      }
    })

    return Promise.all(reports)
  }

  public static async generateLotReports(crops) {
    const reports = crops.map((crop) => {
      const reportByCrop = crop.lots.map(async (item) => {
        const reportByLot = item.data.map(async (lot) => {
          this.getDateLastAchievement(
            crop.done.filter((activity) => activity.type.tag === 'ACT_SOWING'),
            lot
          )
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
            pay: crop.pay,
            responsible: this.getMembersWithIdentifier(crop),
            date_sowing: crop.dateHarvest.toLocaleDateString('es-ES', {
              day: 'numeric',
              year: 'numeric',
              month: 'long'
            }),
            date_harvest: crop.dateHarvest.toLocaleDateString('es-ES', {
              day: 'numeric',
              year: 'numeric',
              month: 'long'
            }),
            date_created_crop: crop._id
              .getTimestamp()
              .toLocaleDateString('es-ES', {
                day: 'numeric',
                year: 'numeric',
                month: 'long'
              }),
            city: await this.getLocaleAddress(lot, 2),
            province: await this.getLocaleAddress(lot, 1),
            kmz_links: this.linkKmzLot(lot),
            tags_lots: this.getListTagLots(crop.lots),
            name_lot: lot.name,
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
            date_sign_achievement_by_lot_sus: await this.lastDateSignAchievementByLotAgreement(
              crop,
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
            date_sign_achievement_by_lot_explo: await this.lastDateSignAchievementByLotAgreement(
              crop,
              lot,
              tagsTypeAgreement.EXPLO
            ),
            surface_planned_sowing: this.surfacePlannedByActivity(
              crop,
              lot,
              'ACT_SOWING'
            ),
            date_achievement_sowing: this.lastDateAchievementByLot(
              crop,
              lot,
              'ACT_SOWING'
            ),
            surface_achievement_sowing: this.surfaceAchievementsActivity(
              crop,
              'ACT_SOWING'
            ),
            total_surface_signed_sowing: this.sumSurfaceSigners(
              crop,
              'ACT_SOWING'
            ),
            date_sign_achievement_by_lot_sowing: await this.lastDateSignAchievementByLot(
              crop,
              lot,
              'ACT_SOWING'
            ),
            total_surface_with_evidence_sowing: this.totalSurfacesAchievementsFileApproved(
              crop,
              'ACT_SOWING'
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
            surface_planned_harvest: this.surfacePlannedByActivity(
              crop,
              lot,
              'ACT_HARVEST'
            ),
            date_achievement_harvest: this.lastDateAchievementByLot(
              crop,
              lot,
              'ACT_HARVEST'
            ),
            surface_achievement_harvest: this.surfaceAchievementsActivity(
              crop,
              'ACT_HARVEST'
            ),
            total_surface_signed_harvest: this.sumSurfaceSigners(
              crop,
              'ACT_HARVEST'
            ),
            date_sign_achievement_by_lot_harvest: await this.lastDateSignAchievementByLot(
              crop,
              lot,
              'ACT_HARVEST'
            ),
            total_surface_with_evidence_harvest: this.totalSurfacesAchievementsFileApproved(
              crop,
              'ACT_HARVEST'
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
            surface_planned_application: this.surfacePlannedByActivity(
              crop,
              lot,
              'ACT_APPLICATION'
            ),
            date_achievement_application: this.lastDateAchievementByLot(
              crop,
              lot,
              'ACT_APPLICATION'
            ),
            surface_achievement_application: this.surfaceAchievementsActivity(
              crop,
              'ACT_APPLICATION'
            ),
            total_surface_signed_application: this.sumSurfaceSigners(
              crop,
              'ACT_APPLICATION'
            ),
            date_sign_achievement_by_lot_application: await this.lastDateSignAchievementByLot(
              crop,
              lot,
              'ACT_APPLICATION'
            ),
            total_surface_with_evidence_application: this.totalSurfacesAchievementsFileApproved(
              crop,
              'ACT_APPLICATION'
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
            surface_planned_fertilization: this.surfacePlannedByActivity(
              crop,
              lot,
              'ACT_FERTILIZATION'
            ),
            date_achievement_fertilization: this.lastDateAchievementByLot(
              crop,
              lot,
              'ACT_FERTILIZATION'
            ),
            surface_achievement_fertilization: this.surfaceAchievementsActivity(
              crop,
              'ACT_FERTILIZATION'
            ),
            total_surface_signed_fertilization: this.sumSurfaceSigners(
              crop,
              'ACT_FERTILIZATION'
            ),
            date_sign_achievement_by_lot_fertilization: await this.lastDateSignAchievementByLot(
              crop,
              lot,
              'ACT_FERTILIZATION'
            ),
            total_surface_with_evidence_fertilization: this.totalSurfacesAchievementsFileApproved(
              crop,
              'ACT_FERTILIZATION'
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
            surface_planned_tillage: this.surfacePlannedByActivity(
              crop,
              lot,
              'ACT_TILLAGE'
            ),
            date_achievement_tillage: this.lastDateAchievementByLot(
              crop,
              lot,
              'ACT_TILLAGE'
            ),
            surface_achievement_tillage: this.surfaceAchievementsActivity(
              crop,
              'ACT_TILLAGE'
            ),
            total_surface_signed_tillage: this.sumSurfaceSigners(
              crop,
              'ACT_TILLAGE'
            ),
            date_sign_achievement_by_lot_tillage: await this.lastDateSignAchievementByLot(
              crop,
              lot,
              'ACT_TILLAGE'
            ),
            total_surface_with_evidence_tillage: this.totalSurfacesAchievementsFileApproved(
              crop,
              'ACT_TILLAGE'
            ),
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
            phone_producers: this.getPhonesProducers(crop)
          }
        })

        return Promise.all(reportByLot)
      })

      return Promise.all(reportByCrop)
    })

    return _.flatten(_.flatten(await Promise.all(reports)))
  }

  public static generateDataSet(crops: Array<any>) {
    const cropsClean = this.cleanCrops(crops)

    const dataSet = cropsClean.map((crop) => {
      const dataLots = crop.lots.map((item) => {
        const itemData = item.data.map((lot) => {
          return {
            lot_id: lot._id.toString(),
            campaign_id: crop._id.toString(),
            coords: lot.coordinates,
            state: 'Done',
            sowing_surfaces: this.getSurfacesSowing(crop, lot, 'ACT_SOWING'),
            cant_lots_in_achievements_sowing: this.getCantLotInAchievement(
              crop,
              lot,
              'ACT_SOWING'
            ),
            list_complete_signed_achievements_sowing: this.getValidateAchievements(
              crop,
              lot,
              'ACT_SOWING'
            ),
            sowing_date: this.getListDates(crop, lot, 'ACT_SOWING'),
            harvest_date: this.getListDates(crop, lot, 'ACT_HARVEST'),
            cropType: crop.cropType.name.es,
            seed_gen: this.getListSeedGen(crop, lot, 'ACT_SOWING'),
            yield: this.getPayLot(crop, lot, 'ACT_HARVEST')
          }
        })
        return itemData
      })

      return dataLots
    })

    return _.flatten(_.flatten(dataSet))
  }

  private static filterActivityBy(crop: any, lot: any, type: string) {
    let results = []
    const activitiesDone = crop.done.filter(
      (activity) => activity.type.tag === type
    )

    const activitiesFinished = crop.finished.filter(
      (activity) => activity.type.tag === type
    )

    const activities = [...activitiesDone, ...activitiesFinished]

    if (activities.length > 0) {
      const achievements = activities.map((item) => {
        return item.achievements.filter((achievement) =>
          achievement.lots.find(
            (lotMade) => lotMade._id.toString() === lot._id.toString()
          )
        )
      })

      results = _.flatten(achievements)
    }

    return results
  }

  private static getCantLotInAchievement(
    crop: any,
    lot: any,
    type: string
  ): Array<string> {
    let listCantLots: Array<string> = []

    const listAchievements = this.filterActivityBy(crop, lot, type)

    for (const achievement of listAchievements) {
      listCantLots.push(achievement.lots.length)
    }

    return listCantLots
  }

  private static getListDates(
    crop: any,
    lot: any,
    type: string
  ): Array<string> {
    let listDates: Array<string> = []

    const listAchievements = this.filterActivityBy(crop, lot, type)

    for (const achievement of listAchievements) {
      listDates.push(achievement.dateAchievement.toLocaleDateString('es-ES'))
    }

    return listDates
  }

  private static getValidateAchievements(
    crop: any,
    lot: any,
    type: string
  ): Array<any> {
    let listValidate: Array<any> = []

    const listAchievements = this.filterActivityBy(crop, lot, type)

    for (const achievement of listAchievements) {
      listValidate.push({
        validate: this.isCompleteSigners(achievement.signers)
      })
    }

    return listValidate
  }

  private static getListSeedGen(
    crop: any,
    lot: any,
    type: string
  ): Array<string> {
    let list: Array<string> = []

    const achievements = this.filterActivityBy(crop, lot, type)

    for (const achievement of achievements) {
      for (const supply of achievement.supplies) {
        if (supplyTypesSeedGen.includes(supply.typeId.toString())) {
          list.push(`${supply.name} - ${supply.quantity} bls/h`)
        }
      }
    }

    return list
  }

  private static getSurfacesSowing(
    crop: any,
    lot: any,
    type: string
  ): Array<number> {
    let list: Array<number> = []

    const achievements = this.filterActivityBy(crop, lot, type)

    for (const achievement of achievements) {
      list.push(achievement.surface)
    }

    return list
  }

  private static getPayLot(crop: any, lot: any, type: string): Array<number> {
    let result: Array<number> = []

    const achievements = this.filterActivityBy(crop, lot, type)

    for (const achievement of achievements) {
      result.push(
        achievement.destination.reduce((a, b) => a + (b['tonsHarvest'] || 0), 0)
      )
    }

    return result
  }

  private static cleanCrops(crops: any) {
    return crops.filter(
      (crop) =>
        this.checkAgreements(crop.finished) &&
        (this.isContainActivity(crop, 'ACT_SOWING') ||
          this.isContainActivity(crop, 'ACT_HARVEST'))
    )
  }

  private static checkAgreements(activities: Array<any>): Boolean {
    const agreements = activities.filter(
      (activity) =>
        activity.typeAgreement &&
        (activity.typeAgreement.key === 'EXPLO' ||
          activity.typeAgreement.key === 'SUSTAIN')
    )

    if (agreements.length > 0) {
      return true
    }
    return false
  }

  private static isContainActivity(crop: any, type): Boolean {
    const activitiesDone = crop.done.filter(
      (activity) => activity.type && activity.type.tag === type
    )

    const activitiesFinished = crop.finished.filter(
      (activity) => activity.type && activity.type.tag === type
    )

    const activities = [...activitiesDone, ...activitiesFinished]

    if (activities.length > 0) {
      return true
    }

    return false
  }

  private static async getCompany(identifier) {
    return Company.findOne({ identifier: identifier })
  }

  private static getMembersWithIdentifier(crop) {
    let membersNames = ''
    const members = crop.members.filter((member) =>
      responsibleRoles.includes(member.type)
    )

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

  private static transformCRS(coordinates) {
    let pointString = '['

    for (const point of coordinates) {
      pointString += `(${point.latitude},${point.longitude}),`
    }

    pointString += ']'

    return pointString
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

  private static surfacePlannedByActivity(
    crop: any,
    lot: any,
    typeActivity: string
  ): number {
    const done = this.sumSurfacePlannedActivity(
      crop.done.filter((activity) => activity.type.tag === typeActivity),
      lot
    )

    const finished = this.sumSurfacePlannedActivity(
      crop.finished.filter((activity) => activity.type.tag === typeActivity),
      lot
    )

    return done + finished
  }

  private static surfaceAchievementsActivity(
    crop: any,
    typeActivity: string
  ): number {
    const done = this.sumSurfaceAchievements(
      crop.done.filter((activity) => activity.type.tag === typeActivity)
    )

    const finished = this.sumSurfaceAchievements(
      crop.finished.filter((activity) => activity.type.tag === typeActivity)
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
          total: lot.data.reduce((a, b) => a + (b['surface'] || 0), 0)
        }
      })
      .reduce((a, b) => a + (b['total'] || 0), 0)

    return sum
  }

  private static lastDateAchievementByLot(crop, lot, typeActivity) {
    const datesDone = this.getDateLastAchievement(
      crop.done.filter((activity) => activity.type.tag === typeActivity),
      lot
    )

    const datesFinished = this.getDateLastAchievement(
      crop.finished.filter((activity) => activity.type.tag === typeActivity),
      lot
    )

    const mergedList = datesDone.concat(datesFinished)

    const lastDate =
      mergedList.length > 0 ? datesDone.concat(datesFinished).pop() : null

    return lastDate
      ? lastDate.toLocaleDateString('es-ES', {
          day: 'numeric',
          year: 'numeric',
          month: 'long'
        })
      : ''
  }

  private static async lastDateSignAchievementByLotAgreement(
    crop,
    lot,
    typeAgreement
  ) {
    const datesFinished = await this.getDateLastSignedAgreement(
      crop.finished.filter(
        (activity) =>
          activity.type.tag === 'ACT_AGREEMENTS' &&
          activity.typeAgreement.key === typeAgreement
      ),
      lot
    )

    const lastDate = datesFinished.length > 0 ? datesFinished[0] : null

    return lastDate
      ? lastDate.toLocaleDateString('es-ES', {
          day: 'numeric',
          year: 'numeric',
          month: 'long'
        })
      : ''
  }

  private static async lastDateSignAchievementByLot(crop, lot, typeActivity) {
    const datesDone = await this.getDateLastSigned(
      crop.done.filter((activity) => activity.type.tag === typeActivity),
      lot
    )

    const datesFinished = await this.getDateLastSigned(
      crop.finished.filter((activity) => activity.type.tag === typeActivity),
      lot
    )

    const mergedList = datesDone.concat(datesFinished)

    const lastDate =
      mergedList.length > 0 && mergedList !== undefined
        ? datesDone.concat(datesFinished)[0]
        : null

    return lastDate
      ? lastDate.toLocaleDateString('es-ES', {
          day: 'numeric',
          year: 'numeric',
          month: 'long'
        })
      : ''
  }

  private static async getDateLastSignedAgreement(activities, lot) {
    let dates = []

    for (const activity of activities) {
      const lotsSelected = activity.lots.filter(
        (lotSelected) => lotSelected?._id.toString() === lot?._id.toString()
      )

      if (lotsSelected.length > 0 && this.isCompleteSigners(activity.signers)) {
        const activityObject = await Activity.findById(activity._id)
        const dateLast = activityObject.signers.pop()._id.getTimestamp()
        dates.push(dateLast)
      }
    }

    return dates.filter((date) => date)
  }

  private static async getDateLastSigned(activities, lot) {
    let dates = []
    for (const activity of activities) {
      for (const achievement of activity.achievements) {
        const lotsSelected = achievement.lots.filter(
          (lotSelected) => lotSelected?._id.toString() === lot?._id.toString()
        )

        if (
          lotsSelected.length > 0 &&
          this.isCompleteSigners(achievement.signers)
        ) {
          const achievementsObject = await Achievement.findById(achievement._id)
          const dateLast =
            achievementsObject.signers.pop()?.dateSigned ||
            achievementsObject.signers.pop()?._id.getTimestamp()
          dates.push(dateLast)
        }
      }
    }

    return dates.filter((date) => date)
  }

  private static getDateLastAchievement(activities, lot): any {
    let dates = []
    for (const activity of activities) {
      for (const achievement of activity.achievements) {
        const lotsSelected = achievement.lots.filter(
          (lotSelected) => lotSelected._id.toString() === lot._id.toString()
        )

        if (lotsSelected.length > 0) {
          dates.push(lotsSelected.pop()._id.getTimestamp())
        }
      }
    }

    return dates
  }

  private static sumSurfaceAchievements(activities): number {
    let total: number = 0

    for (const activity of activities) {
      for (const achievement of activity.achievements) {
        total += achievement.surface
      }
    }

    return total
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
              ${process.env.BASE_URL}/v1/files/downloads/sings/${approvalRegister.filePdf._id}
              ${process.env.BASE_URL}/v1/files/downloads/sings/${approvalRegister.fileOts._id}
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

  private static sumSurfacePlannedActivity(activities, lot): number {
    const lots = activities
      .map((activity) => {
        return activity.lots.find(
          (lotMade) => lotMade._id.toString() === lot._id.toString()
        )
      })
      .filter((lot) => lot)

    return lots.reduce((a, b) => a + (b['surface'] || 0), 0)
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

          if (lotSelected) return activity.surface
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
          total += achievement.surface
        }
      }
    }

    return total
  }

  private static getSurfaceFileApproved(activities) {
    let total = 0
    for (const activity of activities) {
      for (const achievement of activity.achievements) {
        if (achievement.files.length > 0) {
          total += achievement.surface
        }
      }
    }

    return total
  }

  private static getActivitiesAchievementByType(crop, type, status) {
    return crop[status].length > 0
      ? crop[status].filter((activity) => activity.type.tag === type)
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

  public static async generateReportsSowingBilling(crops) {
    const reports = crops.map((crop) => {
      const reportByCrop = crop.lots.map(async (item) => {
        const reportByLot = item.data.map(async (lot) => {
          this.getDateLastAchievement(
            crop.done.filter((activity) => activity.type.tag === 'ACT_SOWING'),
            lot
          )
          return {
            cuit: crop.company?.identifier,
            business_name: (await this.getCompany(crop.company?.identifier))
              .name,
            crop: crop.cropType.name.es,
            crop_name: crop.name,
            responsible: this.getMembersWithRol(crop),
            surface_total: lot.surface,
            total_surface_signed_sowing: this.sumSurfaceSigners(
              crop,
              'ACT_SOWING'
            ),
            date_sign_achievement_by_lot_sowing: await this.lastDateSignAchievementByLot(
              crop,
              lot,
              'ACT_SOWING'
            )
          }
        })

        return Promise.all(reportByLot)
      })

      return Promise.all(reportByCrop)
    })

    return _.flatten(_.flatten(await Promise.all(reports)))
  }

  private static getMembersWithRol(crop) {
    let membersNames = ''
    const members = crop.members.filter((member) =>
      rolesAdvisorPromoter.includes(member.type)
    )

    for (const member of members) {
      membersNames += `${member.identifier} Asesor promotor,`
    }

    return membersNames
  }

}

export default ReportService
