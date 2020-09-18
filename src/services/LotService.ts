import { Request } from 'express'
import Lot from '../models/lot'
import flatten from 'lodash/flatten'
import * as geolib from 'geolib'

import { handleFileConvertJSON } from '../utils/ParseKmzFile'

interface ILot {
  name: String
  area: Array<any>
  surface: Number
  tag: String
}

class LotService {
  public static async store (req: Request, { names, tag }) {
    const jsonParserKmz = await handleFileConvertJSON(req.files)

    const filteringItem = jsonParserKmz.features.filter((item) => {
      return (
        names.filter((select) => select === item.properties.name).length > 0
      )
    })

    const lots = await LotService.storeLots(filteringItem, tag)

    return lots
  }
  /**
   * To create a Lots when given items filter to Kmz/Kml file and lots are selected.
   *
   * @param itemsFilter
   */
  public static async storeLots (itemsFilter: Array<any>, tag: String) {
    let toStored: Array<any> = []
    let index = 0

    for (const element of itemsFilter) {
      const lot: ILot = {
        name: element.properties.name,
        area: this.getArrayAreas(element.geometry.coordinates),
        surface: Number(this.getSurface(element.geometry.coordinates)),
        tag: tag
      }

      const asyncLot = this.create(lot)

      toStored.push(asyncLot)

      index++
    }

    return Promise.all(toStored)
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
   *
   * @param lot
   */
  public static async create (lot: ILot) {
    return Lot.create(lot)
  }
}

export default LotService
