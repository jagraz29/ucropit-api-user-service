import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { BadgeRepository } from '../repositories'
import { errors } from '../types/common'
import { parseLangLocal } from '../utils/Locales'

class BadgesController {
  /**
   *
   * Get all badges.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async index(req: Request | any, res: Response) {
    const dataToFind: any = {
      query: {},
      populate: [],
      limit: 0,
      skip: 0,
      sort: {}
    }

    const results = await BadgeRepository.getBadges(dataToFind)
    const badgesTypes = req.__('badges.types') as unknown as object
    const badges = results.map((badge) => {
      const altLabel = badge.name?.es || badge.type
      return {
        ...badge,
        label: parseLangLocal(badgesTypes, badge.type, altLabel)
      }
    })

    res.status(StatusCodes.OK).json(badges)
  }

  /**
   *
   * Create badge.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async create(req: Request | any, res: Response) {
    const { type, nameEs, nameEn, namePt, goalReach, image } = req.body

    const dataToFind: any = {
      query: {
        type
      }
    }

    const badges = await BadgeRepository.getBadges(dataToFind)

    if (badges.length) {
      return res.status(StatusCodes.CONFLICT).json({
        error: ReasonPhrases.CONFLICT,
        description: errors.find((error) => error.key === '006').code
      })
    }

    const dataToCreate: any = {
      type,
      name: {
        es: nameEs,
        en: nameEn,
        pt: namePt
      },
      goalReach,
      image
    }

    const badge = await BadgeRepository.createBadge(dataToCreate)

    res.status(StatusCodes.OK).json(badge)
  }

  /**
   *
   * Update badge.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async update(req: Request | any, res: Response) {
    const { badgeId } = req.params

    const { type, nameEs, nameEn, namePt, goalReach, image } = req.body

    const dataToFind: any = {
      query: {
        _id: badgeId
      }
    }

    const badges = await BadgeRepository.getBadges(dataToFind)

    if (!badges.length) {
      return res.status(StatusCodes.CONFLICT).json({
        error: ReasonPhrases.CONFLICT,
        description: errors.find((error) => error.key === '007').code
      })
    }

    const query: any = {
      _id: badgeId
    }

    const dataToUpdate: any = {
      type: type !== undefined ? type : badges[0].type,
      name: {
        es: nameEs !== undefined ? nameEs : badges[0].name.es,
        en: nameEn !== undefined ? nameEn : badges[0].name.en,
        pt: namePt !== undefined ? namePt : badges[0].name.pt
      },
      goalReach: goalReach !== undefined ? goalReach : badges[0].goalReach,
      image: image !== undefined ? image : badges[0].image
    }

    const badge = await BadgeRepository.updateOneBadge(query, dataToUpdate)

    res.status(StatusCodes.OK).json(badge)
  }

  /**
   *
   * Delete badge.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async delete(req: Request | any, res: Response) {
    const { badgeId } = req.params

    const dataToFind: any = {
      query: {
        _id: badgeId
      }
    }

    const badges = await BadgeRepository.getBadges(dataToFind)

    if (!badges.length) {
      return res.status(StatusCodes.CONFLICT).json({
        error: ReasonPhrases.CONFLICT,
        description: errors.find((error) => error.key === '007').code
      })
    }

    const dataToDelete: any = {
      _id: badgeId
    }

    const badge = await BadgeRepository.deleteOneBadge(dataToDelete)

    res.status(StatusCodes.OK).json(badge)
  }
}

export default new BadgesController()
