'use strict';
module.exports = (sequelize, DataTypes) => {
  const units = sequelize.define('units', {
    label_long: DataTypes.STRING,
    label_short: DataTypes.STRING,
    value: DataTypes.STRING
  }, {});
  units.associate = function(models) {
    // associations can be defined here
  };
  return units;
};