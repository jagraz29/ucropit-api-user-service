"use strict";

const User = require("../models").users;
const DiaryUser = require("../models").diary_users;

class DiaryUserController {
  static async index(auth) {
    return await User.findAll(
      {
        include: [
          {
            model: User,
            as: "ContactUser",
            through: {
              model: DiaryUser
            }
          }
        ],
        where: { id: auth.user.id }
      },
      { plain: true }
    );
  }
}

module.exports = DiaryUserController;
