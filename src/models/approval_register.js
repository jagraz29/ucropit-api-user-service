'use strict'

module.exports = (sequelize, DataTypes) => {
  const approval_register = sequelize.define('approval_register', {
    approval_id: DataTypes.INTEGER,
    data: DataTypes.TEXT,
    status: DataTypes.BOOLEAN
  }, {});
  approval_register.associate = function(models) {
    approval_register.hasMany(models.approval_register_sign, { foreignKey: 'approval_register_id', as: 'Signs' })

    approval_register.hasMany(models.approval_register_file, { foreignKey: 'approval_register_id', as: 'Files' })
  };
  return approval_register
};