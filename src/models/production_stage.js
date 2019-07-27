'use strict'
module.exports = (sequelize, DataTypes) => {
  const production_stage = sequelize.define('production_stage', {
    production_id: DataTypes.INTEGER,
    budget: DataTypes.DOUBLE,
    name: DataTypes.STRING,
    label: DataTypes.STRING,
    data: DataTypes.TEXT,
    status: DataTypes.STRING,
    display: DataTypes.STRING
  }, {})

  production_stage.associate = function (models) {
    // associations can be defined here
  }
  return production_stage
}
