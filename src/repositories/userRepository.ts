import models from '../models'

const { User } = models

export class UserRepository {
  public static async getByEmail(email: string) {
    return User.findOne({ email: email })
  }
}
