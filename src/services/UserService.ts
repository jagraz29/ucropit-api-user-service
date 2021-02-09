import UserConfigService from './UserConfigService'
import User from '../models/user'

interface IUser {
  firstName: string
  lastName: string
  phone: string
  email: string
  pin?: string
  verifyToken?: string
  companies?: Array<any>
  config: string
}

class UserService {
  public static async store(
    user: IUser,
    configs = { fromInvitation: false, companySelected: '' }
  ) {
    if (!configs.companySelected) {
      delete configs.companySelected
    }

    const config = await UserConfigService.create(configs)

    user.config = config._id
    user.email = user.email.toLocaleLowerCase()

    const newUser = new User(user)

    return newUser.save()
  }

  public static async update(filter, data) {
    return User.findOneAndUpdate(filter, data)
  }

  /**
   *  Updated collaborator request in array user.
   *
   * @param userId
   * @param collaboratorRequest
   */
  public static async updateCollaboratorRequest(
    userId: string,
    collaboratorRequest: any
  ) {
    const user = await User.findById(userId)
    user.collaboratorRequest.push(collaboratorRequest._id)

    return user.save()
  }
}

export default UserService
