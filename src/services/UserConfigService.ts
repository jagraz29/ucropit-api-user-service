import models from '../models'

const UserConfig = models.UserConfig

interface IUserConfig {
  fromInvitation?: boolean
  hasPin?: boolean
  userId?: string
}

class UserConfigService {
  /**
   *
   * @param user
   */
  public static async create (user: IUserConfig) {
    return UserConfig.create(user)
  }

  /**
   *
   * @param user
   */
  public static async update (id, user: IUserConfig) {
    return UserConfig.findByIdAndUpdate({ _id: id }, user)
  }
}

export default UserConfigService
