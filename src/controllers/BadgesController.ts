import { Request, Response } from 'express'
import { BadgeRepository } from '../repositories'
import { errors } from '../types/common'

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
    }

    const badges = await BadgeRepository.getBadges(dataToFind)

    res.status(200).json(badges)
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
    const {
      type,
      nameEs,
      nameEn,
      namePt,
      goalReach,
      image,
    } = req.body

    const dataToFind: any = {
      query: {
        type,
      }
    }

    const badges = await BadgeRepository.getBadges(dataToFind)

    if(badges.length){
      return res.status(404).json(errors.find((error) => error.key === '006').code)
    }

    const dataToCreate: any = {
      type,
      name: {
        es: nameEs,
        en: nameEn,
        pt: namePt,
      },
      goalReach,
      image,
    }

    const badge = await BadgeRepository.createBadge(dataToCreate)

    res.status(200).json(badge)
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
    const {
      badgeId,
      type,
      nameEs,
      nameEn,
      namePt,
      goalReach,
      image,
    } = req.body

    const dataToFind: any = {
      query: {
        _id: badgeId,
      }
    }

    const badges = await BadgeRepository.getBadges(dataToFind)

    if(!badges.length){
      return res.status(404).json(errors.find((error) => error.key === '007').code)
    }

    const query: any = {
      _id: badgeId
    }

    const dataToUpdate: any = {
      type,
      name: {
        es: nameEs,
        en: nameEn,
        pt: namePt,
      },
      goalReach,
      image,
    }

    const badge = await BadgeRepository.updateOneBadge(query, dataToUpdate)

    res.status(200).json(badge)
  }
}

export default new BadgesController()
