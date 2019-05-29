'use strict';
module.exports = (sequelize, DataTypes) => {
  const crop_roles = sequelize.define('crop_roles', {
    name: DataTypes.STRING,
    value: DataTypes.STRING
  }, {});
  crop_roles.associate = function(models) {
    // associations can be defined here
  };
  return crop_roles;
};