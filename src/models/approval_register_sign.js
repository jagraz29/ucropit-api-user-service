'use strict';
module.exports = (sequelize, DataTypes) => {
  const approval_register_sign = sequelize.define('approval_register_sign', {
    approval_register_id: DataTypes.INTEGER,
    hash: DataTypes.TEXT,
    ots: DataTypes.TEXT,
    meta: DataTypes.TEXT,
    user_id: DataTypes.INTEGER
  }, {});
  approval_register_sign.associate = function(models) {
    // associations can be defined here
  };
  return approval_register_sign;
};