import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { ClauseService } from '../services'
import { errors } from '../types/common'

export class ClausesController {
  /**
   *
   * Get all clauses.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public static async index(req: Request | any, res: Response) {
    const clauses = await ClauseService.createClause(req.body)

    res.status(StatusCodes.OK).json(clauses)
  }

  /**
   *
   * Create Clause.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public static async create(req: Request | any, res: Response) {
    try {
      const clauses = await ClauseService.createClause(req.body)
      res.status(StatusCodes.CREATED).json(clauses)
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: ReasonPhrases.INTERNAL_SERVER_ERROR
      })
    }
  }
}
