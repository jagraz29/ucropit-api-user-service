"use strict";

const Field = require("../models").fields;
const Lot = require("../models").lots;
const UploadFile = require("../services/UploadFiles");
const GoogleGeoCoding = require("../services/GoogleGeoCoding");

class FieldsController {
  static async index(auth) {
    try {
      return await Field.findAll({
        where: { user_id: auth.user.id },
        include: [{ model: Lot }]
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  static async indexAll(auth) {
    try {
      return await Field.findAll();
    } catch (err) {
      throw new Error(err);
    }
  }

  static async show(id) {
    try {
      return await Field.findOne({
        where: { id: id },
        include: [{ model: Lot }]
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  static async create(data, auth, file) {
    try {
      const resultGeocode = await GoogleGeoCoding.getGeocoding(
        data.lat,
        data.lng
      );

      const values = {
        ...data,
        user_id: auth.user.id,
        address: !resultGeocode.error
          ? resultGeocode.data[1].formatted_address
          : null
      };

      if (file) {
        const upload = new UploadFile(file, "uploads");
        const res = await upload.store();
        values.kmz_path = res.namefile;
      }

      return await Field.create(values);
    } catch (err) {
      throw new Error(err);
    }
  }

  static async update(id, data, file) {
    try {
      const field = await Field.findOne({
        where: { id: id }
      });

      const resultGeocode = await GoogleGeoCoding.getGeocoding(
        data.lat,
        data.lng
      );
      
      const values = {
        ...data,
        address: !resultGeocode.error
        ? resultGeocode.data[1].formatted_address
        : null
      };

      if (file) {
        const upload = new UploadFile(file, "uploads");
        const res = await upload.store();
        values.kmz_path = res.namefile;
      }

      return await field.update(values);
    } catch (err) {
      throw new Error(err);
    }
  }

  static async delete(id) {
    try {
      const crop = await Field.findOne({
        where: { id: id }
      });

      return await crop.destroy();
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = FieldsController;
