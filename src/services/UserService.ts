import models from '../models'

const User = models.User

interface IUser {
  firstName: string
  lastName: string
  phone: string
  email: string
  pin?: string
  verifyToken?: string
  companies?: Array<any>
}

class UserService {
  public static async store (user: IUser) {
    return User.create(user)
  }

  public static async update (filter, data) {
    return User.findOneAndUpdate(filter, data)
  }
}

export default UserService
