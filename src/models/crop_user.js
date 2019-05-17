'use strict';
module.exports = (sequelize, DataTypes) => {
  const CropUser = sequelize.define('crop_users', {
    crop_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {});
  CropUser.associate = function(models) {
    // associations can be defined here
  };
  return CropUser;
};