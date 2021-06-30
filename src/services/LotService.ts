import { Request } from 'express'
import fs from 'fs'
import Lot from '../models/lot'
import flatten from 'lodash/flatten'
import * as geolib from 'geolib'
import _ from 'lodash'
import axios from 'axios'
import moment from 'moment'

import ServiceBase from './common/ServiceBase'
import { handleFileConvertJSON } from '../utils/ParseKmzFile'
import GeoLocationService from '../services/GeoLocationService'
import StaticMapService from '../services/StaticMapService'
import { parseImageUrl, parseImageUrlDefault } from '../utils'

interface ILot {
  name: string
  area: Array<any>
  surface: number
  tag?: string
}

class LotService extends ServiceBase {
  public static async search(query) {
    const lots = await Lot.find(query)
    return lots
  }

  public static async count(query) {
    const count = await Lot.countDocuments(query)
    return count
  }

  public static async store(req: Request, lotsNames) {
    const jsonParserKmz = await handleFileConvertJSON(req.files)

    const filterLots = lotsNames.map((itemName) => {
      return jsonParserKmz
        .map((item) => {
          const lotsFilter = item.features.filter((item) => {
            return (
              itemName.names.filter((select) => select === item.properties.name)
                .length > 0
            )
          })

          if (lotsFilter.length > 0) {
            return { lotsFilter, tag: itemName.tag }
          }

          return undefined
        })
        .filter((kmzLotItem) => kmzLotItem)
    })

    const flattListLotFilter = this.getArrayLotsGroupTag(_.flatten(filterLots))

    const lots = await LotService.storeLots(flattListLotFilter)

    return lots
  }

  /**
   * To create a Lots when given items filter to Kmz/Kml file and lots are selected.
   *
   * @param itemsFilter
   */
  public static async storeLots(itemsFilter: Array<any>) {
    let toStored: Array<any> = []
    const toCrop = []

    for (const element of itemsFilter) {
      const lotFilter = _.flatten(element.lots)

      for (const lotItem of lotFilter) {
        const lot: ILot = {
          name: lotItem.properties.name,
          area: this.getArrayAreas(lotItem.geometry.coordinates),
          surface: Number(this.getSurface(lotItem.geometry.coordinates))
        }

        const asyncLot = this.create(lot)

        toStored.push(asyncLot)
      }

      const lots = await Promise.all(toStored)

      const newLots: any = await Promise.all(
        lots.map(async (lot, index) => {
          let newLot: any = {}

          const centroid: any = this.getCentroid(lot.area)

          const locationData: any = await this.getLocationData(
            centroid.latitude,
            centroid.longitude
          )

          const zoom = this.calculateZoomForStaticMap(centroid, lot.area)

          const staticMapImageUrl: string =
            StaticMapService.getStaticMapImageUrl({
              center: {
                latitude: centroid.latitude,
                longitude: centroid.longitude
              },
              maptype: 'satellite',
              zoom: zoom,
              size: '250x250',
              path: {
                fillcolor: '0xAA000033',
                color: '0xff0000ff',
                weight: 1,
                area: lot.area
              }
            })

          const imagePath: string | boolean = await this.downloadStaticMap(
            staticMapImageUrl,
            'public/uploads/map-static/' + lot._id,
            'normal.png'
          )

          const dataToUpdate: any = {
            countryName: locationData.country,
            provinceName: locationData.province,
            cityName: locationData.city,
            image: {
              normal: imagePath ? imagePath.replace('public', '') : ''
            }
          }

          await Lot.updateOne({ _id: lot._id }, { $set: dataToUpdate })

          newLot = {
            ...lot.toJSON(),
            countryName: locationData.country,
            provinceName: locationData.province,
            cityName: locationData.city,
            image: {
              normal: imagePath ? imagePath.replace('public', '') : ''
            }
          }

          return newLot
        })
      )

      toCrop.push({
        lots: newLots,
        tag: element.tag
      })
      toStored = []
    }

    return toCrop
  }

  /**
   * Get areas to polygon.
   *
   * @param coordinates
   */
  public static getArrayAreas(coordinates) {
    return flatten(coordinates)
  }

  /**
   * Get area square.
   *
   * @param arrayAreas
   */
  public static getNumberAreaSquare(arrayAreas) {
    return geolib.getAreaOfPolygon(arrayAreas)
  }

  /**
   * Get Surfaces.
   *
   * @param coordinates
   */
  private static getSurface(coordinates) {
    const arrayAreas = this.getArrayAreas(coordinates)

    const areaSquare = this.getNumberAreaSquare(arrayAreas)

    return geolib.convertArea(areaSquare, 'ha').toFixed(2)
  }

  /**
   * Group by tags  filter lots.
   *
   * @param list
   *
   * @returns Array
   */
  private static getArrayLotsGroupTag(list): Array<any> {
    const LotArrayFilter: Array<any> = []
    let tagIndex = null

    for (const lotItem of list) {
      if (lotItem.tag !== tagIndex) {
        LotArrayFilter.push({
          lots: this.getArrayLotData(lotItem.lotsFilter),
          tag: lotItem.tag
        })
        tagIndex = lotItem.tag
      } else {
        const index = LotArrayFilter.findIndex((x) => x.tag === lotItem.tag)
        LotArrayFilter[index].lots.push(
          this.getArrayLotData(lotItem.lotsFilter)
        )
      }
    }

    return LotArrayFilter
  }

  private static getArrayLotData(lotFilter) {
    return Array.isArray(lotFilter) ? lotFilter : [lotFilter]
  }

  /**
   * Get Centroid.
   *
   * @param area
   */
  public static getCentroid(area) {
    return geolib.getCenter(
      area.map((element) => {
        return {
          latitude: element[1],
          longitude: element[0]
        }
      })
    )
  }

  /**
   * Calculate zoom for static map image.
   *
   * @param centroid
   * @param area
   */
  private static calculateZoomForStaticMap(centroid, area) {
    let maxDistance = 0

    area.map((element) => {
      const elementCoords: any = {
        latitude: element[1],
        longitude: element[0]
      }

      const distance = geolib.getDistance(centroid, elementCoords)

      if (distance > maxDistance) {
        maxDistance = distance
      }
    })

    let zoom = 12

    if (maxDistance <= 200) {
      zoom = 16
    } else if (maxDistance <= 400) {
      zoom = 15
    } else if (maxDistance <= 1000) {
      zoom = 14
    } else if (maxDistance <= 2000) {
      zoom = 13
    }

    return zoom
  }

  /**
   * Get Location data with google api.
   *
   * @param latitude
   * @param longitude
   */
  public static async getLocationData(latitude, longitude) {
    const responseReverseGeocoding: any =
      await GeoLocationService.getLocationByCoordinates(latitude, longitude)

    const locationData: any = {
      country: '',
      province: '',
      city: ''
    }

    responseReverseGeocoding[0].address_components.map((addressComponent) => {
      if (addressComponent.types.indexOf('country') !== -1) {
        locationData.country = addressComponent.long_name
      }

      if (
        addressComponent.types.indexOf('administrative_area_level_1') !== -1
      ) {
        locationData.province = addressComponent.long_name
      }

      if (addressComponent.types.indexOf('locality') !== -1) {
        locationData.city = addressComponent.long_name
      } else if (
        addressComponent.types.indexOf('administrative_area_level_2') !== -1
      ) {
        locationData.city = addressComponent.long_name
      }
    })

    return locationData
  }

  /**
   * Download static map image.
   *
   * @param url
   * @param path
   * @param fileName
   */
  private static async downloadStaticMap(url, path, fileName) {
    if (!fs.existsSync('public/uploads/map-static')) {
      fs.mkdirSync('public/uploads/map-static')
    }

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }

    /*
    const responseStaticImage = await new Promise((resolve, reject) => {
      this.makeRequest('get', url, { responseType: 'stream' },
        (result) => resolve(result.data.results),
        (error) => reject(error)
      )
    })
    */

    // NEED TO DO THIS BECAUSE THE REQUEST SERVICE NOT RECEIVE CONFIG PARAMS, WE NEED TO ADD responseType PARAM

    const axiosStaticImageConfig: any = {
      method: 'GET',
      url: url,
      responseType: 'stream'
    }

    let responseStaticImage: any

    try {
      responseStaticImage = await axios(axiosStaticImageConfig)
    } catch (error) {
      console.log('ERROR GET SATELITE IMAGE')
      console.log(error.toString())
      return null
    }

    const imagePath = path + '/' + fileName

    await new Promise((resolve: any) => {
      responseStaticImage.data
        .pipe(fs.createWriteStream(imagePath))
        .on('close', () => {
          resolve()
        })
    })

    return imagePath
  }

  /**
   *
   * @param lot
   */
  public static async create(lot: ILot) {
    return Lot.create(lot)
  }

  /**
   * To store lot sattelital image and country, province and city.
   *
   * @param lots
   *
   * @returns Array
   */
  public static async storeLotImagesAndCountriesWithPopulate(lots: Array<any>) {
    const newLots: any = await Promise.all(
      lots.map(async (currentLot) => {
        const newLot: any = {
          ...currentLot
        }

        newLot.data = await Promise.all(
          currentLot.data.map(async (lotInData, index) => {
            const {
              countryName = '',
              provinceName = '',
              cityName = ''
            } = lotInData

            lotInData = {
              ...lotInData,
              imageUrl: lotInData.imageUrl
                ? lotInData.imageUrl
                : parseImageUrlDefault('lot_placeholder.png'),
              provinceName,
              countryName,
              cityName
            }
            return lotInData
          })
        )

        return newLot
      })
    )

    return newLots
  }

  public static async findImagesGeographics(lot, centroid) {
    const zoom = this.calculateZoomForStaticMap(centroid, lot.area)

    const staticMapImageUrl: string = StaticMapService.getStaticMapImageUrl({
      center: {
        latitude: centroid.latitude,
        longitude: centroid.longitude
      },
      maptype: 'satellite',
      zoom: zoom,
      size: '250x250',
      path: {
        fillcolor: '0xAA000033',
        color: '0xff0000ff',
        weight: 1,
        area: lot.area
      }
    })

    const imagePath: string = await this.downloadStaticMap(
      staticMapImageUrl,
      'public/uploads/map-static/' + lot._id,
      'normal.png'
    )

    if (!imagePath) return null

    const image = {
      normal: imagePath ? imagePath.replace('public', '') : ''
    }

    return image
  }

  private static updateLotWithImagesAndCountries(lot) {
    const { countryName, provinceName, cityName, image } = lot
    const dataToUpdate: any = {
      countryName,
      provinceName,
      cityName,
      image
    }

    Lot.updateOne({ _id: lot._id }, { $set: dataToUpdate }).exec()
  }

  public static omitFieldsInLot(lot, fields) {
    return _.omit(lot, fields)
  }

  public static async parseLotByTagInCropsWithDataPopulate(
    cropsList,
    currentDateCrop
  ) {
    const omitFields = [
      'status',
      'area',
      'coordinates',
      'coordinateForGoogle',
      'centerBound',
      'centerBoundGoogle',
      '__v',
      'id'
    ]
    const tagsArray = []
    let lotsNotAvailable = []

    const cropsListFuture = cropsList.filter((crop) =>
      moment(currentDateCrop).isBefore(crop.dateHarvest)
    )

    for (const crop of cropsListFuture) {
      for (const lot of crop.lots) {
        const lostInData = flatten(_.map(lot.data, '_id')).map((id) =>
          id.toString()
        )
        lotsNotAvailable = [...lotsNotAvailable, ...lostInData]
      }
    }

    for (const crop of cropsList) {
      const { dateCrop, dateHarvest } = crop
      const lotList = await this.storeLotImagesAndCountriesWithPopulate(
        crop.toJSON().lots
      )
      const lotsInData = _.flatten(_.map(lotList, 'data'))
      const disabled = moment(currentDateCrop).isBefore(dateHarvest)
      const tagId = lotList[0]._id
      const tagName = lotList[0].tag.trim()
      const index = tagsArray.findIndex((x) => x.tag === tagName)
      if (index !== -1) {
        for (const lot of lotsInData) {
          const lotForTag = Object.assign(_.omit(lot, omitFields), {
            disabled,
            dateCrop,
            dateHarvest
          })
          const indexLot = tagsArray[index].lots.findIndex(
            (l) => l._id.toString() === lot._id.toString()
          )
          if (indexLot !== -1) {
            tagsArray[index].lots[indexLot] = lotForTag
          } else {
            tagsArray[index].lots.push(lotForTag)
          }
        }
        tagsArray[index].totalSurface = _.sumBy(
          tagsArray[index].lots,
          'surface'
        )
        tagsArray[index].disabled = _.every(tagsArray[index].lots, 'disabled')
      } else {
        const lots = lotsInData.map((lot) =>
          Object.assign(_.omit(lot, omitFields), {
            disabled,
            dateCrop,
            dateHarvest
          })
        )
        tagsArray.push({
          _id: tagId,
          tag: tagName,
          totalSurface: _.sumBy(lots, 'surface'),
          disabled: _.every(lots, 'disabled'),
          lots
        })
      }
    }
    return tagsArray
  }
}

export default LotService
