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
   * Get all lots.
   *
   * @param req
   * @param res
   *
   * @return Response
   */
  public async index (req: Request, res: Response) {
    const lots = await Lot.find({})

    res.status(200).json(lots)
  }

  /**
   * Get one lot by id.
   *
   * @param req
   * @param res
   *
   * @return Response
   */
  public async show (req: Request, res: Response) {
    const lot = await Lot.findById(req.params.id)

    res.status(200).json(lot)
  }
  /**
   * Store Lot.
   *
   * @param req
   * @param res
   *
   * @return Response
   */
  public async create (req: Request, res: Response) {
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
   * Update lot.
   *
   * @param req
   * @param res
   */
  public async update (req: Request, res: Response) {
    await Lot.findByIdAndUpdate(req.params.id, req.body)
    const lot = await Lot.findById(req.params.id)

    res.status(200).json(lot)
  }
  /**
   * Get List names and areas to Lots. Given Kmz/Kml file.
   *
   * @param req
   * @param res
   *
   * @return Response
   */
  public async surfaces (req: Request, res: Response) {
    const result = await handleFileConvertJSON(req.files)

    const listNamesLots = mapArraySurfacesAndArea(result)

    res.status(200).json(listNamesLots)
  }

  /**
   * Delete lot
   *
   * @param req
   * @param res
   *
   * @return Response
   */
  public async delete (req: Request, res: Response) {
    const lot = await Lot.findByIdAndDelete(req.params.id)

    res.status(200).json({
      message: 'deleted successfully'
    })
  }
}

export default new LotController()
