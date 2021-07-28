/* tslint:disable:await-promise */
import { Request, Response } from 'express'
import {
  handleFileConvertJSON,
  mapArraySurfacesAndArea
} from '../utils/ParseKmzFile'
import { validateFormatKmz } from '../utils/Validation'
import models from '../models'
import LotService from '../services/LotService'
import { StatusCodes } from 'http-status-codes'
import { CropRepository } from '../repositories'

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
  public async index(req: Request, res: Response) {
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

    console.log(lot)

    res.status(200).json({
      message: req.__('commons.deleted_success')
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
  public async searchByIdentifier(req: Request, res: Response) {
    const { identifier } = req.query
    const dateCrop = new Date(req.query.dateCrop.toString())

    const query = {
      identifier,
      // 'members.type': { $in: ['PRODUCER'] },
      $where: function () {
        return this.lots.length > 0
      }
    }

    req.setTimeout(0)
    const cropsList = await CropRepository.findCropsWithLotsPopulateData(query)
    const results = await LotService.parseLotByTagInCropsWithDataPopulate(
      cropsList,
      dateCrop
    )

    return res.status(StatusCodes.OK).json(results)
  }
}

export default new LotsController()
