'use strict';
module.exports = (sequelize, DataTypes) => {
  const approval = sequelize.define('approval', {
    stage: DataTypes.STRING,
    crop_id: DataTypes.INTEGER,
    data: DataTypes.TEXT,
    type: DataTypes.STRING,
    service_id: DataTypes.INTEGER,
    input_id: DataTypes.INTEGER,
    provider_id: DataTypes.INTEGER
  }, {});
  approval.associate = function(models) {
    approval.hasMany(models.approval_register, { foreignKey: 'approval_id', as: 'Register' })
  };
  return approval;
};