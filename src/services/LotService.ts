import { Request } from 'express'
import Lot from '../models/lot'
import flatten from 'lodash/flatten'
import * as geolib from 'geolib'
import _ from 'lodash'

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
}

export default LotService
