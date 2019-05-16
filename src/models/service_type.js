'use strict';
module.exports = (sequelize, DataTypes) => {
  const service_type = sequelize.define('service_type', {
    name: DataTypes.STRING,
    image: DataTypes.STRING
  }, {});
  service_type.associate = function(models) {
    // associations can be defined here
  };
  return service_type;
};