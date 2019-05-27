'use strict';
module.exports = (sequelize, DataTypes) => {
  const crop_permissions = sequelize.define('crop_permissions', {
    name: DataTypes.STRING,
    value: DataTypes.STRING
  }, {});
  crop_permissions.associate = function(models) {
    // associations can be defined here
  };
  return crop_permissions;
};