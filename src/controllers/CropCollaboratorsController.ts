'use strict'

import UserService from '../services/UserService'
import User from '../models/user'
import Company from '../models/company'
import Crop from '../models/crop'
import CollaboratorRequest from '../models/collaboratorRequest'

class CropCollaboratorsController {
  public async create (req, res) {
    const { email, identifier, type } = req.body
    const { id } = req.params
    const company = (await Company.findOne({ identifier })) || {}

    const current = await User.findById(req.user._id).populate('config')

    let user = await User.findOne({ email })

    if (user === null) {
      user = await UserService.store(
        { email, firstName: '', lastName: '', phone: '', config: '' },
        { fromInvitation: true, companySelected: company._id || '' }
      )
    }

    if (Object.keys(company).length > 0) {
      user.companies = user.companies ? user.companies : []
      user.companies.push({
        company: company._id,
        isAdmin: false,
        identifier
      })

      const request = new CollaboratorRequest({
        user: user._id,
        company: company._id
      })

      user.collaboratorRequest.push(request._id)

      await request.save()
    } else {
      user.companies.push({
        isAdmin: type === 'PRODUCER',
        identifier
      })
    }

    const crop = await Crop.findById(id)

    crop.members.push({
      user: user._id,
      producer: type === 'PRODUCER',
      identifier,
      type
    })

    // enviar mail de invitacion

    await crop.save()
    await user.save()

    res.json({ message: user })
  }
}
export default new CropCollaboratorsController()
