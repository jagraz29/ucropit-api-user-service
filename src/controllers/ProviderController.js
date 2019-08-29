"use strict";

const Provider = require("../models").providers;
const ProviderType = require("../models").providers_type;
const TypesProviders = require("../models").providers_providers_type;
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
                attributes: ["key", "name"],
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

  static async show(id) {
    try {
      const provider = await Provider.findOne({ where: { id: id } });

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

  static async create(data) {
    try {
      const provider = await Provider.create({
        ...data
      });

      data.types.forEach(async element => {
        const providersType = await ProviderType.findOne({
          where: { key: element }
        });
        await TypesProviders.create({
          providers_id: provider.get("id"),
          providers_type_id: providersType.get("id")
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
      return await provider.update(data);
    } catch (err) {
      throw new Error(err);
    }
  }

  static async delete(id) {
    try {
      const provider = await Provider.findOne({ where: { id: id } });
      return await provider.destroy();
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = ProviderController;
