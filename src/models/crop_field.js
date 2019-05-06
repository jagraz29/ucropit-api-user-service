'use strict';
module.exports = (sequelize, DataTypes) => {
  const CropField = sequelize.define('crop_field', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    crop_id: DataTypes.INTEGER,
    field_id: DataTypes.INTEGER
  }, {
      freezeTableName: true,
      tableName: 'crop_field',
      timestamps: true
    });
  return CropField;
};