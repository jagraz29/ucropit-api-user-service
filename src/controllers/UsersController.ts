import { Request, Response } from 'express'
import models from '../models'
import UserService from '../services/UserService'

const User = models.User
const CollaboratorRequest = models.CollaboratorRequest

class UsersController {
  public async index (req: Request, res: Response) {
    const users = await User.find({})
    res.status(200).json({ users })
  }

  public async show (req: Request, res: Response) {
    const user = await User.findById(req.params.id)
    res.json({ user })
  }

  public async create (req: Request, res: Response) {
    const user = await UserService.store(req.body)
    res.json(user)
  }

  public async update (req: Request, res: Response) {
    const { email, firstName, lastName, phone, pin } = req.body
    let user = await User.findOne({ email: req.body.email })

    if (!user) return res.status(404).json({ error: 'ERR_NOT_FOUND' })

    user.firstName = firstName
    user.lastName = lastName
    user.phone = phone

    if (pin) user.pin = pin

    user = await user.save()
    await user.populate('config').execPopulate()
    res.json(user)
  }

  /**
   * Update Collaborator Request.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async updateStatusCollaborator (req: Request, res: Response) {
    const { userId } = req.params

    let collaboratorRequest = await CollaboratorRequest.findOne({ user: userId })

    collaboratorRequest.status = req.body.status

    await collaboratorRequest.save()

    collaboratorRequest = await CollaboratorRequest.findOne({ user: userId }).populate('user').populate('company')

    res.status(200).json(collaboratorRequest)

  }

  /**
   * List Collaborators.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async listCollaborators (req: Request, res: Response) {
    const { query } = req.query

    const collaboratorsRequest = await CollaboratorRequest.find(query).populate('user').populate('company')

    res.status(200).json(collaboratorsRequest)
  }

  public async destroy (req: Request, res: Response) {
    const user = await User.findByIdAndDelete(req.params.id)
    res.json({
      message: 'deleted successfully'
    })
  }
}

export default new UsersController()
