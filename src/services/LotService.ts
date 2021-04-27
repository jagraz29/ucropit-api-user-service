import { Request } from 'express'
import fs from 'fs'
import Lot from '../models/lot'
import flatten from 'lodash/flatten'
import * as geolib from 'geolib'
import _ from 'lodash'
import axios from 'axios'

import { handleFileConvertJSON } from '../utils/ParseKmzFile'

interface ILot {
  name: String
  area: Array<any>
  surface: Number
  tag?: String
}

class LotService {
  public static async store (req: Request, lotsNames) {

    const jsonParserKmz = await handleFileConvertJSON(req.files)

    const filterLots = lotsNames.map(itemName => {
      return jsonParserKmz.map(item => {
        const lotsFilter = item.features.filter((item) => {
          return (
                itemName.names.filter((select) => select === item.properties.name).length > 0
          )
        })

        if (lotsFilter.length > 0) {
          return { lotsFilter, tag: itemName.tag }
        }

        return undefined

      }).filter(kmzLotItem => kmzLotItem)
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
  public static async storeLots (itemsFilter: Array<any>) {
    let toStored: Array<any> = []
    let toCrop = []

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

      toCrop.push({
        lots: await Promise.all(toStored),
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
  public static getArrayAreas (coordinates) {
    return flatten(coordinates)
  }

  /**
   * Get area square.
   *
   * @param arrayAreas
   */
  public static getNumberAreaSquare (arrayAreas) {
    return geolib.getAreaOfPolygon(arrayAreas)
  }

  /**
   * Get Surfaces.
   *
   * @param coordinates
   */
  private static getSurface (coordinates) {
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
  private static getArrayLotsGroupTag (list): Array<any> {
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
        const index = LotArrayFilter.findIndex(x => x.tag === lotItem.tag)
        LotArrayFilter[index].lots.push(this.getArrayLotData(lotItem.lotsFilter))
      }
    }

    return LotArrayFilter
  }

  private static getArrayLotData (lotFilter) {
    return Array.isArray(lotFilter) ? lotFilter : [lotFilter]
  }

  /**
   *
   * @param lot
   */
  public static async create (lot: ILot) {
    return Lot.create(lot)
  }

  /**
   * To store lot sattelital image and country, province and city.
   *
   * @param companies
   *
   * @returns Array
   */
  public static async storeLotImagesAndCountries (companies: Array<any>) {
    let staticUrl =
    'https://maps.googleapis.com/maps/api/staticmap?center=:latitude,:longitude&zoom=14&size=250x250&maptype=satellite&path=:path&key='

    const newCompanies: any = await Promise.all(companies.map(async (lots) => {
      let newLots:any = {
        ...lots,
      }

      newLots.data = await Promise.all(lots.data.map(async (lot, index) => {

        if(lot.image?.normal) return lot

        let newLot: any = {}

        let centroid: any = geolib.getCenter(lot.area.map((element) => {
          return {
            latitude: element[1],
            longitude: element[0],
          }
        }))

        const url: string = process.env.GOOGLE_API_GEOCODING + '?latlng=' + centroid.latitude + ',' + centroid.longitude + '&sensor=true&key=' + process.env.GOOGLE_API_KEY

        const axiosReverseGeocodingConfig: any = {
          method: 'GET',
          url: url
        }

        let responseReverseGeocoding: any = await axios(axiosReverseGeocodingConfig)

        let country: string = ''
        let province: string = ''
        let city: string = ''

        responseReverseGeocoding.data.results[0].address_components.map(
          (addressComponent) => {
            if (addressComponent.types.indexOf('country') !== -1) {
              country = addressComponent.long_name
            }

            if (
              addressComponent.types.indexOf(
                'administrative_area_level_1'
              ) !== -1
            ) {
              province = addressComponent.long_name
            }

            if(addressComponent.types.indexOf(
              'locality'
            ) !== -1){
              city = addressComponent.long_name
            }else if (
              addressComponent.types.indexOf(
                'administrative_area_level_2'
              ) !== -1
            ) {
              city = addressComponent.long_name
            }
          }
        )

        let path: string = 'color:0xff0000ff|weight:8'

        lot.area.map((element) => {
          path = path + '|' + element[1] + ',' + element[0]
        })

        const staticImageUrl: string =
          staticUrl
            .replace(':latitude', centroid.latitude)
            .replace(':longitude', centroid.longitude)
            .replace(':path', path) +
          process.env.GOOGLE_API_KEY

        if (!fs.existsSync('public/uploads/map-static')){
          fs.mkdirSync('public/uploads/map-static')
        }

        if (!fs.existsSync('public/uploads/map-static/' + lot._id)){
          fs.mkdirSync('public/uploads/map-static/' + lot._id)
        }

        const axiosStaticImageConfig: any = {
          method: 'GET',
          url: staticImageUrl,
          responseType: 'stream'
        }

        let responseStaticImage: any = await axios(axiosStaticImageConfig)

        let imagePath = 'public/uploads/map-static/' + lot._id + '/normal.png'

        await new Promise((resolve: any) => {
          responseStaticImage.data.pipe(fs.createWriteStream(imagePath)).on('close', () => {
            resolve()
          })
        })

        const dataToUpdate: any = {
          countryName : country,
          provinceName : province,
          cityName : city,
          image : {
            normal : imagePath.replace('public', '')
          }
        }

        await Lot.updateOne({ _id: lot._id }, { $set: dataToUpdate })

        newLot = {
          ...lot,
          countryName: country,
          provinceName: province,
          cityName: city,
          image: {
            normal : imagePath.replace('public', '')
          }
        }

        return newLot

      }))

      return newLots

    }))

    console.log('********************')
    console.log('END 1')

    return newCompanies
  }
}

export default LotService
