import { Request, Response } from 'express'
import CollaboratorRequestService from '../services/CollaboratorRequestService'

class CollaboratorRequestController {

/**
 * Get all collaborator request.
 *
 * @param Request req
 * @param Response res
 *
 * @returns Response
 */
  public async index (req: Request, res: Response) {
    const { query } = req.query

    const collaboratorsRequest = await CollaboratorRequestService.find(query)

    res.status(200).json(collaboratorsRequest)
  }

    /**
     * Update Collaborator Request.
     *
     * @param req
     * @param res
     *
     * @return Response
     */
  public async update (req: Request, res: Response) {
    const { id } = req.params
    const data = req.body

    await CollaboratorRequestService.update(data, id)

    const collaboratorRequest = await CollaboratorRequestService.findById(id)

    res.status(200).json(collaboratorRequest)

  }

}

export default new CollaboratorRequestController()
