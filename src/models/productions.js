'use strict';
module.exports = (sequelize, DataTypes) => {
  const productions = sequelize.define('productions', {
    crop_id: DataTypes.INTEGER
  }, {})

  productions.associate = function (models) {
    productions.hasMany(models.production_stage, { foreignKey: 'production_id', as: 'Stage' })
  }

  return productions;
}