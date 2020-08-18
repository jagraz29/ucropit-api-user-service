import Lot from '../models/lot'
import _ from 'lodash'
import * as geolib from 'geolib'

interface ILot {
  name: String
  area: Array<any>
  surface: Number
  tag: String
}

class LotService {
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

      const asyncLot = this.store(lot)

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
    return _.flatten(coordinates)
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
  public static async store (lot: ILot) {
    return Lot.create(lot)
  }
}

export default LotService
