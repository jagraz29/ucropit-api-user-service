import { Request, Response } from 'express'
import models from '../models'
import _ from 'lodash'
import CropService from '../services/CropService'
import CompanyService from '../services/CompanyService'
import LotService from '../services/LotService'
import UserService from '../services/UserService'

import { validateCropStore } from '../utils/Validation'

import { UserSchema } from '../models/user'

const Crop = models.Crop

class CropsController {
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
    const crops = await Crop.find({})
      .populate('lots')
      .populate('cropType')
      .populate('unitType')
      .populate('company')

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
    const crop = await Crop.findById(req.params.id)
      .populate('lots')
      .populate('cropType')
      .populate('unitType')
      .populate('company')

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
    const user: UserSchema = req.user
    const data = JSON.parse(req.body.data)
    await validateCropStore(data)

    const company = await CompanyService.store(data.company)

    await UserService.update(
      { email: user.email },
      {
        companies: [company._id]
      }
    )

    const lots = await LotService.store(req, {
      names: data.lots.names,
      tag: data.lots.tag
    })

    const crop = await CropService.handleDataCrop(data, company, lots, user)

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

export default new CropsController()
