'use strict';
module.exports = (sequelize, DataTypes) => {
  const input_type = sequelize.define('input_types', {
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    image: DataTypes.STRING
  }, {});
  input_type.associate = function(models) {
    // associations can be defined here
  };
  return input_type;
};