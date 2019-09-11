"use strict";

const Provider = require("../models").providers;
const ProviderType = require("../models").providers_type;
const TypesProviders = require("../models").providers_providers_type;
const CoverageAreas = require("../models").coverage_areas;
const CoverageAreaProvider = require("../models").coverage_areas_providers;
const { paginate } = require("../helpers");

class ProviderController {
  static async index(page, pageSize) {
    try {
      const providers = await Provider.findAll(
        paginate(
          {
            include: [
              {
                model: ProviderType,
                attributes: ["value", "label"],
                through: {
                  model: TypesProviders
                }
              }
            ],
            where: {}
          },
          { page, pageSize }
        )
      );

      return providers;
    } catch (err) {
      throw new Error(err);
    }
  }

  static async getByTypes(type) {
    try {
      const providers = await Provider.findAll({
        include: [
          {
            model: ProviderType,
            attributes: ["value", "label"],
            through: {
              model: TypesProviders
            },
            where: {
              value: type
            }
          }
        ],
        where: {}
      });

      return providers;
    } catch (err) {
      throw new Error(err);
    }
  }

  static async show(id) {
    try {
      const provider = await Provider.findOne({
        where: { id: id },
        include: [
          {
            model: ProviderType,
            attributes: ["value", "label"],
            through: {
              model: TypesProviders
            }
          }
        ]
      });

      if (!provider) {
        return null;
      }

      return provider;
    } catch (err) {
      throw new Error(err);
    }
  }

  static async providersType() {
    try {
      const providersType = await ProviderType.findAll({});
      return providersType;
    } catch (error) {
      throw new Error(err);
    }
  }

  static async coveragesArea() {
    try {
      const coverageAreas = await CoverageAreas.findAll({
        attributes: ["id", ["name", "label"], "value"]
      });
      return coverageAreas;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async create(data) {
    try {
      const provider = await Provider.create({
        ...data
      });

      data.types.forEach(async element => {
        const providersType = await ProviderType.findOne({
          where: { value: element.value }
        });
        await TypesProviders.create({
          providers_id: provider.get("id"),
          providers_type_id: providersType.get("id")
        });
      });

      data.area_cobertura.forEach(async element => {
        const coverageArea = await CoverageAreas.findOne({
          where: { value: element.value }
        });

        await CoverageAreaProvider.create({
          providers_id: provider.get("id"),
          coverage_area_id: coverageArea.get("id")
        });
      });
      return provider;
    } catch (err) {
      throw new Error(err);
    }
  }

  static async update(data, id) {
    try {
      const provider = await Provider.findOne({ where: { id: id } });

      await TypesProviders.destroy({ where: { providers_id: id } });

      data.types.forEach(async element => {
        const providersType = await ProviderType.findOne({
          where: { value: element.value }
        });
        await TypesProviders.create({
          providers_id: provider.get("id"),
          providers_type_id: providersType.get("id")
        });
      });
      return await provider.update(data);
    } catch (err) {
      throw new Error(err);
    }
  }

  static async delete(id) {
    try {
      await TypesProviders.destroy({ where: { providers_id: id } });

      const provider = await Provider.findOne({ where: { id: id } });
      return await provider.destroy();
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = ProviderController;
