import UserConfig from '../models/UserConfig'

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
  public static async update (user: IUserConfig) {
    return UserConfig.update(user)
  }
}

export default UserConfigService
