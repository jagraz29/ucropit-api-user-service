'use strict';
module.exports = (sequelize, DataTypes) => {
  const CropUser = sequelize.define('crop_users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    crop_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    is_owner: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1
    }
  }, {});
  CropUser.associate = function(models) {
    CropUser.belongsToMany(models.crop_permissions, {
      foreignKey: 'crop_user_id',
      otherKey: 'crop_permission_id',
      through: 'crop_user_permissions'
    })
  };
  return CropUser;
};