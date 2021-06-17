import UserService from '../services/UserService'
import NotificationService from '../services/NotificationService'
import User from '../models/user'
import Company from '../models/company'
import Crop from '../models/crop'
import CollaboratorRequest from '../models/collaboratorRequest'
import { emailTemplates } from '../types/common'
import RoleService from '../services/RolesService'

const PRODUCERS_ROLES = [
  'PRODUCER',
  'PRODUCER_ADVISER',
  'PRODUCER_ADVISER_ENCOURAGED',
  'CAM'
]

class CropCollaboratorsController {
  public async create (req, res) {
    try {
      const { email, identifier, type } = req.body
      const { id } = req.params
      const company: any = await Company.findOne({ identifier })

      let user: any = await User.findOne({ email })

      if (user === null) {
        user = await UserService.store(
          { email, firstName: '', lastName: '', phone: '', config: '' },
          { fromInvitation: true, companySelected: company ? company._id : '' }
        )
      }

      if (company !== null) {
        user.companies = user.companies ? user.companies : []

        const existRelation = !user.companies.find(
          el => String(el.company) === String(company._id)
        )

        if (existRelation) {
          user.companies.push({
            company: company._id,
            isAdmin: false,
            identifier
          })

          const request = await CollaboratorRequest.create({
            user: user._id,
            company: company._id
          })

          user.collaboratorRequest.push(request._id)
        }
      } else {
        user.companies.push({
          isAdmin: PRODUCERS_ROLES.includes(type),
          identifier
        })
      }

      const crop: any = await Crop.findById(id)

      crop.members.push({
        user: user._id,
        producer: PRODUCERS_ROLES.includes(type),
        identifier,
        type
      })

      const role = await RoleService.findOne({ value: type })

      await NotificationService.email(
        emailTemplates.NOTIFICATION_COLLABORATOR,
        user,
        {
          user,
          cropname: crop.name,
          identifier: identifier,
          role: role.label.es
        }
      )

      await crop.save()
      await user.save()

      res.json({ message: user })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: err.message })
    }
  }
}
export default new CropCollaboratorsController()
