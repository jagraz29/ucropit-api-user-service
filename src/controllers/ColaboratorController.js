"use strict";

const Users = require("../models").users;
const Crop = require("../models").crops;
const CropTypes = require("../models").crop_types;
const CropUsers = require("../models").crop_users;
const ProductionUserPermission = require("../models")
  .productions_users_permissions;
const { getShortYear } = require("../helpers");
const DiaryUser = require("../services/DiaryUser");
const Mail = require("../services/Mail");

const _createPermissionsToColaborator = async (
  can_sign,
  can_edit,
  cropId,
  stage,
  fieldId,
  type,
  user
) => {
  try {
    const permission = {
      stages: [
        {
          label: _getStageName(stage),
          key: stage,
          permissions: {
            can_read: true,
            can_sign: parseInt(can_sign) === 1 ? true : false,
            can_edit: parseInt(can_edit) === 1 ? true : false
          }
        }
      ],
      events: [
        {
          field_id: fieldId,
          type: type,
          label: stage,
          stage: _getStageName(stage),
          permissions: {
            can_read: true,
            can_sign: parseInt(can_sign) === 1 ? true : false,
            can_edit: parseInt(can_edit) === 1 ? true : false
          }
        }
      ]
    };
    const productPermission = await ProductionUserPermission.findOne({
      where: { user_id: user.id, production_id: cropId }
    });
    if (!productPermission) {
      return await ProductionUserPermission.create({
        user_id: user.id,
        production_id: cropId,
        data: JSON.stringify(permission)
      });
    }

    return null;
  } catch (error) {
    throw new Error(error);
  }
};

const _getStageName = key => {
  switch (key) {
    case "pre-sowing":
      return "Pre-Siembra";
    case "sowing":
      return "Siembra";
    case "protection":
      return "Protección de Cultivos";
    case "harvest-and-marketing":
      return "Cosecha y Comercialización";
    case "other-expenses":
      return "Gastos administrativos";
    case "monitoring":
      return "Monitoreo";
    default:
      return "Entregas";
  }
};

class ColaboratorController {
  static async create(data, cropId, stage, fieldId, type, auth) {
    try {
      const { email, first_name, last_name, can_sign, can_edit } = data;

      let user = await Users.findOne({
        where: {
          email: email
        }
      });


      const crop = await Crop.findOne({
        where: { id: cropId },
        include: [{ model: CropTypes }]
      });

      //Aqui debería llegar un email específico
      const cropName = `${crop.crop_type.name} ${getShortYear(
        crop.start_at
      )}/${getShortYear(crop.end_at)}`;

      if (!user) {
        const newUser = await Users.create({
          email: email,
          first_name: first_name,
          last_name: last_name,
          password: email,
          first_login: 0
        });

        Mail.send({
          template: "new_colaborator",
          to: newUser.email,
          data: { newUser, cropName }
        });

        await crop.addUsers(newUser);

        const rel = await CropUsers.findOne({
          where: { user_id: newUser.id, crop_id: crop.id }
        });

        await rel.update({
          is_owner: 0
        });

        //Se agrega los permisos
        await _createPermissionsToColaborator(
          can_sign,
          can_edit,
          cropId,
          stage,
          fieldId,
          type,
          newUser
        );

        //Agrego el usuario colaborador a la agenda del usuario.
        await DiaryUser.add(auth.user, newUser);

        return newUser;
      }

      Mail.send({
        template: "colaborator",
        to: user.email,
        data: { user, cropName, owner: auth.user }
      });

      const rel = await CropUsers.findOne({
        where: { user_id: user.id, crop_id: crop.id }
      });

      if (!rel) {
        await crop.addUsers(user);

        const newRel = await CropUsers.findOne({
          where: { user_id: user.id, crop_id: crop.id }
        });

        await newRel.update({
          is_owner: 0
        });
      }

      await _createPermissionsToColaborator(
        can_sign,
        can_edit,
        cropId,
        stage,
        fieldId,
        type,
        user
      );

      //Agrego el usuario colaborador a la agenda del usuario.
      await DiaryUser.add(auth.user, user);

      return user;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  /**
   * Delete user to event.
   *
   * @param {*} userId
   * @param {*} cropId
   * @param {*} stage
   * @param {*} fieldId
   * @param {*} type
   */
  static async removeEvent(cropId, stage, fieldId, type, userId) {
    try {
      const productPermission = await ProductionUserPermission.findOne({
        where: { user_id: userId, production_id: cropId }
      });

      const events = JSON.parse(productPermission.data).events.map(el => {
        if(Object.prototype.toString.call(el) === '[object Object]') {
          return {
            field_id: fieldId,
            type: type,
            stage: _getStageName(stage),
            permissions: {
              can_read: true,
              can_edit: false,
              can_sign: false
            }
          };
        }

        if (el.length == 1) {
          if (
            el[0].field_id == fieldId &&
            el[0].stage == _getStageName(stage) &&
            el[0].type == type
          ) {
            return {
              field_id: fieldId,
              type: type,
              stage: _getStageName(stage),
              permissions: {
                can_read: true,
                can_edit: false,
                can_sign: false
              }
            };
          } else {
            return { ...el[0] };
          }
        } else {
          if (el.length > 1) {
            return el.map(obj => {
              if (
                obj.field_id == fieldId &&
                obj.stage == _getStageName(stage) &&
                obj.type == type
              ) {
                return {
                  field_id: fieldId,
                  type: type,
                  stage: _getStageName(stage),
                  permissions: {
                    can_read: true,
                    can_edit: false,
                    can_sign: false
                  }
                };
              } else {
                return { ...obj };
              }
            });
          }
        }
      });

      const permissions = {
        stages: [...JSON.parse(productPermission.data).stages],
        events: [...events]
      };

      return await productPermission.update({
        data: JSON.stringify(permissions)
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Delete user to crop.
   *
   * @param {*} userId
   * @param {*} cropId
   */
  static async remove(userId, cropId) {
    try {
      const rel = await CropUsers.findOne({
        where: { user_id: userId, crop_id: cropId }
      });

      const productPermission = await ProductionUserPermission.findOne({
        where: { user_id: userId, production_id: cropId }
      });

      const sing = await Signs.findOne({
        where: { type_id: cropId, user_id: userId }
      });

      await rel.destroy();

      if (productPermission) {
        await productPermission.destroy();
      }

      if (sing) {
        await sing.destroy();
      }

      return true;
    } catch (error) {
      throw new Error(err);
    }
  }
}

module.exports = ColaboratorController;
