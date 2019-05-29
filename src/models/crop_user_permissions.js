'use strict';
module.exports = (sequelize, DataTypes) => {
  const crop_user_permissions = sequelize.define('crop_user_permissions', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    crop_permission_id: DataTypes.INTEGER,
    crop_user_id: DataTypes.INTEGER
  }, {});
  crop_user_permissions.associate = function(models) {
    // associations can be defined here
  };
  return crop_user_permissions;
};