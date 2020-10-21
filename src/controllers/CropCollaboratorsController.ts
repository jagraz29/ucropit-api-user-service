'use strict'

import UserService from '../services/UserService'
import User from '../models/user'
import Company from '../models/company'
import Crop from '../models/crop'

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
      const isCurrentCompany =
        String(current.config.companySelected._id) === String(company._id)

      user.companies = user.companies ? user.companies : []
      user.companies.push({
        company: company._id,
        isProducer: type === 'PRODUCER',
        identifier
      })
    } else {
      user.companies.push({
        isProducer: type === 'PRODUCER',
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
