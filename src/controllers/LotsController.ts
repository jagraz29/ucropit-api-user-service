import { Request, Response } from 'express'
import {flatten, map} from 'lodash'
import {
  handleFileConvertJSON,
  mapArraySurfacesAndArea
} from '../utils/ParseKmzFile'
import { validateFormatKmz } from '../utils/Validation'
import models from '../models'
import LotService from '../services/LotService'
import moment from 'moment';
import CropService from '../services/CropService'
import {ErrorResponseInstance} from '../utils'
import ErrorResponse from '../utils/ErrorResponse'

const Lot = models.Lot

class LotsController {
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
  public async show(req: Request, res: Response) {
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
  public async create(req: Request, res: Response) {
    const { names, tag } = req.body

    const lots = await LotService.store(req, { names, tag })

    res.status(201).json(lots)
  }

  /**
   * Update lot.
   *
   * @param req
   * @param res
   */
  public async update(req: Request, res: Response) {
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
  public async surfaces(req: Request, res: Response) {
    const validationKmz = await validateFormatKmz(req.files)
    if (validationKmz.error) {
      return res.status(400).json(validationKmz.code)
    }
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
  public async delete(req: Request, res: Response) {
    const lot = await Lot.findByIdAndDelete(req.params.id)

    res.status(200).json({
      message: 'deleted successfully'
    })
  }

  /**
   * Get all lots.
   *
   * @param req
   * @param res
   *
   * @return Response
   */
  public async searchByIdentifier (req: Request, res: Response) {

    const { identifier, dateCrop, dateHarvest } = req.query

    let query = {
      identifier
    }

    // @ts-ignore
    if (dateCrop && moment.invalid(dateCrop)) {
      // @ts-ignore
      query['dateCrop'] = { $gte: new Date(dateCrop) }
    }

    // @ts-ignore
    if (dateHarvest && moment.invalid(dateHarvest)) {
      // @ts-ignore
      query['dateCrop'] = { $lte: new Date(dateHarvest) }
    }

    const cropsList = await CropService.findCropsWithLotsSample(query)

    if (cropsList.length === 0) {
      return res.status(ErrorResponseInstance.parseStatusCode(404)).json(ErrorResponseInstance.parseError(ErrorResponse.DATA_NOT_FOUND, 'No tiene cultivos asociados'))
    }

    const lotsInCrops = flatten(map(cropsList, 'lots'))
    const lotsInCropsIds = flatten(map(lotsInCrops, 'data'))
    // @ts-ignore
    query = {}
    query['_id'] = { $in: lotsInCropsIds }

    let results = []
    const lotsList: any[] = await LotService.search(query)

    if (lotsList.length > 0) results = LotService.parseLotWithTag(lotsList, lotsInCrops)

    res.json({
      results
    })
  }

}

export default new LotsController()
