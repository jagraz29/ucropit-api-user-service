'use strict'

import UserService from '../services/UserService'
import User from '../models/user'
import Company from '../models/company'

class CropCollaboratorsController {
  public async create (req, res) {
    const { email, identifier, type } = req.body

    let user = await User.findOne({ email })

    if (user === null) {
      user = await UserService.store(
        { email, firstName: '', lastName: '', phone: '', config: '' },
        { fromInvitation: true }
      )
    }

    const company = await Company.findOne({ identifier })

    if (company) {
      user.companies.push({
        company: company._id,
        isProducer: type === 'PRODUCER'
      })
    }

    user.members.push({
      user: user._id,
      producer: type === 'PRODUCER',
      identifier
    })

    await user.save()

    res.json({ message: user })
  }
}
export default new CropCollaboratorsController()
