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
    crop_user_permissions.belongsTo(models.crop_permissions, {
      foreignKey: 'crop_permission_id',
      otherKey: 'crop_user_id'
    })
  };
  return crop_user_permissions;
};