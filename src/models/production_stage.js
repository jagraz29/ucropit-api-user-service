'use strict'
module.exports = (sequelize, DataTypes) => {
  const production_stage = sequelize.define('production_stage', {
    production_id: DataTypes.INTEGER,
    budget: DataTypes.DOUBLE,
    name: DataTypes.STRING,
    label: DataTypes.STRING,
    data: DataTypes.TEXT,
    data_formatter: {
      type: DataTypes.VIRTUAL,
      get() {
        return JSON.parse(this.data)
      }
    },
    status: DataTypes.STRING,
    display: DataTypes.STRING,
    order: DataTypes.STRING
  }, {})

  production_stage.associate = function (models) {
    // associations can be defined here
  }
  return production_stage
}
