import UserConfig from '../models/userConfig'

interface IUserConfig {
  fromInvitation?: boolean
  hasPin?: boolean
  companySelected?: string
}

class UserConfigService {

  /**
   * Find One User config by Id.
   *
   * @param string id
   */
  public static async findById (id: string) {
    return UserConfig.findById(id).populate('companySelected')
  }
  /**
   * Create a new User Config
   *
   * @param IUserConfig user
   */
  public static async create (user: IUserConfig) {
    return UserConfig.create(user)
  }

  /**
   * Update User Config.
   *
   * @param string id
   * @param IUserConfig user
   */
  public static async update (id: string, user: IUserConfig) {
    const config = await UserConfig.findByIdAndUpdate({ _id: id }, user)

    return this.findById(config._id)
  }
}

export default UserConfigService
