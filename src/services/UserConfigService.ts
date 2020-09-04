import UserConfig from '../models/userConfig'

interface IUserConfig {
  fromInvitation?: boolean
  hasPin?: boolean
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
