import { Request, Response } from 'express'
import models from '../models'
import CollaboratorRequestService from '../services/CollaboratorRequestService'

const User = models.User

class CollaboratorRequestController {
  /**
   * Get all collaborator request.
   *
   * @param Request req
   * @param Response res
   *
   * @returns Response
   */
  public async index(req: Request, res: Response) {
    const query = req.query

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
  public async update(req: Request, res: Response) {
    const { id } = req.params
    const data = req.body

    await CollaboratorRequestService.update(data, id)

    const collaboratorRequest: any = await CollaboratorRequestService.findById(
      id
    )

    if (data.status === 'accepted') {
      const user: any = await User.findById(
        collaboratorRequest.user._id
      ).populate('companies')

      const companyIndex = user.companies.findIndex((company) => {
        return (
          String(company.company) === String(collaboratorRequest.company._id)
        )
      })

      await user.companies.set(companyIndex, {
        ...user.companies[companyIndex],
        company: collaboratorRequest.company._id,
        isAdmin: Boolean(data.isAdmin)
      })

      await user.save()
    }

    res.status(200).json(collaboratorRequest)
  }
}

export default new CollaboratorRequestController()
