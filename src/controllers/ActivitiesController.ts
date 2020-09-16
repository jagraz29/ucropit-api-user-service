import { Request, Response } from 'express'
import {
  validateActivityStore,
  validateActivityUpdate
} from '../utils/Validation'

import ActivityService from '../services/ActivityService'
import models from '../models'

import _ from 'lodash'

import { getPathFileByType, getFullPath } from '../utils/Files'

const Activity = models.Activity
const FileDocument = models.FileDocument

import { UserSchema } from '../models/user'

class ActivitiesController {
  /**
   *
   * Get all activities and filter by cropId.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async index (req: Request, res: Response) {
    const { crop } = req.query
    const filter = crop ? { crop } : {}

    const activities = await Activity.find(filter)
      .populate('type')
      .populate('typeAgreement')
      .populate('crop')
      .populate('lots')
      .populate('files')

    res.status(200).json(activities)
  }

  /**
   * Show one activity
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async show (req: Request, res: Response) {
    const activity = await Activity.findById(req.params.id)
      .populate('type')
      .populate('typeAgreement')
      .populate('crop')
      .populate('lots')
      .populate('files')

    res.status(200).json(activity)
  }

  /**
   * Store one activity.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async store (req: Request, res: Response) {
    const user: UserSchema = req.user
    const data = JSON.parse(req.body.data)
    await validateActivityStore(data)

    let activity = await ActivityService.store(data)

    if (req.files) {
      activity = await ActivityService.addFiles(activity, req.files, user)
    }

    res.status(201).json(activity)
  }

  /**
   * Update one activity.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async update (req: Request, res: Response) {
    const user: UserSchema = req.user
    const { id } = req.params
    const data = JSON.parse(req.body.data)
    await validateActivityUpdate(data)

    let activity = await ActivityService.update(id, data)

    if (req.files) {
      activity = await ActivityService.addFiles(activity, req.files, user)
    }

    res.status(201).json(activity)
  }

  /**
   * Delete one activity.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async delete (req: Request, res: Response) {
    const activity = await Activity.findByIdAndDelete(req.params.id)

    res.status(200).json({
      message: 'deleted successfully'
    })
  }

  /**
   * Delete File to company.
   *
   * @param Request req
   * @param Response res
   *
   * @return {Response}
   */
  public async removeFile (req: Request, res: Response) {
    const { id, fileId } = req.params

    const activity = await Activity.findOne({ _id: id })
    const document = await FileDocument.findOne({ _id: fileId })

    const fileRemove = await ActivityService.removeFiles(
      fileId,
      activity,
      `${getFullPath(getPathFileByType('activity'))}/${_.kebabCase(
        activity.name
      )}/${document.nameFile}`
    )

    if (!fileRemove) {
      return res
        .status(404)
        .json({ error: true, message: 'Not Found File to delete' })
    }

    res.status(200).json({
      message: 'deleted file successfully'
    })
  }
}

export default new ActivitiesController()
