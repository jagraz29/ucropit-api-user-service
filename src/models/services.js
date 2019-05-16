'use strict';
module.exports = (sequelize, DataTypes) => {
  const services = sequelize.define('services', {
    name: DataTypes.STRING,
    type: DataTypes.INTEGER,
    stage: DataTypes.ENUM,
    keywords: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  services.associate = function(models) {
    // associations can be defined here
  };
  return services;
};