import UserConfig from '../models/userConfig'
import models from '../models'

const User = models.User

interface IUserConfig {
  fromInvitation?: boolean
  hasPin?: boolean
  companySelected?: string
}

class UserConfigService {
  /**
   * Get One user with a configs.
   *
   * @param string id
   */
  public static async findUserWithConfigs(id: string) {
    return User.findOne({ _id: id })
      .populate({
        path: 'config',
        populate: [{ path: 'companySelected' }],
      })
      .populate('collaboratorRequest')
      .populate('companies.company')
  }
  /**
   * Find One User config by Id.
   *
   * @param string id
   */
  public static async findById(id: string) {
    return UserConfig.findById(id).populate('companySelected')
  }
  /**
   * Create a new User Config
   *
   * @param IUserConfig user
   */
  public static async create(user: IUserConfig) {
    return UserConfig.create(user)
  }

  /**
   * Update User Config.
   *
   * @param string id
   * @param IUserConfig user
   * @param user optional
   */
  public static async update(id: string, configData: IUserConfig, user?) {
    const config = await UserConfig.findByIdAndUpdate({ _id: id }, configData)

    if (user) {
      return User.findById(user._id)
        .populate({
          path: 'config',
          populate: [{ path: 'companySelected' }],
        })
        .populate('collaboratorRequest')
        .populate('companies.company')
    }

    return this.findById(config._id)
  }

  public static existAdminInCompany(
    companies,
    identifier: string | any
  ): boolean {
    const existAdmin = companies.find(
      (member) => member.isAdmin && member.identifier === identifier
    )

    if (existAdmin) {
      return true
    }
    return false
  }
}

export default UserConfigService
