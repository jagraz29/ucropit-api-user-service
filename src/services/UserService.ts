import models from '../models'

const User = models.User

interface IUser {
  firstName: string
  lastName: string
  phone: string
  email: string
  pin?: string
  verifyToken?: string
}

class UserService {
  public static async store (user: IUser) {
    return User.create(user)
  }
}

export default UserService
