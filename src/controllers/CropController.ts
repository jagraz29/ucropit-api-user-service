import { Request, Response } from 'express'
import models from '../models'
import _ from 'lodash'
import CropService from '../services/CropService'

import { validateCropStore } from '../utils/Validation'

const Crop = models.Crop

class CropController {
  /**
   *
   * Get all crops.
   *
   * @param  Request req
   * @param  Response res
   *
   * @return Response
   */
  public async index (req: Request, res: Response) {
    const crops = await Crop.find({}).populate('lots')

    res.status(200).json(crops)
  }

  /**
   * Get one crop.
   *
   * @param  Request req
   * @param  Response res
   *
   * @return Response
   */
  public async show (req: Request, res: Response) {
    const crop = await Crop.findById(req.params.id).populate('lots')

    res.status(200).json(crop)
  }

  /**
   * Create a crop
   *
   * @param  Request req
   * @param  Response res
   *
   * @return Response
   */
  public async create (req: Request, res: Response) {
    await validateCropStore(req.body)

    let crop = await CropService.store(req.body)

    res.status(201).json(crop)
  }

  /**
   * Update a crop
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async update (req: Request, res: Response) {
    await Crop.findByIdAndUpdate(req.params.id, req.body)
    const crop = await Crop.findById(req.params.id)

    res.status(200).json(crop)
  }

  /**
   * Delete one crop.
   *
   * @param  Request req
   * @param  Response res
   *
   * @return Response
   */
  public async delete (req: Request, res: Response) {
    const crop = await Crop.findByIdAndDelete(req.params.id)

    res.status(200).json({
      message: 'deleted successfully'
    })
  }
}

export default new CropController()
