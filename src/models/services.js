'use strict';
module.exports = (sequelize, DataTypes) => {
  const services = sequelize.define('services', {
    name: DataTypes.STRING,
    type_id: DataTypes.INTEGER,
    stage: {
      type: DataTypes.ENUM,
      values: ['all']
    },
    keywords: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  services.associate = function(models) {
    services.belongsTo(models.service_types, { foreignKey: 'type_id' })
  };
  return services;
};