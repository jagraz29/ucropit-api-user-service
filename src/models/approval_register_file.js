'use strict';
module.exports = (sequelize, DataTypes) => {
  const approval_register_file = sequelize.define('approval_register_file', {
    approval_register_id: DataTypes.INTEGER,
    path: DataTypes.STRING,
    concept: DataTypes.STRING,
    type: DataTypes.STRING
  }, {});
  approval_register_file.associate = function(models) {
    // associations can be defined here
  };
  return approval_register_file;
};