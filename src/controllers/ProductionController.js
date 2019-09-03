"use strict";

const Crop = require("../models").crops;
const Field = require("../models").fields;
const CropTypes = require("../models").crop_types;
const Production = require("../models").productions;
const ProductionStage = require("../models").production_stage;
const ProductionFactory = require("../factories/ProductionFactory");
const _ = require("lodash");

class ProductionController {
  static async index(crop) {
    try {
      return await Production.findOne({
        where: { crop_id: crop },
        include: [
          { model: Crop, include: [{ model: CropTypes }] },
          { model: ProductionStage, as: "Stage" }
        ],
        order: [[{ model: ProductionStage, as: "Stage" }, "order", "ASC"]]
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  static async storeStageData(crop, stage, data) {
    const production = await Production.findOne({
      where: { crop_id: crop }
    });

    const productionStage = await ProductionStage.findOne({
      where: { label: stage, production_id: production.id }
    });

    await productionStage.update({
      data: JSON.stringify(data),
      status: "done"
    });

    return productionStage;
  }

  static async generate(id) {
    try {
      const crop = await Crop.findOne({ where: { id } });
      const budget = JSON.parse(crop.budget);

      const production = await Production.create({ crop_id: id });

      const factory = new ProductionFactory(id);

      const promises = budget.items.map(async item => {
        factory.stage = item;
        return production.createStage(factory.generate);
      });

      const stages = await Promise.all(promises);

      await crop.update({ status: "accepted" });

      return stages;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  static async updateData(request) {
    let data = request.body;
    const { idCrop, stage, fieldId, type } = request.params;

    try {
      const productionStage = await ProductionStage.findOne({
        where: { label: stage, production_id: idCrop }
      });

      data.status = "pending";
      let dataProductionStage = JSON.parse(productionStage.data);
      dataProductionStage.push(data);

      dataProductionStage = _.orderBy(
        dataProductionStage,
        ["field_id"],
        ["asc"]
      );

      await productionStage.update({
        data: JSON.stringify(dataProductionStage)
      });

      return productionStage;
    } catch (error) {
      throw new Error(error);
    }
  }

  // Create and  associate in production stage data object
  static async storeField(id, data, auth) {
    try {
      const field = await Field.create({
        ...data,
        user_id: auth.user.id
      });

      const production = await Production.findOne({ where: { crop_id: id } });

      const productionStage = await ProductionStage.findOne({
        where: { label: "fields", production_id: production.id }
      });

      const stage = JSON.parse(productionStage.data);

      await productionStage.update({
        data: JSON.stringify({
          ...stage,
          [Object.keys(stage).length]: {
            field_id: field.id,
            lots: {},
            name: data.name,
            has: 0,
            total: 0,
            amount: 0
          }
        })
      });

      return field;
    } catch (err) {
      throw new Error(err);
    }
  }

  static async deleteAplicationStage(cropId, stage, fieldId, type) {
    try {
      const productionStage = await ProductionStage.findOne({
        where: { label: stage, production_id: cropId }
      });

      const data = JSON.parse(productionStage.data);


      const updateData = data.filter(obj => {
        return obj.field_id != fieldId;
      });


      await productionStage.update({
        data: JSON.stringify(updateData)
      });

      return productionStage;
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = ProductionController;
