'use strict'
module.exports = (sequelize, DataTypes) => {
  const inputs = sequelize.define('inputs', {
    unit_id: DataTypes.INTEGER,
    code: DataTypes.STRING,
    stage: {
      type: DataTypes.ENUM,
      values: ['all']
    },
    type_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {});
  inputs.associate = function(models) {
    inputs.belongsTo(models.input_types, { foreignKey: 'type_id' })
  };
  return inputs
};