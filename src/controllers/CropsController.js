"use strict";

const Crop = require("../models").crops;
const CropTypes = require("../models").crop_types;
const Fields = require("../models").fields;
const Users = require("../models").users;
const CropUserPermissions = require("../models").crop_user_permissions;
const CropPermissions = require("../models").crop_permissions;
const CropUsers = require("../models").crop_users;
const Signs = require("../models").signs;
const ProductionUserPermission = require("../models")
  .productions_users_permissions;
const Mail = require("../services/Mail");
const Search = require("../services/Search");
const { getShortYear } = require("../helpers");
const { map, isEqual } = require("lodash");
const { diff } = require("deep-object-diff");
const PDF = require("../services/PDF");
const Stamp = require("../services/Stamp");
const DiaryUser = require("../services/DiaryUser");

class CropsController {
  static async index(auth) {
    try {
      return await Crop.findAll({
        include: [
          { model: CropTypes },
          { model: Fields },
          {
            model: Users,
            where: { id: auth.user.id }
          }
        ]
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  static async colaborators(cropId, values, auth) {
    try {
      let user = await Users.findOne({
        where: {
          email: values.email
        }
      });

      const crop = await Crop.findOne({
        where: { id: cropId },
        include: [{ model: CropTypes }]
      });

      const cropName = `${crop.crop_type.name} ${getShortYear(
        crop.start_at
      )}/${getShortYear(crop.end_at)}`;

      if (!user) {
        user = await Users.create({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.email,
          first_login: 0
        });

        Mail.send({
          template: "new_colaborator",
          to: user.email,
          data: { user, cropName }
        });
      } else {
        Mail.send({
          template: "colaborator",
          to: user.email,
          data: { user, cropName, owner: auth.user }
        });
      }

      await crop.addUsers(user);

      //Agrego el usuario colaborador a la agenda del usuario.
      await DiaryUser.add(auth.user, user);

      const rel = await CropUsers.findOne({
        where: { user_id: user.id, crop_id: crop.id }
      });

      await rel.update({
        is_owner: 0
      });

      if (values.can_edit) {
        await CropUserPermissions.create({
          crop_permission_id: 1,
          crop_user_id: rel.id
        });
      }

      if (values.can_sign) {
        await CropUserPermissions.create({
          crop_permission_id: 2,
          crop_user_id: rel.id
        });
      }

      return crop;
    } catch (err) {
      throw new Error(err);
    }
  }

  static async removeColaborator(colaborator, crop) {
    try {
      const rel = await CropUsers.findOne({
        where: { user_id: colaborator, crop_id: crop }
      });
      const sing = await Signs.findOne({
        where: { type: crop, user_id: colaborator }
      });

      await rel.destroy();

      if (sing) {
        await sing.destroy();
      }

      return true;
    } catch (error) {
      throw new Error(err);
    }
  }

  static async removeCropItems({ id, stage, service, serviceId }) {
    try {
      const crop = await Crop.findOne({
        where: { id: id }
      });

      const budget = JSON.parse(crop.budget)

      budget.items = budget.items.map(item => {
        if (item.form == stage) {
          for (let i of Object.keys(item.data)) {
            if (item.data[i].field_id == serviceId
              && item.data[i].type === service) {
                console.log(item.data[i])
                delete item.data[i]
            }
          }
        }
        return item
      })

      await crop.update({budget: JSON.stringify(budget)})

      await Signs.destroy({where: {
        type_id: id
      }})

      await crop.update({ budget: JSON.stringify(budget) });
    } catch (err) {
      console.log(err)
    }
  }

  static async types() {
    try {
      return await CropTypes.findAll();
    } catch (err) {
      throw new Error(err);
    }
  }

  static async cropTypesCreate(data) {
    try {
      return await CropTypes.create(data);
    } catch (err) {
      throw new Error(err);
    }
  }

  static async deleteCropType(id) {
    try {
      const croptype = await CropTypes.findOne({ where: { id: id } });
      return await croptype.destroy();
    } catch (err) {
      throw new Error(err);
    }
  }

  static async showCropType(id) {
    try {
      const croptype = await CropTypes.findOne({ where: { id: id } });
      return await croptype;
    } catch (err) {
      throw new Error(err);
    }
  }

  static async updateCropType(data, id) {
    try {
      const croptype = await CropTypes.findOne({ where: { id: id } });
      return await croptype.update(data);
    } catch (err) {
      throw new Error(err);
    }
  }

  static async confirmation(id, auth) {
    try {
      const crop = await Crop.findOne({ where: { id } });
      const budget = JSON.parse(crop.budget);

      const { hash, path } = await PDF.generate({
        data: {},
        template: "templates/budget.pug",
        path: `${__basedir}/../public/budget`,
        filename: `crop-${id}.pdf`
      });

      await Signs.create({
        type: "full-budget",
        user_id: auth.user.id,
        type_id: id,
        hash,
        ots: await Stamp.stampHash(hash),
        meta: JSON.stringify({ path: `budget/crop-${id}.pdf` })
      });

      return { path: `budget/crop-${id}.pdf` };
    } catch (err) {
      throw new Error(err);
    }
  }

  static async show(id, auth) {
    try {
      let crop = await Crop.findOne({
        where: { id: id },
        include: [
          { model: CropTypes },
          { model: Fields },
          {
            model: Users,
            include: [
              {
                model: Signs
              }
            ]
          }
        ]
      });

      const cropUsersId = crop.users.find(el => el.id === auth.user.id)
        .crop_users.id;
      const cropUsers = await CropUsers.findOne({
        where: { id: cropUsersId },
        include: [{ model: CropPermissions }]
      });

      let productionPermissions = crop.users.map(async user => {
        const cropUserPermissionsProduction = await ProductionUserPermission.findOne(
          {
            where: { user_id: user.id, production_id: id }
          }
        );

        if (cropUserPermissionsProduction) {
          return {
            user_id: user.id,
            permissions: JSON.parse(cropUserPermissionsProduction.data)
          };
        }
      });

      productionPermissions = await Promise.all(productionPermissions);

      const plainCrops = crop.get({ plain: true });

      const canSign = [];

      // Search users in crop relationship
      crop = {
        ...plainCrops,
        users: await Promise.all(
          plainCrops.users.map(async el => {
            const permissions = await CropUserPermissions.findAll({
              where: { crop_user_id: el.crop_users.id },
              include: [{ model: CropPermissions }]
            });

            const signable = permissions.find(
              el => el.crop_permission.value === "can_sign"
            );

            if (signable !== undefined) {
              canSign.push(el);
            }

            return { ...el, permissions };
          })
        )
      };

      crop.users_can_sign = crop.users.filter(el => {
        return (
          el.permissions.filter(el => el.crop_permission.value === "can_sign")
            .length > 0
        );
      }).length;

      // search users that already sign in this crop
      crop.editable = canSign.filter(el => {
        const signers =
          el.signs.filter(el => {
            return el.type_id === Number(id);
          }).length > 0;
        return signers;
      });

      // compare users that has signs vs user can sing to define editable permission
      crop.editable = crop.editable.length !== canSign.length;

      return {
        ...crop,
        permissions: cropUsers.crop_permissions,
        owner: cropUsers.is_owner,
        production_permission: productionPermissions.filter(elem => elem)
      };
    } catch (err) {
      console.log("CROP_SHOW", err);
      throw new Error(err);
    }
  }

  static async getStageCropByField(id, field) {
    try {
      const crop = await Crop.findOne({ where: { id: id } });
      if (!crop) throw new Error(`No se encontró crop con id ${id}`);
      return await Search.getBudgetbyFields({ where: { id: id } }, field);
    } catch (err) {
      throw new Error(err);
    }
  }

  static async create(data, auth) {
    try {
      const crop = await Crop.create({
        ...data,
        budget: JSON.stringify({
          items: [
            {
              id: 1,
              name: "Campo",
              data: {},
              status: "in_progress",
              form: "fields",
              display: true
            },
            {
              id: 2,
              name: "Pre-Siembra",
              data: {},
              status: "in_progress",
              form: "pre-sowing",
              display: true
            },
            {
              id: 3,
              name: "Siembra",
              data: {},
              status: "in_progress",
              form: "sowing",
              display: true
            },
            {
              id: 4,
              name: "Protección de Cultivos",
              data: {},
              status: "in_progress",
              form: "protection",
              display: true
            },
            {
              id: 5,
              name: "Cosecha y Comercialización",
              data: {},
              status: "in_progress",
              form: "harvest-and-marketing",
              display: true
            },
            {
              id: 6,
              name: "Gastos administrativos",
              data: {},
              status: "in_progress",
              form: "other-expenses",
              display: true
            },
            {
              id: 7,
              name: "Monitoreo",
              data: {},
              status: "in_progress",
              form: "monitoring",
              display: false
            },
            {
              id: 8,
              name: "Entregas",
              data: {},
              status: "in_progress",
              form: "deliveries",
              display: false
            }
          ]
        })
      });

      let rel = await crop.setUsers([auth.user.id]);
      rel = rel[0][0];

      await CropUserPermissions.create({
        crop_permission_id: 1,
        crop_user_id: rel.id
      });

      await CropUserPermissions.create({
        crop_permission_id: 2,
        crop_user_id: rel.id
      });

      return crop;
    } catch (err) {
      throw new Error(err);
    }
  }

  static async update(id, data) {
    try {
      const crop = await Crop.findOne({
        where: { id: id }
      });

      let newBudget = JSON.parse(crop.budget);
      newBudget = {
        ...newBudget,
        items: map(newBudget.items, el => {
          if (el.form === "other-expenses") {
            const totalExpenses = el.data.undefined.expenses.reduce(
              (prev, el) => prev + parseFloat(el.cost.replace(/[, ]+/g, "")),
              0
            );
            const totalIncome = el.data.undefined.income.reduce(
              (prev, el) => prev + parseFloat(el.cost.replace(/[, ]+/g, "")),
              0
            );
            el.data["undefined"].amount = (
              (totalIncome - totalExpenses) /
              data.surface
            ).toFixed(2);
          } else if (el.form === "harvest-and-marketing") {
            let newData = {};
            for (const item in el.data) {
              let total = Number(el.data[item].price);
              if (el.data[item].concept.calc_unit === "ha") {
                total = total;
              } else if (el.data[item].concept.calc_unit === "percent") {
                total = (crop.reference_price * crop.quintals * total) / 100;
              } else if (el.data[item].concept.calc_unit === "ton") {
                total = total * crop.quintals;
              }

              el.data[item].amount = total;

              newData = {
                ...el.data,
                [item]: el.data[item]
              };
            }
            el.data = newData;
          }
          return el;
        })
      };

      await Signs.destroy({
        where: { type_id: id, type: "crop-budget" }
      });

      return await crop.update({
        ...data,
        budget: JSON.stringify(newBudget)
      });
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  static async budget(id, data) {
    try {
      const crop = await Crop.findOne({
        where: { id: id }
      });

      const diffBudget = diff(JSON.parse(crop.budget), data).items;

      if (diffBudget !== undefined) {
        if (diffBudget[Object.keys(diffBudget)[0]].data !== undefined) {
          await Signs.destroy({
            where: { type_id: crop.id, type: "crop-budget" }
          });
        }
      }

      return await crop.update({ budget: JSON.stringify(data) });
    } catch (err) {
      throw new Error(err);
    }
  }

  static async delete(id) {
    try {
      const crop = await Crop.findOne({
        where: { id: id }
      });

      return await crop.destroy();
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = CropsController;
