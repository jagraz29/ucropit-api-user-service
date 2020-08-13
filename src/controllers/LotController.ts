import { Request, Response } from 'express'
import {
  handleFileConvertJSON,
  mapArraySurfacesAndArea
} from '../services/ParseKmzFile'

import models from '../models'
import LotService from '../services/LotService'

const Lot = models.Lot

class LotController {
  /**
   *
   * @param req
   * @param res
   */
  public async index (req: Request, res: Response) {
    const lots = await Lot.find({})

    res.status(200).json(lots)
  }
  /**
   * Store Lot.
   *
   * @param req
   * @param res
   */
  public async store (req: Request, res: Response) {
    const { selectedLots, tag } = req.body

    const jsonParserKmz = await handleFileConvertJSON(req.files)

    const filteringItem = jsonParserKmz.features.filter((item) => {
      return (
        selectedLots.filter((select) => select === item.properties.name)
          .length > 0
      )
    })

    const lots = await LotService.storeLots(filteringItem, tag)

    res.status(201).json(lots)
  }
  /**
   * Get List names and areas to Lots. Given Kmz/Kml file.
   *
   * @param req
   * @param res
   */
  public async surfaces (req: Request, res: Response) {
    const result = await handleFileConvertJSON(req.files)

    const listNamesLots = mapArraySurfacesAndArea(result)

    res.status(200).json(listNamesLots)
  }
}

export default new LotController()
