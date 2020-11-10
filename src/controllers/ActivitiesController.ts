import { Request, Response } from 'express'
import {
  validateActivityStore,
  validateActivityUpdate,
  validateFilesWithEvidences
} from '../utils/Validation'

import ActivityService from '../services/ActivityService'
import CropService from '../services/CropService'
import BlockChainServices from '../services/BlockChainService'
import ApprovalRegisterSingService from '../services/ApprovalRegisterSignService'
import models from '../models'

import { getPathFileByType, getFullPath } from '../utils/Files'

const Activity = models.Activity
const FileDocument = models.FileDocument
const Crop = models.Crop

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
    const activities = await Activity.find()
      .populate('type')
      .populate('typeAgreement')
      .populate({
        path: 'crop',
        populate: [
          { path: 'cropType' },
          { path: 'unitType' },
          { path: 'company' },
          { path: 'owner' }
        ]
      })
      .populate('lots')
      .populate('files')
      .populate('user')

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
    const activity = await ActivityService.findActivityById(req.params.id)

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
  public async create (req: Request, res: Response) {
    const user: UserSchema = req.user
    const data = JSON.parse(req.body.data)

    await validateActivityStore(data)

    const validationFiles = validateFilesWithEvidences(
      req.files,
      data.evidences
    )

    if (validationFiles.error) {
      res.status(400).json(validationFiles)
    }

    let activity = await ActivityService.store(data, user)

    if (req.files) {
      activity = await ActivityService.addFiles(
        activity,
        data.evidences,
        req.files,
        user,
        `activities/${activity.key}`
      )
    }

    const crop = await Crop.findById(data.crop)

    await CropService.addActivities(activity, crop)

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
    const { id } = req.params
    const user: UserSchema = req.user
    const data = JSON.parse(req.body.data)
    const { status } = data
    await validateActivityUpdate(data)
    const validationFiles = validateFilesWithEvidences(
      req.files,
      data.evidences
    )

    if (validationFiles.error) {
      res.status(400).json(validationFiles)
    }
    let activity = await ActivityService.findActivityById(id)
    if (data.signers) {
      const listSigners = ActivityService.getSigners(data.signers, activity)

      data.signers = listSigners
    }

    activity = await ActivityService.update(id, data)

    if (req.files) {
      activity = await ActivityService.addFiles(
        activity,
        data.evidences,
        req.files,
        user,
        `activities/${activity.key}`
      )
    }

    if (status) {
      const crop = await Crop.findById(data.crop)
      activity = await ActivityService.findActivityById(id)

      const statusCropRemove =
        activity.type.name.en === 'Agreements' ? 'pending' : 'toMake'

      await CropService.removeActivities(activity, crop, statusCropRemove)
      await CropService.addActivities(activity, crop)
    }

    res.status(200).json(activity)
  }

  /**
   * Sign Activity
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async sign (req: Request, res: Response) {
    const { id, cropId } = req.params
    const user: UserSchema = req.user

    let activity = await Activity.findById(id)
      .populate('type')
      .populate('typeAgreement')
      .populate('lots')
      .populate('files')

    const crop = await CropService.getCropById(cropId)

    const { ots, hash, path, nameFile } = await BlockChainServices.sign(
      crop,
      activity,
      user
    )

    const approvalRegisterSign = await ApprovalRegisterSingService.create({
      ots,
      hash,
      path,
      nameFile,
      user
    })

    activity = await ActivityService.signUserAndUpdateSing(
      activity,
      user,
      approvalRegisterSign
    )

    const isCompleteSigned = await ActivityService.isCompleteSingers(activity)

    if (isCompleteSigned) {
      const crop = await Crop.findById(cropId)
      await ActivityService.changeStatus(activity, 'FINISHED')
      await CropService.removeActivities(activity, crop, 'done')
      await CropService.addActivities(activity, crop)
    }

    res.status(200).json(activity)
  }

  /**
   * Validate Activity.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async validate (req: Request, res: Response) {
    const { id, cropId } = req.params
    const { status } = req.body

    let activity = await Activity.findById(id).populate('type')

    await ActivityService.changeStatus(activity, status)

    const crop = await Crop.findById(cropId)

    const statusCrop =
      activity.type.name.en === 'Agreements' ? 'pending' : 'toMake'

    await CropService.removeActivities(activity, crop, statusCrop)
    await CropService.addActivities(activity, crop)

    activity = await Activity.findById(id)

    res.status(200).json(activity)
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
      `${getFullPath(getPathFileByType('activity'))}/${activity.key}/${
        document.nameFile
      }`
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
