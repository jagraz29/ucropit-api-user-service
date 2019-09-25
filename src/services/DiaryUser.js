const DiaryUserModel = require("../models").diary_users;

class DiaryUser {

    /**
     * Agrega un usuario colaborador a la agenda
     * Si existe no lo agrega.
     * 
     * @param {*} me 
     * @param {*} user 
     */
  static async add(me, user) {
    try {
      const contact = await DiaryUserModel.findOne({
        where: { user_id: me.id, contact_user_id: user.id }
      });
      if (!contact) {
        return await DiaryUserModel.create({
          user_id: me.id,
          contact_user_id: user.id
        });
      }
      return;
    } catch (error) {
      throw new Error(
        `Error al guardar el usuario en la agenda: ${error.message} `
      );
    }
  }

  /**
   * Quita un usuario colaborador de la agenda.
   * 
   * @param {*} me 
   * @param {*} user 
   */
  static async remove(me, user) {
    try {
      const contactUser = await DiaryUserModel.findOne({
        where: { user_id: me.id, contact_user_id: user.id }
      });
      return await contactUser.destroy();
    } catch (error) {
      throw new Error(
        `Error al eliminar ell usuario en la agenda: ${error.message} `
      );
    }
  }
}

module.exports = DiaryUser;
