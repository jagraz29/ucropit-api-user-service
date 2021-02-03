import { Request, Response } from 'express'
import models from '../models'
import CropService from '../services/CropService'
import CompanyService from '../services/CompanyService'
import LotService from '../services/LotService'
import ActivityService from '../services/ActivityService'

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
  public async index(req: Request | any, res: Response) {
    const query: any = {
      cancelled: false,
      'members.identifier': req.query.identifier,
      'members.user': req.user._id
    }

    const crops = await Crop.find(query)
      .populate('cropType')
      .populate('unitType')
      .populate('pending')
      .populate('toMake')
      .populate('done')
      .populate('members.user')
      .populate('finished')
      .lean()

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
  public async show(req: Request, res: Response) {
    const { id } = req.params
    const crop = await CropService.getCrop(id)

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
  public async create(req: Request | any, res: Response) {
    const user: UserSchema = req.user
    const data = JSON.parse(req.body.data)
    await validateCropStore(data)
    let company = null

    company = (await CompanyService.search({ identifier: data.identifier }))[0]

    const lots = await LotService.store(req, data.lots)

    const activities = await ActivityService.createDefault(
      data.surface,
      data.dateCrop,
      user
    )

    const crop = await CropService.handleDataCrop(
      data,
      company,
      lots,
      activities,
      { members: req.user }
    )

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
  public async update(req: Request, res: Response) {
    const user: UserSchema = req.user
    const data = JSON.parse(req.body.data)
    let company = null

    company = (await CompanyService.search({ identifier: data.identifier }))[0]

    const crop = await Crop.findById(req.params.id)

    crop.company = company ? company._id : null

    await crop.save()

    res.status(200).json(crop)
  }

  /**
   * Enable offline for crop
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async enableOffline(req: Request, res: Response) {
    const crop = await Crop.findById(req.params.id)

    crop.downloaded = req.body.downloaded

    await crop.save()

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
  public async delete(req: Request, res: Response) {
    const isCancelled = await CropService.cancelled(req.params.id)

    if (!isCancelled) {
      return res.status(400).json({
        error: true,
        message: 'deleted not allowd'
      })
    }

    res.status(200).json({
      message: 'deleted successfuly'
    })
  }
}

export default new CropsController()
