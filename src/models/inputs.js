'use strict'
module.exports = (sequelize, DataTypes) => {
  const inputs = sequelize.define('inputs', {
    unit_id: DataTypes.INTEGER,
    code: DataTypes.INTEGER,
    stage: DataTypes.ENUM,
    type_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {});
  inputs.associate = function(models) {
    // associations can be defined here
  };
  return inputs
};